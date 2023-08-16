const ErrorHandler = require("../utils/errorhandler");
const catchError = require("../middleware/catchError");
const User = require("../models/userModel");
const sendToken = require("../utils/JWTtoken");
const sendEmail = require("../utils/senEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

exports.registerUser = catchError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});

exports.loginUser = catchError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Enter email & password ", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparepass(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

exports.logoutUser = catchError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged out",
  });
});

exports.forgotPassword = catchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPassUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `your password reset token is :-\n\n ${resetPassUrl}\n\n If you have not requested this email then please ingnore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "ecommerce Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.restPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});

exports.resetPassword = catchError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    restPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("reset password token invalid or has been expired", 400)
    );
  }
  if (req.body.password != req.body.confirmpassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.restPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

exports.getUserDetails = catchError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparepass(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler(" password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler(" password does not match", 400));
  }

  user.password = req.body.newPassword;
  user.save();

  sendToken(user, 200, res);
});

exports.updateProfile = catchError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});

exports.getAllUsers = catchError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

exports.getUser = catchError(async (req, res, next) => {
  const user =await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler("user not found", 400)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUserRole = catchError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };
   await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});

exports.deleteUser = catchError(async (req, res, next) => {
  const user =await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler("user not found", 400)
    );
  }
  await user.deleteOne()
  res.status(200).json({
    success: true,
    message:"user deleted successfully"
  });
});

