// ============================================================================
// Auth Controller
// Handles user registration, authentication and logout.
// ============================================================================

import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import { attachCookiesToResp } from "../utils/jwt.js";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import createTokenUser from "../utils/createTokenUser.js";
import crypto from "crypto"; // for proper verification-token
import sendVerificationEmail from "../utils/sendVerificationEmail.js";

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password } = req.body;

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

  // Generate JWT & attach it as an HTTP-only cookie.
  const token = attachCookiesToResp({
    res,
    user: tokenUser,
  });

  res.status(StatusCodes.OK).json({
    user: tokenUser,
    token,
  });
};

// @desc    Logout current user
// @route   GET /api/v1/auth/logout
// @access  Public
const logout = async (req, res) => {
  // Overwrite the authentication cookie and expire it immediately.
  res.cookie("token", "logout", {
    httpOnly: true,
    signed: true,
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

export { register, login, logout, verifyEmail };
