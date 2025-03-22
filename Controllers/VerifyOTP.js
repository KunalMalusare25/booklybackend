const UserModel = require("../Models/User");
const { sendOTP } = require("../Services/otpService");

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // Find the user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.otp) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new one." });
    }

    console.log("Stored OTP:", user.otp, "Entered OTP:", otp);

    // Check if OTP matches
    if (user.otp.toString() !== otp.toString()) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // Clear the OTP using findOneAndUpdate
    await UserModel.findOneAndUpdate({ email }, { $unset: { otp: "" } });

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//resend otp
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if the user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate and send a new OTP using the existing service
    const newOtp = await sendOTP(email);

    // Save the new OTP to the database
    user.otp = newOtp;
    await user.save();

    res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    console.error("Error during OTP resend:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { verifyOTP, resendOTP };
