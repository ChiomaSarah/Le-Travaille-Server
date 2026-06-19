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
      .json({ status: "Success", data: { user: newUser, token } });
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
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await updatePasswordResetToken(user.user_id, resetToken, resetTokenExpiry);

    const resetLink = `https://le-travaille-app.netlify.app/auth/reset-password?token=${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset - Le-Travaille",
      `
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; padding: 20px; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #00786F; font-size: 28px; font-weight: 700; margin: 0;">
                  Le-Travaille
                </h1>
                <p style="color: #666; font-size: 14px; margin: 5px 0 0;">
                  Your Career Journey Starts Here
                </p>
              </div>
              
              <div style="border-top: 3px solid #00786F; margin-bottom: 30px;"></div>
              
              <!-- Main Content -->
              <h2 style="color: #1A2332; font-size: 22px; font-weight: 600; margin-bottom: 16px;">
                Password Reset Request
              </h2>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 8px;">
                Dear <strong style="color: #00786F;">${user.username}</strong>,
              </p>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                We received a request to reset your password for your Le-Travaille account. If you didn't make this request, you can safely ignore this email.
              </p>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Click the button below to reset your password:
              </p>
              
              <!-- Reset Button -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${resetLink}" style="display: inline-block; padding: 14px 40px; font-size: 16px; font-weight: 600; color: white; background-color: #00786F; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 120, 111, 0.3);">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #888; font-size: 13px; text-align: center; margin-bottom: 24px;">
                ⏰ This link will expire in <strong style="color: #1A2332;">1 hour</strong>.
              </p>
              
              <!-- Fallback Link -->
              <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 10px;">
                <p style="color: #999; font-size: 13px; text-align: center; margin: 0;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="color: #00786F; font-size: 12px; text-align: center; word-break: break-all; margin: 8px 0 0;">
                  ${resetLink}
                </p>
              </div>
              
              <!-- Do Not Reply Notice -->
              <div style="margin-top: 30px; padding: 16px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #00786F;">
                <p style="color: #888; font-size: 12px; text-align: center; margin: 0; line-height: 1.5;">
                  ⚠️ <strong>This is an automated message.</strong> Please do not reply to this email. 
                  If you need assistance, visit our <a href="https://le-travaille-app.netlify.app" style="color: #00786F; text-decoration: none; font-weight: 500;">Help Center</a>.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                  &copy; 2024 Le-Travaille. All rights reserved.
                </p>
                <p style="color: #ccc; font-size: 11px; text-align: center; margin: 5px 0 0;">
                  This email was sent to ${user.email}
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    );

    return res
      .status(200)
      .json({ message: "A password reset email has been sent to you." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res
      .status(500)
      .json({ message: "Failed to process request", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await findUserByResetToken(token);
    if (!user || new Date(user.reset_token_expiry) < new Date()) {
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
