const { getJobSeekerById } = require("../dbQueries");

const getUserById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const profile = await getJobSeekerById(user_id);

    if (profile.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.json(profile[0]);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = getUserById;
