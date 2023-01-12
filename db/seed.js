const sqlCon = require("./connection");
const DateTimeService = require("../services/DateTimeService");

// ----------- User types ----------------
// Super user
// Non-Teachers user
// Teachers user
// Admin location user
// Account No Desc user
// PayPoint Desc user

// ----------- User statuses -------------
// Active
// Archived
// Deleted

const users = [
  {
    email: "admin@pngtimeaccess.com",
    password: "pass",
    access_privilege: "Super user",
    status: "Active",
  },
  {
    email: "pngtimeaccess@gmail.com",
    password: "pass",
    access_privilege: "Super user",
    status: "Active",
  },
];

class Seed {
  constructor() {
    this.createAllTables();

    users.forEach((user) => {
      var createdUser = this.insertUser(user);
      if (createdUser !== {}) {
        var login = {
          email: user.email,
          password: user.password,
          access_privilege: user.access_privilege,
          status: user.status,
        };
        this.insertLogin(login);
      }
    });
  }

  insertLogin(login) {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    sqlCon.query(
      `INSERT INTO logins (email, password, access_privilege, status, created_at, updated_at)
            SELECT ?,?,?,?,?,?
            FROM DUAL
            WHERE NOT EXISTS(
                SELECT 1
                FROM logins
                WHERE email = '${login.email}'
            )
            LIMIT 1;`,
      [
        login.email,
        login.password,
        login.access_privilege,
        login.status,
        currentLocalTime,
        currentLocalTime,
      ],
      (err, results) => {
        if (err) return {};
        if (results.length == 0) return {};
        return results[0];
      }
    );
  }
  
  insertAttendance(attendance) {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    sqlCon.query(
      `INSERT INTO attendances (id, employee_no, name_report, admin_desc, occup_pos_title, clocked_in, clocked_out, worked_hours, date, created_at, updated_at)
            SELECT ?,?,?,?,?,?,?,?,?,?,?
            FROM DUAL
            WHERE NOT EXISTS(
                SELECT 1
                FROM attendances
                WHERE date = '${attendance.date}'
            )
            LIMIT 1;`,
      [
        attendance.id,
        attendance.employee_no,
        attendance.name_report,
        attendance.admin_desc,
        attendance.occup_pos_title,
        attendance.clocked_in,
        attendance.clocked_out,
        attendance.clocked_out-attendance.clocked_in,
        attendance.date,
        currentLocalTime,
        currentLocalTime,
      ],
      (err, results) => {
        if (err) return {};
        if (results.length == 0) return {};
        return results[0];
      }
    );
  }

  insertUser(user) {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    sqlCon.query(
      `INSERT INTO users (surname, given_name, job_title, organisation, access_privilege, admin_location_id, account_no_desc, paypoint_desc, office_phone, mobile_number, email, residential_address,password, created_by, status, created_at, updated_at)
            SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            FROM DUAL
            WHERE NOT EXISTS(
                SELECT 1
                FROM users
                WHERE email = '${user.email}'
            )
            LIMIT 1;`,
      [
        user.surname,
        user.given_name,
        user.job_title,
        user.organisation,
        user.access_privilege,
        user.admin_location_id,
        user.account_no_desc,
        user.paypoint_desc,
        user.office_phone,
        user.mobile_number,
        user.email,
        user.residential_address,
        user.password,
        user.created_by,
        user.status,
        currentLocalTime,
        currentLocalTime,
      ],
      (err, results) => {
        if (err) return {};
        if (results.length == 0) return {};
        return results[0];
      }
    );
  }

  insertEmployee(employee) {
    var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
    sqlCon.query(
      `INSERT INTO employees (user_type, employee_no,
            name_report, admin_location_id, position_no, occup_pos_title, award, award_desc, classification, class_desc, step_no, occup_type, gender, first_commence, account_no, account_no_desc, emp_status, paypoint, paypoint_desc, date_of_birth, age, occup_pos_cat, created_by, status, created_at, updated_at)
            SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            FROM DUAL
            WHERE NOT EXISTS(
                SELECT 1
                FROM employees
                WHERE employee_no = '${employee.employee_no}'
            )
            LIMIT 1;`,
      [
        employee.user_type,
        employee.employee_no,
        employee.name_report,
        employee.admin_location_id,
        employee.position_no,
        employee.occup_pos_title,
        employee.award,
        employee.award_desc,
        employee.classification,
        employee.class_desc,
        employee.step_no,
        employee.occup_type,
        employee.gender,
        employee.first_commence,
        employee.account_no,
        employee.account_no_desc,
        employee.emp_status,
        employee.paypoint,
        employee.paypoint_desc,
        employee.date_of_birth,
        employee.age,
        employee.occup_pos_cat,
        employee.created_by,
        employee.status,
        currentLocalTime,
        currentLocalTime,
      ],
      (err, results) => {
        if (err) return {};
        if (results.length == 0) return {};
        return results[0];
      }
    );
  }

  createAllTables() {
    let createTables = `
        CREATE TABLE if not exists logins (
            id INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(100),
            password VARCHAR(100),
            access_privilege VARCHAR(100),
            status VARCHAR(100),
            created_at DATETIME,
            updated_at DATETIME,
            PRIMARY KEY (id)
        );

        CREATE TABLE if not exists users (
            id INT AUTO_INCREMENT,
            surname VARCHAR(100),
            given_name VARCHAR(100),
            email VARCHAR(100),
            job_title VARCHAR(100),
            organisation VARCHAR(100),
            access_privilege VARCHAR(100),
            office_phone VARCHAR(100),
            password VARCHAR(100),
            company VARCHAR(200),
            birthday VARCHAR(100),
            position_number VARCHAR(100),
            position_refrence VARCHAR(100),
            position_title VARCHAR(100),
            buisness_unit VARCHAR(100),
            emp_number VARCHAR(100),
            clevel VARCHAR(100),
            frz VARCHAR(100),
            funding VARCHAR(100),
            account VARCHAR(100),
            award VARCHAR(100),
            class VARCHAR(100),
            gender VARCHAR(100),
            first_commerce VARCHAR(100),
            step VARCHAR(100),
            con_occ VARCHAR(100),
            con_occ_name VARCHAR(100),
            hda_occ VARCHAR(100),
            hda_occ_name VARCHAR(100),
            admin_location_id INT,
            account_no_desc VARCHAR(100),
            paypoint_desc VARCHAR(100),
            mobile_number VARCHAR(100),
            residential_address VARCHAR(500),
            created_by VARCHAR(100),
            status VARCHAR(100),
            created_at DATETIME,
            updated_at DATETIME,
            PRIMARY KEY (id)
        );

        CREATE TABLE if not exists employees (
            id INT NOT NULL AUTO_INCREMENT,
            user_type VARCHAR(100),
            employee_no VARCHAR(100) NOT NULL UNIQUE,
            name_report VARCHAR(100),
            admin_location_id INT,
            admin_desc VARCHAR(100),
            position_no VARCHAR(100),
            occup_pos_title VARCHAR(100),
            award VARCHAR(100),
            award_desc VARCHAR(100),
            classification VARCHAR(100),
            class_desc VARCHAR(100),
            step_no VARCHAR(100),
            occup_type VARCHAR(100),
            gender VARCHAR(100),
            first_commence VARCHAR(100),
            account_no VARCHAR(100),
            account_no_desc VARCHAR(100),
            emp_status VARCHAR(100),
            paypoint VARCHAR(100),
            paypoint_desc VARCHAR(100),
            date_of_birth VARCHAR(100),
            age VARCHAR(100),
            occup_pos_cat VARCHAR(100),
            created_by DATE,
            status VARCHAR(100),
            created_at DATETIME,
            updated_at DATETIME,
            PRIMARY KEY (id)
        );

        CREATE TABLE if not exists attendances (
            id INT NOT NULL AUTO_INCREMENT,
            employee_no INT(20),
            name_report VARCHAR(100),
            admin_desc VARCHAR(100),
            occup_pos_title VARCHAR(100),
            clocked_in TIME,
            clocked_out TIME,
            worked_hours TIME,
            created_at DATETIME,
            updated_at DATETIME,
            date DATE,
            admin_location_id INT,
            PRIMARY KEY (id)
        );
        
        CREATE TABLE if not exists devices (
            id INT NOT NULL AUTO_INCREMENT,
            admin_location_id INT,
            account_no_desc VARCHAR(100),
            paypoint_desc VARCHAR(100),
            mac_address VARCHAR(100),
            ip_address VARCHAR(100),
            device_name VARCHAR(100),
            make_or_model VARCHAR(100),
            gps_location VARCHAR(100),
            status VARCHAR(100),
            created_by VARCHAR(100),
            created_at DATETIME,
            updated_at DATETIME,
            PRIMARY KEY (id)
        );

        CREATE TABLE if not exists admin_locations (
            id INT NOT NULL AUTO_INCREMENT,
            admin_location VARCHAR(100),
            admin_desc VARCHAR(100),
            user_type VARCHAR(100),
            created_by VARCHAR(100),
            created_at DATETIME,
            updated_at DATETIME,
            PRIMARY KEY (id)
        );

        
        `;

    sqlCon.query(createTables, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      }
    });
  }
}

module.exports = Seed;
