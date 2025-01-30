const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add password"],
      min: 6,
      max: 12,
    },
    pushToken: {
      type: String, // Stores Expo push token
    },
    otp: {
      type: String, // Stores the OTP
    },
    otpExpires: {
      type: Date, // Stores the OTP expiration time
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
