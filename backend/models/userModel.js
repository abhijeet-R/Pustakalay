const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto=require("crypto")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    maxLenghth: [30, "Name should have less than 30 characters"],
    minLenghth: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minLenghth: [8, "Password should have more than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  restPasswordExpire: Date,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE,
  });
};

userSchema.methods.comparepass = async function (enteredpass) {
  return await bcrypt.compare(enteredpass, this.password);
};

userSchema.methods.getResetPasswordToken=function(){
  const resetToken=crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
  this.restPasswordExpire=Date.now()+15*60*1000;
  return resetToken;
}
module.exports = mongoose.model("User", userSchema);
