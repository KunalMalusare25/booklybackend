const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserGoalsSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  country: {
    type: String,
  },
  readinggoals: {
    type: String,
  },
  favgenres: {
    type: [String],
  },
  readingtime: {
    type: String,
    enum: ["1", "2", "3", "4", "5+"],
  },
});

const UserGoals = mongoose.model("usergoals", UserGoalsSchema);
module.exports = UserGoals;
