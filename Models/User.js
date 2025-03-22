const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  photo: {
    type: String,
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
