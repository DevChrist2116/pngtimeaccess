const express = require('express');
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.get('/', employeeController.getAllEmployees);
router.get('/:type', employeeController.getEmployeesByType);
router.get('/:type/:admin_location_id', employeeController.getEmployeesByTypeAndAdminLocationId);
router.get('/type/admin_desc/:employee_no', employeeController.getEmployeeByEmployeeNo);

router.post('/', employeeController.postEmployee);
router.put('/', employeeController.updateEmployee);
router.put('/status', employeeController.changeEmployeeStatus);

router.delete('/:employee_no', employeeController.deleteEmployee);

module.exports = router;


