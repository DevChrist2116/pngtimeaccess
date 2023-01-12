const sqlCon = require("../db/connection");
const DateTimeService = require('../services/DateTimeService');

var joinQuery = `SELECT employees.id, employees.user_type, employees.employee_no,
employees.name_report, employees.admin_location_id, admin_locations.admin_location, admin_locations.admin_desc, employees.position_no, employees.occup_pos_title, employees.award, employees.award_desc, employees.classification, employees.class_desc, employees.step_no, employees.occup_type, employees.gender, employees.first_commence, employees.account_no, employees.account_no_desc, employees.emp_status, employees.paypoint, employees.paypoint_desc, employees.date_of_birth, employees.age, employees.occup_pos_cat, employees.created_by, employees.status, employees.created_at, employees.updated_at
FROM employees
INNER JOIN admin_locations ON employees.admin_location_id=admin_locations.id`;

const getAllEmployees = (req, res) => {
    sqlCon.query(`SELECT * FROM admin_locations INNER JOIN employees ON employees.admin_location_id=admin_locations.id WHERE status != 'Deleted'`, (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results);
    })
};

const getEmployeesByType = (req, res) => {
    sqlCon.query(`${joinQuery} WHERE employees.user_type = '${req.params.type}' AND status != 'Deleted';`, (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results);
    })
};

const getEmployeesByTypeAndAdminLocationId = (req, res) => {
   
    sqlCon.query(`${joinQuery} WHERE employees.user_type = '${req.params.type}' AND admin_location_id = '${req.params.admin_location_id}' AND status != 'Deleted';`, (err, results) => {
        
        if(err) return res.sendStatus(400);
        return res.send(results);
    })
};

const getEmployeeByEmployeeNo = (req, res) => {
    sqlCon.query(`${joinQuery} WHERE employee_no = '${req.params.employee_no}';`, (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results[0]);
    })
}

const postEmployee = (req, res) => {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    sqlCon.query(
        `INSERT INTO employees (user_type, employee_no,
            name_report, admin_location_id, position_no, occup_pos_title, award,
            award_desc, classification, class_desc, step_no, occup_type, gender, first_commence, account_no,
            account_no_desc, emp_status, paypoint, paypoint_desc, date_of_birth, age, occup_pos_cat,
            created_by, status, created_at, updated_at)
            SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            FROM 
            DUAL
            WHERE NOT EXISTS(
                SELECT 1
                FROM employees
                WHERE employee_no = '${req.body.employee_no}'
            )
            LIMIT 1;`,
            [
                req.body.user_type, 
                req.body.employee_no,
                req.body.name_report,
                req.body.admin_location_id,
                req.body.position_no,
                req.body.occup_pos_title,
                req.body.award,
                req.body.award_desc,
                req.body.classification,
                req.body.class_desc,
                req.body.step_no,
                req.body.occup_type,
                req.body.gender,
                req.body.first_commence,
                req.body.account_no,
                req.body.account_no_desc,
                req.body.emp_status,
                req.body.paypoint,
                req.body.paypoint_desc,
                req.body.date_of_birth,
                req.body.age,
                req.body.occup_pos_cat,
                req.body.created_by,
                req.body.status,
                currentLocalTime,
                currentLocalTime,
            ]
    , (err, results) => {
        if(err) return res.sendStatus(400);
        if(results === {}) return res.sendStatus(400); 
        return res.send(results);
    })
}

const updateEmployee = (req, res) => {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    var updatedAt = new Date(currentLocalTime).toISOString();
  
    sqlCon.query(
        `
        SET SQL_MODE='ALLOW_INVALID_DATES';
        UPDATE employees 
        SET 
        user_type = '${req.body.user_type}',
        employee_no = '${req.body.employee_no}',
        name_report = '${req.body.name_report}',
        admin_location_id = '${req.body.admin_location_id}',
        position_no = '${req.body.position_no}',
        occup_pos_title = '${req.body.occup_pos_title}',
        award = '${req.body.award}',
        award_desc = '${req.body.award_desc}',
        classification = '${req.body.classification}',
        class_desc = '${req.body.class_desc}',
        step_no = '${req.body.step_no}',
        occup_type = '${req.body.occup_type}',
        gender = '${req.body.gender}',
        first_commence = '${req.body.first_commence}',
        account_no = '${req.body.account_no}',
        account_no_desc = '${req.body.account_no_desc}',
        emp_status = '${req.body.emp_status}',
        paypoint = '${req.body.paypoint}',
        paypoint_desc = '${req.body.paypoint_desc}',
        date_of_birth = '${req.body.date_of_birth}',
        age = '${req.body.age}',
        occup_pos_cat = '${req.body.occup_pos_cat}',
        created_by = '${req.body.created_by}',
        status = '${req.body.status}',
        updated_at = '${updatedAt}'
        WHERE employee_no = '${req.body.employee_no}';`
    , (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results); 
    })
}

const deleteEmployee = (req, res) => {
    sqlCon.query(
        `DELETE FROM employees WHERE employee_no = '${req.params.employee_no}';`
    , (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results);
    })
}

const changeEmployeeStatus = (req, res) => {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    var updatedAt = new Date(currentLocalTime).toISOString();
    sqlCon.query(
        `SET SQL_MODE='ALLOW_INVALID_DATES';
        UPDATE employees 
        SET 
        status = '${req.body.status}',
        updated_at = '${updatedAt}'
        WHERE employee_no = '${req.body.employee_no}';`
    , (err, results) => {
        if(err) return res.sendStatus(400);
        return res.send(results); 
    })
}

module.exports = {
    getAllEmployees,
    getEmployeesByType,
    getEmployeesByTypeAndAdminLocationId,
    getEmployeeByEmployeeNo,
    postEmployee,
    updateEmployee,
    deleteEmployee,
    changeEmployeeStatus
};

