const UserModel = require("../Models/User");

const changepassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
        success: false,
      });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Directly update password
    await UserModel.updateOne({ email }, { $set: { password: newPassword } });

    res
      .status(200)
      .json({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error("Error in changing password:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = { changepassword };
