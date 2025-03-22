const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileImg = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  profile: {
    type: String,
  },
});

const UserProfile = mongoose.model("userprofile", ProfileImg);
module.exports = UserProfile;
