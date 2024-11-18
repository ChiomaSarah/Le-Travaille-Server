const { updateJobSeekerProfile, getJobSeekerById } = require("../dbQueries");

const updateUserProfile = async (req, res) => {
  const { user_id } = req.params;
  const { username, email, password, age, degree, experience, location } =
    req.body;

  try {
    const user = await getJobSeekerById(user_id);

    if (!user) {
      return res.status(404).json({
        message: "Profile not found!",
      });
    }

    const updatedProfile = await updateJobSeekerProfile(
      user_id,
      username,
      email,
      password,
      age,
      degree,
      experience,
      location
    );

    return res.json({
      status: 200,
      message: "Profile Updated!",
      data: updatedProfile,
    });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({
      message: err.message || " An unexpected error occurred",
    });
  }
};

module.exports = updateUserProfile;
