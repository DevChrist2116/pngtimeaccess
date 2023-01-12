const express = require('express');
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

router.get("/", attendanceController.getAllAttendances);
router.get("/:employee_no", attendanceController.getAttendanceByEmployeeNo);
router.get("/:employee_no/:date", attendanceController.getAttendanceByEmployeeNoAndDate);

router.post("/", attendanceController.postAttendance);

router.put("/clocked-out", attendanceController.recordClockedOutTime);

router.delete("/:employee_no", attendanceController.deleteAttendance);

module.exports = router;