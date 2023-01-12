const sqlCon = require("../db/connection");
const DateTimeService = require("../services/DateTimeService");

const excelToJson = require("convert-excel-to-json");
const fs = require("fs-extra");
const func = require("../services/excel");

var superUsers = ["admin@pngtimeaccess.com", "pngtimeaccess@gmail.com"];

var joinQuery = `SELECT users.id, users.surname, users.given_name, users.job_title, users.organisation, users.access_privilege, users.admin_location_id, admin_locations.admin_location, admin_locations.admin_desc, users.account_no_desc, users.paypoint_desc, users.office_phone, users.mobile_number, users.email, users.password, users.created_by, users.status, users.created_at, users.updated_at
FROM users
INNER JOIN admin_locations ON users.admin_location_id=admin_locations.id`;

const getAllUsers = (req, res) => {
  sqlCon.query(
    `SELECT u.*, admin.admin_location, admin.admin_desc FROM users AS u LEFT JOIN admin_locations AS admin ON u.admin_location_id=admin.id `,
    (err, results) => {
      if (err) return res.sendStatus(400);
      return res.send(results);
    }
  );
};

const getAllAdminLocations = (req, res) => {
  sqlCon.query("SELECT * FROM admin_locations", (err, results) => {
    if (err) return res.sendStatus(400);
    return res.send(results);
  });
};

const getAllAdminLocationsByUserType = (req, res) => {
  sqlCon.query(
    `SELECT * FROM admin_locations WHERE user_type = '${req.params.user_type}'`,
    (err, results) => {
      if (err) return res.sendStatus(400);
      return res.send(results);
    }
  );
};

const getAdminLocationById = (req, res) => {
  sqlCon.query(
    `SELECT * FROM admin_locations WHERE id = ${req.params.id}`,
    (err, results) => {
      if (err) return res.sendStatus(400);
      return res.send(results[0]);
    }
  );
};

const getUserByEmail = (req, res) => {
  if (superUsers.includes(req.params.email)) {
    sqlCon.query(
      `SELECT * FROM users WHERE email = '${req.params.email}'`,
      (err, results) => {
        if (err) return res.sendStatus(400);
        return res.send(results[0]);
      }
    );
  } else {
    sqlCon.query(
      `SELECT * FROM users WHERE email = '${req.params.email}'`,
      (err, results) => {
        if (err) return res.sendStatus(400);
        return res.send(results[0]);
      }
    );
  }
};

const getUsersByAdminLocationId = (req, res) => {
  sqlCon.query(
    `${joinQuery} WHERE admin_location_id = ${req.params.admin_location_id}`,
    (err, results) => {
      if (err) return res.sendStatus(400);
      return res.send(results);
    }
  );
};

const insertLogin = (login) => {
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
};

const postAdminLocation = (req, res) => {
  var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());

  sqlCon.query(
    `INSERT INTO admin_locations (admin_location, admin_desc, user_type, created_by, created_at, updated_at)
        SELECT ?,?,?,?,?,?
        FROM DUAL
        WHERE NOT EXISTS(
            SELECT 1
            FROM admin_locations
            WHERE admin_location = '${req.body.admin_location}'
        )
        LIMIT 1;`,
    [
      req.body.admin_location,
      req.body.admin_desc,
      req.body.user_type,
      req.body.created_by,
      currentLocalTime,
      currentLocalTime,
    ],
    (err, results) => {
      if (err) return res.sendStatus(400);
      if (results === {}) return res.sendStatus(400);
      if (results.insertId === 0) return res.sendStatus(400);
      var user = req.body;
      var newLogin = {
        email: user.email,
        password: user.password,
        access_privilege: user.access_privilege,
        status: user.status,
      };
      insertLogin(newLogin);
      return res.send(results);
    }
  );
};

const updateAdminLocation = (req, res) => {
  var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
  var updatedAt = new Date(currentLocalTime).toISOString();

  var mysqlqurey = `SET SQL_MODE='ALLOW_INVALID_DATES';
  UPDATE admin_locations SET
  admin_location=?,
  admin_desc=?,
  user_type=?,
  created_by=?,
  created_at=?,
  updated_at=?'
  WHERE id=?;`;

  try {
    sqlCon.query(
      `SET SQL_MODE='ALLOW_INVALID_DATES';
       UPDATE admin_locations SET
       admin_location='${req.body.admin_location}',
       admin_desc='${req.body.admin_desc}',
       user_type='${req.body.user_type}',
       created_by='${req.body.created_by}',
       created_at='${updatedAt}',
       updated_at='${updatedAt}'
       WHERE id=${req.body.id};`,
      mysqlqurey,

      (err, results) => {
        console.log(err, results);
        if (err) return res.sendStatus(400);
        return res.send(results);
      }
    );
  } catch (error) {
    console.log("TRY CATCH - ", error);
  }
};

const postUser = (req, res) => {
  var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
  sqlCon.query(
  `INSERT INTO users (surname, given_name,email,job_title,organisation,access_privilege,office_phone,password,company,birthday,position_number,position_refrence,position_title,buisness_unit,
    emp_number,clevel,frz,funding,account,award,class,gender,first_commerce,step,con_occ,con_occ_name,hda_occ,hda_occ_name,admin_location_id,account_no_desc,paypoint_desc,mobile_number,residential_address,created_by,status,created_at,updated_at
  ) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
          FROM DUAL
          WHERE NOT EXISTS(
              SELECT 1
              FROM users
              WHERE email = '${req.body.email}'
          )
          LIMIT 1;`,
  [
  req.body.surname,
  req.body.given_name,
  req.body.email,
  req.body.job_title,
  req.body.organisation,
  req.body.access_privilege,
  req.body.office_phone,
  req.body.password,
  req.body.company,
  req.body.birthday,
  req.body.position_number,
  req.body.position_refrence,
  req.body.position_title,
  req.body.buisness_unit,
  req.body.emp_number,
  req.body.clevel,
  req.body.frz,
  req.body.funding,
  req.body.account,
  req.body.award,
  req.body.class,
  req.body.gender,
  req.body.first_commerce,
  req.body.step,
  req.body.con_occ,
  req.body.con_occ_name,
  req.body.hda_occ,
  req.body.hda_occ_name,
  req.body.admin_location_id,
  req.body.account_no_desc,
  req.body.paypoint_desc,
  req.body.mobile_number,
  req.body.residential_address,
  req.body.created_by,
  req.body.status,
  currentLocalTime,
  currentLocalTime
  ],

    (err, results) => {
  console.log(results, err);
  if (err) return res.sendStatus(400);
  if (results === {}) return res.sendStatus(400);
  if (results.insertId === 0) return res.sendStatus(400);
  var user = req.body;
  var newLogin = {
    email: user.email,
    password: user.password,
    access_privilege: user.access_privilege,
    status: user.status,
  };
  insertLogin(newLogin);
  return res.send(results);
}
  );
};

const updateUser = (req, res) => {
  var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
  var updatedAt = new Date(currentLocalTime).toISOString();

  sqlCon.query(
    `
        SET SQL_MODE='ALLOW_INVALID_DATES';
        UPDATE users 
        SET 
        surname = '${req.body.surname}',
        given_name = '${req.body.given_name}',
        job_title = '${req.body.job_title}',
        organisation = '${req.body.organisation}',
        access_privilege = '${req.body.access_privilege}',
        admin_location_id = '${req.body.admin_location_id}',
        account_no_desc = '${req.body.account_no_desc}',
        paypoint_desc = '${req.body.paypoint_desc}',
        office_phone = '${req.body.office_phone}',
        mobile_number = '${req.body.mobile_number}',
        email = '${req.body.email}',
        password = '${req.body.password}',
        created_by = '${req.body.created_by}',
        updated_at = '${updatedAt}'
        WHERE email = '${req.body.email}';`,
    (err, results) => {
      if (err) return res.sendStatus(400);
      return res.send(results);
    }
  );
};

const deleteUser = (req, res) => {
  sqlCon.query(
    `DELETE FROM users WHERE email = '${req.params.email}';`,
    (err, results) => {
      if (err) return res.sendStatus(400);
      return res.send(results);
    }
  );
};

const changeUserStatus = (req, res) => {
  var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
  var updatedAt = new Date(currentLocalTime).toISOString();
  sqlCon.query(
    `SET SQL_MODE='ALLOW_INVALID_DATES';
        UPDATE users 
        SET 
        status = '${req.body.status}',
        updated_at = '${updatedAt}'
        WHERE email = '${req.body.email}';`,
    (err, results) => {
      if (err) return res.sendStatus(400);
      var login = {
        email: req.body.email,
        status: req.body.status,
      };
      changeLoginStatus(login);
      return res.send(results);
    }
  );
};

const changeLoginStatus = (login) => {
  var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
  var updatedAt = new Date(currentLocalTime).toISOString();
  sqlCon.query(
    `SET SQL_MODE='ALLOW_INVALID_DATES';
        UPDATE logins 
        SET 
        status = '${login.status}',
        updated_at = '${updatedAt}'
        WHERE email = '${login.email}';`,
    (err, results) => {
      if (err) return {};
      if (results.length == 0) return {};
      return results[0];
    }
  );
};

const nonTeacherExcelUpload = async (req, res) => {
  try {
    if (req.file?.filename == null || req.file?.filename == "undefined") {
      res.status(400).json("No File");
    } else {
      var filePath = "uploads/" + req.file.filename;
      const excelData = excelToJson({
        sourceFile: filePath,
        header: {
          rows: 1,
        },
        columnToKey: {
          "*": "{{columnHeader}}",
        },
      });

      await fs.remove(filePath);

      const data = await func(excelData, "Non-Teacher");

      res.status(200).send({ fail: data, res: data });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const teacherExcelUpload = async (req, res) => {
  try {
    if (req.file?.filename == null || req.file?.filename == "undefined") {
      res.status(400).json("No File");
    } else {
      var filePath = "uploads/" + req.file.filename;

      const excelData = excelToJson({
        sourceFile: filePath,
        header: {
          rows: 1,
        },
        columnToKey: {
          "*": "{{columnHeader}}",
        },
      });
      // await fs.remove(filePath);

      const data = await func(excelData, "Teacher");

      res.status(200).send({ fail: data, res: data });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getAllUsers,
  getAllAdminLocations,
  getAllAdminLocationsByUserType,
  getUsersByAdminLocationId,
  getAdminLocationById,
  getUserByEmail,
  postUser,
  updateUser,
  deleteUser,
  changeUserStatus,
  changeLoginStatus,
  postAdminLocation,
  updateAdminLocation,
  nonTeacherExcelUpload,
  teacherExcelUpload,
};
