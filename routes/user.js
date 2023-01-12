const express = require("express");
const router = express.Router();
const multer = require("multer");

const userController = require("../controllers/userController");

var upload = multer({ dest: "uploads/" });

router.get("/", userController.getAllUsers);
router.get("/admin-location/id/:id", userController.getAdminLocationById);
router.get("/:email", userController.getUserByEmail);
router.get(
  "/admin-location/:admin_location_id",
  userController.getUsersByAdminLocationId
);
router.get("/admin-locations/get-all", userController.getAllAdminLocations);
router.get(
  "/admin-locations/get-all/:user_type",
  userController.getAllAdminLocationsByUserType
);

router.post("/", userController.postUser);
router.post("/admin-location", userController.postAdminLocation);
router.post(
  "/excel/non-teacher",
  upload.single("file"),
  userController.nonTeacherExcelUpload
);
router.post(
  "/excel/teacher",
  upload.single("file"),
  userController.teacherExcelUpload
);

router.put("/", userController.updateUser);
router.put("/status", userController.changeUserStatus);
router.put("/admin-location/update", userController.updateAdminLocation);

router.delete("/:email", userController.deleteUser);

module.exports = router;
