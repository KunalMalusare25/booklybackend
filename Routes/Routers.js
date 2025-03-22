const express = require("express");
const router = express.Router();
const {
  signup,
  addOrUpdateUserDetails,
  getUserDetails,
  addorupdateUserGoals,
  getUsers,
  getAllUserDetails,
  login,
  getUserDetailsByEmail,
} = require("../Controllers/AuthController");
const { signupValidation } = require("../Middlewares/AuthValidation");
const { AllBooks, GetBooks } = require("../Controllers/AllBooks");
const { profile, getProfile } = require("../Controllers/UploadProfile");
const { verifyOTP, resendOTP } = require("../Controllers/VerifyOTP");
const { changepassword } = require("../Controllers/Changepassword");

router.post("/signup", signupValidation, signup);
router.post("/login", login);
router.get("/allusers", getUsers);

//USER DETAILS ROUTES
router.post("/userdetails", addOrUpdateUserDetails);
router.get("/alluserdetails", getAllUserDetails);
//user details particular email
router.get("/getparticularuserdetails/:email", getUserDetailsByEmail);

//USER GOALS
router.post("/usergoals", addorupdateUserGoals);

//Books
router.post("/addbooks", AllBooks);
router.post("/books", GetBooks);

//profile
router.post("/addprofile", profile);
router.post("/getprofile", getProfile);

//otp verification
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

router.post("/change-password", changepassword);

module.exports = router;
