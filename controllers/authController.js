const bcrypt = require("bcrypt");
const { hashPassword } = require("../utils/hashPassword");
const jwtGenerator = require("../utils/jwtGenerator.js");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const { findUserByEmail, createNewUser } = require("../dbQueries.js");

const signUp = async (req, res) => {
  const file = req.files?.image;
  const { username, email, password, age, degree, experience, location } =
    req.body;

  try {
    const user = await findUserByEmail(email);
    if (user) {
      return res
        .status(409)
        .json({ error: "User with that email already exists." });
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
      return res.status(401).json({ error: "No user with that email found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password." });
    }

    const token = jwtGenerator(user.user_id);
    return res.status(200).json({ message: "Success!", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
};

module.exports = { signUp, login };
