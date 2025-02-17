const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const getAllUsers = require("../controllers/getAllUsers");
const getUserById = require("../controllers/getUserById");
const updateUserProfile = require("../controllers/updateUserProfile");
const deleteUserProfile = require("../controllers/deleteUserProfile");

router.get("/users", verifyToken, getAllUsers);
router.get("/:user_id", getUserById);
router.patch("/:user_id", updateUserProfile);
router.delete("/:user_id", deleteUserProfile);

module.exports = router;
