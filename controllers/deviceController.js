const sqlCon = require("../db/connection");
const DateTimeService = require('../services/DateTimeService');

var joinQuery = `SELECT devices.id, devices.admin_location_id, admin_locations.admin_location, admin_locations.admin_desc, devices.account_no_desc, devices.paypoint_desc, devices.mac_address, devices.ip_address, devices.device_name, devices.make_or_model, devices.gps_location, devices.status, devices.created_by, devices.created_at, devices.updated_at
FROM devices
INNER JOIN admin_locations ON devices.admin_location_id=admin_locations.id`;

const getAllDevices = (req, res) => {
    sqlCon.query(`${joinQuery}`, (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results);
    })
};

const getDevicesByAdminLocationId = (req, res) => {
    sqlCon.query(`${joinQuery} WHERE admin_location_id = ${req.params.admin_location_id}`, (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results);
    })
};

const getDeviceByUniqueKey = (req, res) => {
    sqlCon.query(`${joinQuery} WHERE device_name = '${req.params.device_name}' AND mac_address = '${req.params.mac_address}' AND ip_address = '${req.params.ip_address}';`, (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results[0]);
    })
}

const getDeviceById = (req, res) => {
    sqlCon.query(`${joinQuery} WHERE devices.id = ${req.params.id};`, (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results[0]);
    })
}

const postDevice = (req, res) => {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    sqlCon.query(
        `INSERT INTO devices (admin_location_id, account_no_desc, paypoint_desc, mac_address, ip_address, device_name, make_or_model, gps_location, status, created_by, created_at, updated_at)
        SELECT ?,?,?,?,?,?,?,?,?,?,?,?
        FROM DUAL
        WHERE NOT EXISTS(
            SELECT 1
            FROM devices
            WHERE device_name = '${req.body.device_name}' AND mac_address = '${req.body.mac_address}' AND ip_address = '${req.body.ip_address}'  
        )
        LIMIT 1;`,
        [
            req.body.admin_location_id,
            req.body.account_no_desc,
            req.body.paypoint_desc,
            req.body.mac_address,
            req.body.ip_address,
            req.body.device_name,
            req.body.make_or_model,
            req.body.gps_location,
            req.body.status,
            req.body.created_by,
            currentLocalTime,
            currentLocalTime,
        ]
    , (err, results) => {
        if(err) return res.sendStatus(400);
        if(results === {}) return res.sendStatus(400); 
        return res.send(results);
    })
}

const updateDevice = (req, res) => {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    var updatedAt = new Date(currentLocalTime).toISOString();
  
    req.body.admin_location_id,
    req.body.account_no_desc,
    req.body.paypoint_desc,
    req.body.mac_address,
    req.body.ip_address,
    req.body.device_name,
    req.body.make_or_model,
    req.body.gps_location,
    req.body.status,
    req.body.created_by,
    currentLocalTime,
    currentLocalTime,

    sqlCon.query(
        `
        SET SQL_MODE='ALLOW_INVALID_DATES';
        UPDATE devices 
        SET 
        admin_location_id = '${req.body.admin_location_id}',
        account_no_desc = '${req.body.account_no_desc}',
        paypoint_desc = '${req.body.paypoint_desc}',
        mac_address = '${req.body.mac_address}',
        ip_address = '${req.body.ip_address}',
        device_name = '${req.body.device_name}',
        make_or_model = '${req.body.make_or_model}',
        gps_location = '${req.body.gps_location}',
        status = '${req.body.status}',
        created_by = '${req.body.created_by}',
        updated_at = '${updatedAt}'
        WHERE id = ${req.body.id};`
    , (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results); 
    })
}

const deleteDevice = (req, res) => {
    sqlCon.query(
        `DELETE FROM device_name = '${req.params.device_name}' AND mac_address = '${req.params.mac_address}' AND ip_address = '${req.params.ip_address}';`
    , (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results);
    })
}

const changeDeviceStatus = (req, res) => {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    var updatedAt = new Date(currentLocalTime).toISOString();
    sqlCon.query(
        `SET SQL_MODE='ALLOW_INVALID_DATES';
        UPDATE devices 
        SET 
        status = '${req.body.status}',
        updated_at = '${updatedAt}'
        WHERE id = ${req.body.id};`
    , (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results); 
    })
}

module.exports = {
    getAllDevices,
    getDeviceByUniqueKey,
    getDevicesByAdminLocationId,
    getDeviceById,
    postDevice,
    updateDevice,
    deleteDevice,
    changeDeviceStatus
};

