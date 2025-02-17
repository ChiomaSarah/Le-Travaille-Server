const { deleteJobSeeker } = require("../dbQueries");

const deleteUserProfile = async (req, res) => {
  const { user_id } = req.params;
  try {
    const deletedProfile = await deleteJobSeeker(user_id);
    if (!deletedProfile.length) {
      return res.status(404).json({ message: "Profile doesn't exist!" });
    }
    return res.json({
      status: 204,
      message: "Profile Deleted!",
      data: deletedProfile,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = deleteUserProfile;
