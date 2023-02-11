const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/user.model");
const Res = require("../models/res.model");
const ErrorResponse = require("../utils/errorResponse");
const sendMail = require("../utils/mail");

const sendToken = (user, statusCode, res) => {
  user.password = undefined;
  const token = user.getSignToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV ? true : false,
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

// @desc    Register a user
// @route   POST api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, data: user });
});

// @desc    Login user
// @route   POST api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  sendToken(user, 200, res);
});

// @desc    Forgot Password
// @route   POST api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse("Email not found", 404));
  }
  const resetLink = user.createResetPassLink();
  const text = `
  Hi ${user.name},
  You recently requested to reset the password for your Knowledge Karma account. Follow this link to proceed:
  ${resetLink}.

  Thanks, Knowledge Karma team
  `;
  const option = {
    to: user.email,
    subject: "Reset Password",
    text,
  };
  await sendMail(option);
  res.status(200).json({ success: true, data: "Email sent" });
});

// @desc    Reset Password
// @route   POST api/auth/reset-password/:id/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorResponse(`Invalid id`, 400));
  }
  const isValid = user.verifyResetToken(token);
  if (!isValid) {
    return next(new ErrorResponse(`Invalid Token`, 400));
  }
  user.password = password;
  const updatedUser = await user.save();
  res.status(200).json({ success: true, data: updatedUser });
});

// @desc    Get signed in user profile
// @route   GET api/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse("Unauthorized!", 401));
  }
  const user = await Res.find({
    owner: req.user._id,
  }).populate("owner", "name email");
  res.status(200).json({ success: true, data: user });
});

// @desc    Logout user
// @route   GET api/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});
