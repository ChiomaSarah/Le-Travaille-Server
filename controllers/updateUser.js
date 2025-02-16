const { updateJobSeeker, getJobSeekerById } = require("../dbQueries");

const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const data = req.body; // All fields come from the request body

  try {
    const user = await getJobSeekerById(user_id);

    if (!user) {
      return res.status(404).json({
        message: "Profile not found!",
      });
    }

    const updatedProfile = await updateJobSeeker(user_id, data);

    return res.json({
      status: 200,
      message: "Profile Updated!",
      data: updatedProfile,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "An unexpected error occurred",
    });
  }
};

module.exports = updateUser;
