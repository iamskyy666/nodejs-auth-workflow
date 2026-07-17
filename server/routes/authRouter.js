import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";

import authenticateUser from "../middleware/authentication.js";
// import authorizePermissions from "../middleware/authorization.js";

const authRouter = Router();

// ============================================================================
// Authentication Routes
// Base Route: /api/v1/auth
// ============================================================================

// Public Routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.delete("/logout", authenticateUser, logout);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
