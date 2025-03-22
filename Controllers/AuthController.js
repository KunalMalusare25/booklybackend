const UserProfile = require("../Models/Profile");
const UserModel = require("../Models/User");
const UserDetails = require("../Models/UserDetails");
const UserGoals = require("../Models/Usergoals");
const { sendOTP } = require("../Services/otpService");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    // Save email and password
    const newUser = new UserModel({ email, password });
    await newUser.save();
    console.log("User created Successfully");

    // Generate and send OTP
    const otp = await sendOTP(email);
    console.log("Generated OTP:", otp);

    // Update user with OTP
    await UserModel.updateOne({ email }, { $set: { otp } });

    res.status(201).json({
      message: "User created. OTP sent to your email.",
      success: true,
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Internal Error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(403).json({
        message: "Email or Password is Wrong",
        success: false,
      });
    }
    if (password !== existingUser.password) {
      return res.status(403).json({
        message: "Email or password is incorrect",
        success: false,
      });
    }
    // const isPassEqual = await bcrypt.compare(password, existingUser.password);
    // if (!isPassEqual) {
    //   return res.status(403).json({
    //     message: "Auth Failed email or password is wrong",
    //     success: false,
    //   });
    // }
    // const jwtToken = jwt.sign(
    //   {
    //     email: existingUser.email,
    //     _id: existingUser._id,
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "24h" }
    // );

    res.status(200).json({
      message: "Login Successfully",
      success: true,
      email,
      name: existingUser.name,
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Internal Error", success: false });
  }
};

//alluser GET
const getUsers = async (req, res) => {
  try {
    // Fetch all users from the UserModel
    const users = await UserModel.find({});

    res
      .status(200)
      .json({ message: "Users retrieved successfully", success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal Error", success: false });
  }
};

//UserDetails ADD , UPDATE API
const addOrUpdateUserDetails = async (req, res) => {
  try {
    const { email, name, dob, gender, readingLevel } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Check if user details already exist
    let userDetails = await UserDetails.findOne({ userId: user._id });

    if (userDetails) {
      // Update existing details
      userDetails.name = name;
      userDetails.dob = dob;
      userDetails.gender = gender;
      userDetails.readingLevel = readingLevel;
      await userDetails.save();
      return res.json({ message: "User details updated", success: true });
    } else {
      // Create new user details
      userDetails = new UserDetails({
        userId: user._id,
        name,
        dob,
        gender,
        readingLevel,
      });
      await userDetails.save();

      // Populate email from UserModel
      const newDetails = await userDetails.populate("userId", "email");
      return res.json({
        message: "User details added",
        success: true,
        data: newDetails,
      });
    }
  } catch (error) {
    console.error("Error in adding/updating user details:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

//alluser GET
const getAllUserDetails = async (req, res) => {
  try {
    // Find all user details and populate the associated user email
    const userDetails = await UserDetails.find().populate("userId", "email");

    // Fetch profiles separately
    const userDetailsWithProfile = await Promise.all(
      userDetails.map(async (userDetail) => {
        const userProfile = await UserProfile.findOne({
          userId: userDetail.userId._id,
        });
        return {
          ...userDetail.toObject(), // Convert Mongoose document to plain object
          profile: userProfile ? userProfile.profile : null, // Add profile image
        };
      })
    );

    if (!userDetails || userDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No user details found", success: false });
    }

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: userDetailsWithProfile,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

//USER GET API by email
const getUserDetailsByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Get email from request parameters

    // Find user by email to get userId
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Find user details using userId and include all fields
    const userDetail = await UserDetails.findOne({ userId: user._id })
      .populate("userId", "email") // Populate email from User collection
      .select("name dob gender readingLevel");
    // Select required fields

    const usergoals = await UserGoals.findOne({ userId: user._id }).select(
      "country readinggoals favgenres readingtime"
    );

    if (!userDetail) {
      return res
        .status(404)
        .json({ message: "User details not found", success: false });
    }

    // Fetch user profile separately
    const userProfile = await UserProfile.findOne({ userId: user._id });

    // Combine user details with profile image
    const userData = {
      _id: userDetail._id,
      email: user.email,
      name: userDetail.name,
      dob: userDetail.dob,
      gender: userDetail.gender,
      readingLevel: userDetail.readingLevel,
      profile: userProfile ? userProfile.profile : null, // Add profile image
      goals: usergoals
        ? {
            country: usergoals.country,
            readingGoals: usergoals.readinggoals,
            favGenres: usergoals.favgenres,
            readingTime: usergoals.readingtime,
          }
        : null,
    };

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

//USERGOALS API POST
const addorupdateUserGoals = async (req, res) => {
  try {
    const { email, country, readinggoals, favgenres, readingtime } = req.body;

    // Step 1: Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Step 2: Check if user goals exist
    let userGoalsDetails = await UserGoals.findOne({ userId: user._id });

    if (userGoalsDetails) {
      // Update existing user goals
      userGoalsDetails.country = country;
      userGoalsDetails.readinggoals = readinggoals;
      userGoalsDetails.favgenres = favgenres;
      userGoalsDetails.readingtime = readingtime;
      await userGoalsDetails.save();

      return res.json({ message: "User Goals details updated", success: true });
    } else {
      // Create a new entry for user goals
      userGoalsDetails = new UserGoals({
        userId: user._id, // Link to user's ID
        country,
        readinggoals,
        favgenres,
        readingtime,
      });

      await userGoalsDetails.save();

      // Populate the userId field with email for response clarity
      const newDetails = await userGoalsDetails.populate("userId", "email");

      return res.json({
        message: "User Goals details added",
        success: true,
        data: newDetails,
      });
    }
  } catch (error) {
    console.error("Error in adding/updating user Goals details:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  signup,
  login,
  getUsers,
  addOrUpdateUserDetails,
  getUserDetailsByEmail,
  getAllUserDetails,
  addorupdateUserGoals,
};
