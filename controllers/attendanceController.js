const sqlCon = require("../db/connection");
const DateTimeService = require('../services/DateTimeService');

var joinQuery = `SELECT employees.id, employees.employee_no, employees.name_report, employees.admin_desc, employees.occup_pos_title, attendances.clocked_in, attendances.clocked_out, attendances.worked_hours, attendances.date, employees.admin_location_id
                FROM attendances
                INNER JOIN employees`

const getAllAttendances = (req, res) => {
    sqlCon.query(`${joinQuery}`, (err, results) => {
        if(err) return res.sendStatus(400);
        if(results.length == 0) res.send({"msg": "No results"})
        return res.send(results);
    })
};

const getAttendanceByEmployeeNo = (req, res) => {
    sqlCon.query(`SELECT * FROM attendances WHERE employee_no = '${req.params.employee_no}'`, (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results);
    })
}

const getAttendanceByEmployeeNoAndDate = (req, res) => {
    sqlCon.query(`SELECT * FROM attendances WHERE employee_no = '${req.params.employee_no}' AND date = '${req.params.date}'`, (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results);
    })
}

const getReportsAdminDesc = (req, res) => {
    sqlCon.query(`SELECT * FROM attendances`, (err, results) => {
        if (err) return res.sendStatus(400);
        return res.send(results);
    })
}

const postAttendance = (req, res) => {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    sqlCon.query(
        `INSERT INTO attendances (employee_no, name_report, admin_desc, occup_pos_title, clocked_in, clocked_out, worked_hours, created_at, updated_at, date)
            SELECT ?,?,?,?,?,?,?,?,?,?
            FROM DUAL
            WHERE NOT EXISTS(
                SELECT 1
                FROM attendances
                WHERE employee_no = '${req.body.employee_no}' AND date = '${req.body.date}'
            )
            LIMIT 1;`,
            [ 
                req.body.employee_no,
                req.body.name_report,
                req.body.admin_desc,
                req.body.occup_pos_title,
                req.body.clocked_in,
                req.body.clocked_out,
                req.body.clocked_out - req.body.clocked_in,
                currentLocalTime,
                currentLocalTime,
                req.body.date,
            ]
    , (err, results) => {
        if(err) return res.sendStatus(400);
        if(results === {}) return res.sendStatus(400); 
        return res.send(results);
    })
}

const updateAttendance = (req, res) => {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    var updatedAt = new Date(currentLocalTime).toISOString();
  
    sqlCon.query(
        `
        SET SQL_MODE='ALLOW_INVALID_DATES';
        UPDATE attendances 
        SET 
        employee_no = '${req.body.employee_no}',
        name_report = '${req.body.name_report}',
        admin_desc = '${req.body.admin_desc}',
        occup_pos_title = '${req.body.occup_pos_title}',
        clocked_in = '${req.body.clocked_in}',
        clocked_out = '${req.body.clocked_out}',
        worked_hours = '${req.body.worked_hours}',
        updated_at = '${updatedAt}',
        WHERE employee_no = '${req.body.employee_no}',
        date = '${req.body.date}';`
    , (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results); 
    })
}

const deleteAttendance = (req, res) => {
    sqlCon.query(
        `DELETE FROM attendances WHERE employee_no = '${req.params.employee_no}';`
    , (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results);
    })
}

const recordClockedOutTime = (req, res) => {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    var updatedAt = new Date(currentLocalTime).toISOString();
    sqlCon.query(
        `SET SQL_MODE='ALLOW_INVALID_DATES';
        UPDATE attendances 
        SET 
        clocked_out = '${req.body.clocked_out}',
        worked_hours = '${req.body.worked_hours}',
        updated_at = '${updatedAt}'
        WHERE employee_no = '${req.body.employee_no}' AND date = '${req.body.date}';`
    , (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results); 
    })
}

module.exports = {
    getAllAttendances,
    getAttendanceByEmployeeNo,
    getAttendanceByEmployeeNoAndDate,
    getReportsAdminDesc,
    postAttendance,
    updateAttendance,
    deleteAttendance,
    recordClockedOutTime
};

