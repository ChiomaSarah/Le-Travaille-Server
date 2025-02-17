const bcrypt = require("bcrypt");
const { hashPassword } = require("../utils/hashPassword");
const jwtGenerator = require("../utils/jwtGenerator.js");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const {
  findUserByEmail,
  createNewUser,
  updatePasswordResetToken,
  updateUserPassword,
  findUserByResetToken,
} = require("../dbQueries.js");

const signUp = async (req, res) => {
  const file = req.files?.image;
  const { username, email, password, age, degree, experience, location } =
    req.body;

  try {
    const user = await findUserByEmail(email);
    if (user) {
      return res
        .status(409)
        .json({ message: "User with that email already exists." });
    }

    const hash = await hashPassword(password);
    const imageUpload = await cloudinaryUpload(file.tempFilePath);

    const newUser = await createNewUser({
      username,
      email,
      password: hash,
      age,
      degree,
      experience,
      location,
      image_url: imageUpload.secure_url,
      cloudinary_id: imageUpload.public_id,
    });

    const token = jwtGenerator(newUser.user_id);
    return res
      .status(201)
      .json({ status: "success", data: { user: newUser, token } });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "No user with that email found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwtGenerator(user.user_id);

    const userData = {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      age: user.age,
      degree: user.degree,
      experience: user.experience,
      location: user.location,
      image_url: user.image_url,
    };

    return res.status(200).json({
      message: "Login Successful!",
      token,
      user: userData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user with that email found." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Set expiration to 1 hour.

    await updatePasswordResetToken(user.user_id, resetToken, resetTokenExpiry);

    const resetLink = `https://le-travaille-app.netlify.app/auth/reset-password?token=${resetToken}`;
    await sendEmail(
      user.email,
      "Password Reset",
      `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #333;">Password Reset Request</h2>
              <p style="font-size: 16px; color: #555;">Dear ${user.username},</p>
              <p style="font-size: 16px; color: #555;">We received a request to reset your password. If you did not request this, please ignore this email.</p>
              <p style="font-size: 16px; color: #555;">Click the link below to reset your password:</p>
              <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
              <p style="font-size: 14px; color: #888; margin-top: 20px;">This link will expire in 1 hour.</p>
              <p style="font-size: 16px; color: #555; margin-top: 30px;">Best regards,</p>
              <p style="font-size: 16px; color: #555;"><strong>Le-Travaille Team</strong></p>
            </div>
          </body>
        </html>
      `
    );

    return res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to process request", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await findUserByResetToken(token);
    if (!user || user.reset_token_expiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Check if the new password matches the old one.
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message:
          "Oopsie! Your new password must be different from the previous one.",
      });
    }

    const hashedResetPassword = await hashPassword(newPassword);

    // Update the password and clear the reset token.
    await updateUserPassword(user.user_id, hashedResetPassword);

    return res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to reset password", error: error.message });
  }
};

module.exports = { signUp, login, forgotPassword, resetPassword };
