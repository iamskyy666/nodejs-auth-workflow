// ============================================================================
// Token Model
// Defines tokens, refresh tokens.
// ============================================================================

import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    refreshTokens: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    user: {
      type: mongoose.Types.ObjectId, // foreign-key
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Token = mongoose.model("Token", TokenSchema);

export default Token;
