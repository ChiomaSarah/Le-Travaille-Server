const { getAllJobSeekers } = require("../dbQueries");

const getAllUsers = async (req, res) => {
  try {
    const users = await getAllJobSeekers();
    return res.json({
      status: 200,
      message: "Candidates Retrieved!",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = getAllUsers;
