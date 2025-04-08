// models/AdminSchema.js
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true, // must be admin's email
    match: [/.+\@.+\..+/, "Please use a valid email address"]
  },
  password: {
    type: String,
    required: true,
    default: "admin", // fixed password for all admins
    select: false // prevents password from being returned in queries by default
  },
  role: {
    type: String,
    default: "admin"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Admin", AdminSchema);
