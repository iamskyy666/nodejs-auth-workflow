import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
// import swaggerUI from "swagger-ui-express";

import connectDB from "./db/connect.js";
// import swaggerSpec from "./docs/swagger.js";

import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import orderRouter from "./routes/orderRouter.js";

const app = express();

// ============================================================================
// Security Middlewares
// ============================================================================

app.use(helmet());

app.use(
  cors({
    origin: true, // Allow all origins for now
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Max 100 requests/IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// ============================================================================
// Express Middlewares
// ============================================================================

app.use(express.json());

app.use(
  fileUpload({
    createParentPath: true,
  }),
);

app.use(cookieParser(process.env.JWT_SECRET));

// ============================================================================
// Logging
// ============================================================================

app.use(morgan("tiny"));

// ============================================================================
// Static Files
// ============================================================================

app.use(express.static("./public"));

// ============================================================================
// Swagger Documentation
// ============================================================================

// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// ============================================================================
// Routes
// ============================================================================

app.get("/", (req, res) => {
  res.send("Auth-Workflow API running..✅");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

// ============================================================================
// Error Handling
// ============================================================================

app.use(notFound);
app.use(errorHandlerMiddleware);

// ============================================================================
// Start Server
// ============================================================================

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`🔵 Server running on port ${PORT}`);
     // console.log(`📄 API Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("🔴 Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

start();
