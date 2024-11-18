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

const updateJobSeekerProfile = async (
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
    const result = await client.query(
      "UPDATE job_seeker SET username = $1, email = $2, password = $3, age = $4, degree = $5, experience = $6, location = $7 WHERE user_id = $8 RETURNING *",
      [username, email, password, age, degree, experience, location, userId]
    );
    return result.rows;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteJobSeekerProfile = async (userId) => {
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

module.exports = {
  findUserByEmail,
  createNewUser,
  getJobSeekerById,
  getAllJobSeekers,
  updateJobSeekerProfile,
  deleteJobSeekerProfile,
};
