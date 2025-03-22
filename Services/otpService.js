require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Validate Email
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Generate a secure 5-digit OTP
const generateOTP = () => crypto.randomInt(10000, 99999).toString();

// Function to send OTP via email
const sendOTP = async (email) => {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address.");
  }

  const otp = generateOTP();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Bookly Signup",
    text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    html: `<p>Your OTP is: <strong>${otp}</strong>. It is valid for <strong>10 minutes</strong>.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}: ${otp}`);
    return otp; // Return OTP to save in the database
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    throw new Error("Failed to send OTP. Please try again.");
  }
};

module.exports = { sendOTP };
