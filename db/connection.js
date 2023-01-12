require("dotenv").config();
const fs = require("fs");
const mysql = require("mysql2");

var dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clock',
    multipleStatements: true,
    timezone: "+00:00"
})

// var dbConnection = mysql.createConnection({
//   host: "db-mysql-blr1-21407-do-user-12998360-0.b.db.ondigitalocean.com",
//   user: "doadmin",
//   password: "AVNS_gXIfEprbnMSLVnuegeI",
//   database: "defaultdb",
//   port:"25060",
//   waitForConnections: true
// //   ssl: {
// //     ca: fs.readFileSync('ca/ca-certificate.crt').toString()
// //   }
// });

dbConnection.connect((err) => {
  console.log("hello");
  if (!err) {
    console.log("Database connected successfully");
  } else {
    console.log(err, "---");
    console.log("Database connection failed");
  }
});

module.exports = dbConnection;
