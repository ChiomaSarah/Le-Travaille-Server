const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const validEmail = require("../middleware/validEmail");

router.post("/signup", validEmail, signUp);
router.post("/login", validEmail, login);
router.post("/forgot-password", validEmail, forgotPassword);
router.patch("/reset-password", resetPassword);

module.exports = router;
