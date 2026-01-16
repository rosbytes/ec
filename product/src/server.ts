import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import logger from "./config/logger.config";
import { connectDB } from "./config/db";
import productRoutes from "./routes/product.routes";
import internalRoutes from "./routes/internal.routes";
import searchRoutes from "./routes/search.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

if (!process.env.INTERNAL_SERVICE_KEY || !process.env.MONGO_URI || !process.env.ACCESS_TOKEN_SECRET) {
  console.error("CRITICAL: Missing required environment variables (PRODUCT_SERVICE)");
  process.exit(1);
}

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 3001;

import rateLimit from "express-rate-limit";

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

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
    service: "product-service",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/internal", internalRoutes);
app.use("/api/search", searchRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on ${PORT}`);
    });
  } catch (err: any) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
