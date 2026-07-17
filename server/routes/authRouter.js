import { Router } from "express";
import {
  login,
  logout,
  register,
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

export default authRouter;
