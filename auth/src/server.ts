import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "@configs/logger.config";
import router from "@routes/auth.routes";
import profileRoutes from "@routes/profile.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.INTERNAL_GATEWAY_SECRET || !process.env.DATABASE_URL) {
  console.error("CRITICAL: Missing required environment variables (AUTH_SERVICE)");
  process.exit(1);
}

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`received ${req.method} request to ${req.url}`);
  logger.info(`request body ${JSON.stringify(req.body)}`);
  next();
});

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", router);
app.use("/api/me/profile", profileRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server is started at: ${PORT}`);
    });
  } catch (err: any) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
