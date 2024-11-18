const { getJobSeekerById } = require("../dbQueries");

const getUserDashboard = async (req, res) => {
  try {
    const profile = await getJobSeekerById(req.user);
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = getUserDashboard;
