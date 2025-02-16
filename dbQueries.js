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

const setFieldsAndValuesToUpdate = (data) => {
  const fieldsToUpdate = Object.entries(data)
    .filter(([_, value]) => value !== undefined) // Filter out any fields with undefined values.
    .map(([key]) => `${key} = ?`);

  const valuesToUpdate = Object.values(data).filter(
    (value) => value !== undefined // Filter out undefined values and store the actual values to be updated.
  );

  return { fieldsToUpdate, valuesToUpdate };
};

const updateJobSeeker = async (userId, data) => {
  const { fieldsToUpdate, valuesToUpdate } = setFieldsAndValuesToUpdate(data);

  if (fieldsToUpdate.length === 0) {
    throw new Error("No fields provided for update!");
  }
  valuesToUpdate.push(userId);

  const query = `UPDATE job_seeker SET ${fieldsToUpdate.join(
    ", "
  )} WHERE user_id = $${valuesToUpdate.length} RETURNING *`;

  try {
    const result = await client.query(query, valuesToUpdate);
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
  updateJobSeeker,
  deleteJobSeekerProfile,
};
