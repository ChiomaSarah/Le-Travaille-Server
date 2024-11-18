const express = require("express");
const router = express.Router();
const { signUp, login } = require("../controllers/authController");
const validEmail = require("../middleware/validEmail");

router.post("/signup", validEmail, signUp);
router.post("/login", validEmail, login);

module.exports = router;
