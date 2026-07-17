// ============================================================================
// Auth Controller
// Handles user registration, authentication and logout.
// ============================================================================

import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
// import { attachCookiesToResp } from "../utils/jwt.js";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import createTokenUser from "../utils/createTokenUser.js";
import crypto from "crypto"; // for proper verification-token
import sendVerificationEmail from "../utils/sendVerificationEmail.js";
import Token from "../models/token.model.js";
import { attachCookiesToResp } from "../utils/jwt.js";
import sendResetPasswordEmail from "../utils/sendResetPasswordEmail.js";
import hashString from "../utils/createHash.js";

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // check is user-email already present
  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new BadRequestError(
      "🔴 Email already exists! Try with another one..",
    );
  }

  // First registered account becomes the administrator.
  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  // Create user in the database.
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  // set up origin - // front-end (create-react-app)
  const origin = `http://localhost:3000`;
  // const newOrigin = `https://react-node-user-workflow-front-end.netlify.app`;

  // send verification-email
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  //! temporary - send verification token back only testing in POSTMAN 🟠
  res.status(StatusCodes.CREATED).json({
    msg: "🎉 Success! Please check your email to verify account!",
  });
};

// @desc    Authenticate user & login
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate request body.
  if (!email || !password) {
    throw new BadRequestError("Please provide both email and password.");
  }

  // Find user by email.
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("🔴 Invalid credentials.");
  }

  // Compare supplied password with the stored hashed password.
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnauthenticatedError("🔴 Invalid credentials.");
  }

  if (!user.isVerified) {
    throw new UnauthenticatedError("🔴 Please verify your email.");
  }

  // Create the JWT payload.
  const tokenUser = createTokenUser(user);

  // create refresh token
  let refreshToken = "";

  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError("🔴 Invalid credentials.");
    }
    refreshToken = existingToken.refreshToken;

    attachCookiesToResp({ res, user: tokenUser, refreshToken });

    res.status(StatusCodes.OK).json({
      user: tokenUser,
    });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  // create token
  await Token.create(userToken);

  attachCookiesToResp({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({
    user: tokenUser,
  });
};

// @desc    Logout current user
// @route   DELETE /api/v1/auth/logout
// @access  Private
const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.userId });

  // Overwrite the cookies and expire them immediately.
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({
    msg: "User logged out! 🟢",
  });
};

// @desc    Verify user-email
// @route   GET /api/v1/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  // temp
  console.log("Request Body:", req.body);

  const { verificationToken, email } = req.body;

  // temp
  console.log("Token from request:", verificationToken);
  console.log("Email from request:", email);

  // Find user by email.
  const user = await User.findOne({ email });

  // temp
  console.log("User from DB:", user);

  if (!user) {
    throw new UnauthenticatedError("🔴 ERROR -  Verification failed!");
  }

  // temp
  console.log("DB token:", user.verificationToken);
  console.log("Incoming token:", verificationToken);
  console.log("Equal?", user.verificationToken === verificationToken);

  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("🔴 ERROR - Verification failed!");
  }

  ((user.isVerified = true),
    (user.verified = Date.now()),
    (user.verificationToken = ""));

  // save the instance
  await user.save();

  res.status(StatusCodes.OK).json({
    verificationToken,
    email,
    msg: "Email verified! 🟢",
  });
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("🔴 Please provide valid-email!");
  }

  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    // send email
    // set up origin - // front-end (create-react-app)
    const origin = `http://localhost:3000`;

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;

    const passwordTokenExpDur = new Date(Date.now() + tenMinutes);

    user.passwordToken = hashString(passwordToken);
    user.passwordTokenExpDate = passwordTokenExpDur;

    // finally, save
    await user.save();
  }

  res.status(StatusCodes.OK).json({
    msg: "💡 Please check your email for reset-password link!",
  });
};

// @desc    Reset the password
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    throw new BadRequestError("🔴 Please provide all values");
  }

  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === hashString(token) &&
      user.passwordTokenExpDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpDate = null;

      // save
      await user.save();
    }
  }

  res.status(StatusCodes.CREATED).json({
    msg: "✅ Password reset successful!",
  });
};

export { register, login, logout, verifyEmail, forgotPassword, resetPassword };
