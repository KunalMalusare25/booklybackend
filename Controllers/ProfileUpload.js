const multer = require("multer");
const UserProfile = require("../Models/User");

// Configure multer storage to save images to a specific folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Create a unique file name
  },
});

const upload = multer({ storage: storage });

const uploadProfilePhoto = [
  // Use multer middleware to handle file uploads
  upload.single("photo"),

  async (req, res) => {
    try {
      // Get the uploaded file's path from multer's request object
      const profileImgUrl = req.file.path;

      // Create a new UserProfile instance with the image URL
      const newProfile = new UserProfile({ profile: profileImgUrl });

      // Save the profile image URL to the database
      await newProfile.save();

      res.status(200).json({
        message: "Profile image uploaded successfully",
        success: true,
      });
    } catch (err) {
      console.error("Error uploading profile image: ", err);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },
];

module.exports = { uploadProfilePhoto };
