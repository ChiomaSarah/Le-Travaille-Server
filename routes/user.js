const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const getUserDashboard = require("../controllers/getUserDashboard");
const getAllUsers = require("../controllers/getAllUsers");
const getUserById = require("../controllers/getUserById");
const updateUserProfile = require("../controllers/updateUserProfile");
const deleteUserProfile = require("../controllers/deleteUserProfile");

router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/users", getAllUsers);
router.get("/:user_id", getUserById);
router.patch("/dashboard/:user_id", updateUserProfile);
router.delete("/dashboard/:user_id", deleteUserProfile);

module.exports = router;
