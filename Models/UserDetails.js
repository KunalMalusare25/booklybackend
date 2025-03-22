const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserDetailsSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  name: {
    type: String,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
  },
  readingLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Expert"],
  },
});

const UserDetails = mongoose.model("userdetails", UserDetailsSchema);
module.exports = UserDetails;
