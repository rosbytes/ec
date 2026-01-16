import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDb } from "./config/db";
import router from "./routes/address.routes";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./config/logger";

dotenv.config();

if (!process.env.MONGO_URI || !process.env.INTERNAL_GATEWAY_SECRET) {
  console.error("CRITICAL: Missing required environment variables (ADDRESS_SERVICE)");
  process.exit(1);
}

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  logger.error("MONGO_URI environment variable is required");
  process.exit(1);
}

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many request from this IP,please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "address-service",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/addresses", router);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDb(MONGO_URI);
    app.listen(PORT, () => {
      logger.info(`✅ Address service running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("❌ Failed to connect to DB", err);
    process.exit(1);
  }
};

startServer();
