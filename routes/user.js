const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const getAllUsers = require("../controllers/getAllUsers");
const getUserById = require("../controllers/getUserById");
const updateUser = require("../controllers/updateUser");
const deleteUserProfile = require("../controllers/deleteUserProfile");

router.get("/users", verifyToken, getAllUsers);
router.get("/:user_id", getUserById);
router.patch("/dashboard/:user_id", updateUser);
router.delete("/dashboard/:user_id", deleteUserProfile);

module.exports = router;
