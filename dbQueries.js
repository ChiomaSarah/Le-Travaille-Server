const client = require("./dbConfig");

const findUserByEmail = async (email) => {
  const user = await client.query("SELECT * FROM job_seeker WHERE email = $1", [
    email,
  ]);
  return user.rows[0];
};

const createNewUser = async (userData) => {
  const {
    username,
    email,
    password,
    age,
    degree,
    experience,
    location,
    image_url,
    cloudinary_id,
  } = userData;

  const result = await client.query(
    `INSERT INTO job_seeker (username, email, password, age, degree, experience, location, image_url, cloudinary_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      username,
      email,
      password,
      age,
      degree,
      experience,
      location,
      image_url,
      cloudinary_id,
    ]
  );

  return result.rows[0];
};

const getJobSeekerById = async (userId) => {
  try {
    const result = await client.query(
      "SELECT * FROM job_seeker WHERE user_id = $1",
      [userId]
    );
    return result.rows;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getAllJobSeekers = async () => {
  try {
    const result = await client.query("SELECT * FROM job_seeker");
    return result.rows;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateJobSeeker = async (
  userId,
  username,
  email,
  password,
  age,
  degree,
  experience,
  location
) => {
  try {
    const updates = {
      username,
      email,
      password,
      age,
      degree,
      experience,
      location,
    };

    // Filter out fields that are undefined or null.
    const validFields = Object.entries(updates).filter(
      ([key, value]) => value !== undefined && value !== null
    );

    const setClause = validFields
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = validFields.map(([_, value]) => value);
    values.push(userId);

    const query = `UPDATE job_seeker SET ${setClause} WHERE user_id = $${
      validFields.length + 1
    } RETURNING *`;

    const result = await client.query(query, values);

    return result.rows;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteJobSeeker = async (userId) => {
  try {
    const result = await client.query(
      "DELETE FROM job_seeker WHERE user_id = $1 RETURNING *",
      [userId]
    );
    return result.rows;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updatePasswordResetToken = async (
  userId,
  resetToken,
  resetTokenExpiry
) => {
  await client.query(
    "UPDATE job_seeker SET reset_token = $1, reset_token_expiry = $2 WHERE user_id = $3",
    [resetToken, resetTokenExpiry, userId]
  );
};

const findUserByResetToken = async (token) => {
  const result = await client.query(
    "SELECT * FROM job_seeker WHERE reset_token = $1",
    [token]
  );
  return result.rows[0];
};

// Update user's password and clear reset token.
const updateUserPassword = async (userId, newPassword) => {
  await client.query(
    "UPDATE job_seeker SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = $2",
    [newPassword, userId]
  );
};

module.exports = {
  findUserByEmail,
  createNewUser,
  getJobSeekerById,
  getAllJobSeekers,
  updateJobSeeker,
  deleteJobSeeker,
  updatePasswordResetToken,
  findUserByResetToken,
  updateUserPassword,
};
