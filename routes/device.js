const express = require('express');
const router = express.Router();
const deviceController = require("../controllers/deviceController");

router.get("/", deviceController.getAllDevices);
router.get("/:device_name/:mac_address/:ip_address", deviceController.getDeviceByUniqueKey);
router.get("/admin-locations/:admin_location_id", deviceController.getDevicesByAdminLocationId);
router.get("/:id", deviceController.getDeviceById);

router.post("/", deviceController.postDevice);

router.put("/", deviceController.updateDevice);
router.put("/status", deviceController.changeDeviceStatus);

router.delete("/:device_name/:mac_address/:ip_address", deviceController.deleteDevice);

module.exports = router;


