const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Do not return password by default in queries
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
    select: false, // Do not return verification status by default in queries
  },
  otp: {
    type: String,
    select: false, // Do not return OTP by default in queries
  },
  otpExpiry: {
    type: Date,
  },
});

// Hash password before saving
// This middleware runs before saving a user document. It checks if the password field has been modified (or is new) and hashes it using bcrypt. If the password hasn't been modified, it simply calls next() to proceed without hashing.
//for example, if a user updates their email or name but not their password, the password won't be re-hashed unnecessarily.
// password - shivam@111204 -> $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36T9QoeYyQ5v0tH8aLZy (hashed version)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  // Hash the password
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords
// This method is used to compare a candidate password (the one provided by the user during login) with the hashed password stored in the database. It uses bcrypt's compare function, which returns true if the passwords match and false otherwise.
// For example, if a user tries to log in with the password "shivam@111204", this method will hash that input and compare it to the stored hashed password. If they match, it returns true, allowing the user to log in successfully.
// password - shivam@111204 -> $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36T9QoeYyQ5v0tH8aLZy (hashed version stored in DB)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
// The userSchema defines the structure of the User documents in the MongoDB collection. It includes fields for email, password, name, verification status, OTP, and OTP expiry. The schema also includes middleware to hash passwords before saving and a method to compare passwords during login.
module.exports = mongoose.model("User", userSchema);
