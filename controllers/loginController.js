const sqlCon = require("../db/connection");
const DateTimeService = require("../services/DateTimeService");

const loginUser = (req, res) => {
  sqlCon.query(
    `SELECT * FROM logins WHERE email = '${req.body.email}' AND password = '${req.body.password}' AND status = 'Active'`,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.send({});
      }
      if (results.length == 0) return res.send({});
      return res.send(results[0]);
    }
  );
};

module.exports = {
  loginUser,
};
