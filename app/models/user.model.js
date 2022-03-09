const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone: Number,
    address: String
  })
);
module.exports = User;