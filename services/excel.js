const sqlCon = require("../db/connection");
const DateTimeService = require("./DateTimeService");

async function func(excelData,type) {
  var currentLocalTime = new DateTimeService().getLocalDateTime(new Date());
  var FailedArray = [];
  await excelData.Sheet1.map(async (val, idx) => {
    sqlCon.query(`SELECT * FROM admin_locations WHERE user_type = "${type}" AND admin_location = "${val['Admin Location']}"`, (err, results) => {
      if (err) {
        return;
      }
      if (results === {}) {
        return;
      }
      let aa = [
        type,
         val["Employee No"],
         val["Name Report"],
         results[0].id,
         val["Admin Desc"],
         val["Position No"],
         val["Occup Pos Title"],
         val["Award"],
         val["Award Desc"],
         val["Classification"],
         val["Class Desc"],
         val["Step No"],
         val["Occup Type"],
         val["Gender"],
         val["First Commence"],
         val["Account No"],
         val["Account No Desc"],
         val["Emp Status"],
         val["paypoint"],
         val["Paypoint Desc"],
         val["Date Of Birth"],
         (new Date().getFullYear()- new Date(val["Date Of Birth"]).getFullYear()),
         val["Occup Pos Cat"],
         "Admin",
         "Active",
         currentLocalTime,
         currentLocalTime,
       ];
      sqlCon.query(
        `INSERT INTO employees (user_type, employee_no,
            name_report, admin_location_id, admin_desc, position_no, occup_pos_title, award,
            award_desc, classification, class_desc, step_no, occup_type, gender, first_commence, account_no,
            account_no_desc, emp_status, paypoint, paypoint_desc, date_of_birth, age, occup_pos_cat,
            created_by, status, created_at, updated_at)
            SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            FROM DUAL
            WHERE NOT EXISTS(
                SELECT 1
                FROM employees
                WHERE employee_no = '${val.Employee_No}'
            )
            LIMIT 1;`,
        aa,
        (err, results) => {
          if (err) return FailedArray.push(idx + 1);
          if (results === {}) return FailedArray.push(idx + 1);
          if (results.insertId === 0) return FailedArray.push(idx + 1);
        }
      );
    });
  });
  return "FailedArray";
}

module.exports = func;