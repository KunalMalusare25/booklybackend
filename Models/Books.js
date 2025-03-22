const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserBooksSchema = new Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
  },
});

const UserBooks = mongoose.model("userbooks", UserBooksSchema);
module.exports = UserBooks;
