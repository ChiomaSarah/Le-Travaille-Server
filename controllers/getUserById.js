const { getJobSeekerById } = require("../dbQueries");

const getUserById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const profile = await getJobSeekerById(user_id);
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = getUserById;
