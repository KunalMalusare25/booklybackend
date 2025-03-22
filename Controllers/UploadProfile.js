const UserProfile = require("../Models/Profile");
const UserModel = require("../Models/User");

const profile = async (req, res) => {
  try {
    const { email, profile } = req.body; // `profile` is a Base64 string

    if (!email || !profile) {
      return res.status(400).json({
        success: false,
        message: "Email and profile image are required",
      });
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Save Base64 image in MongoDB
    let userProfile = await UserProfile.findOne({ userId: user._id });
    if (userProfile) {
      userProfile.profile = profile;
      await userProfile.save();
    } else {
      userProfile = new UserProfile({ userId: user._id, profile });
      await userProfile.save();
    }

    res.status(201).json({
      success: true,
      message: "Profile image saved successfully",
      data: userProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//GET PROFILE
const getProfile = async (req, res) => {
  try {
    const { email } = req.body; // Get email from request body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find user profile
    const userProfile = await UserProfile.findOne({ userId: user._id });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: userProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { profile, getProfile };
