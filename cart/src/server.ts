import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import logger from "./config/logger.config.js";
import cartRoutes from "./routes/cart.routes.js";
import internalRoutes from "./routes/internal.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

if (!process.env.INTERNAL_SERVICE_KEY || !process.env.INTERNAL_GATEWAY_SECRET || !process.env.DATABASE_URL) {
    console.error("CRITICAL: Missing required environment variables (CART_SERVICE)");
    process.exit(1);
}

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 4003;

import rateLimit from "express-rate-limit";

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        service: "cart-service",
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use("/api/cart", cartRoutes);
app.use("/api/internal", internalRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
    try {
        app.listen(PORT, () => {
            logger.info(`cart service is running on ${PORT}`);
        });
    } catch (err: any) {
        logger.error("Failed to start server", err);
        process.exit(1);
    }
};

startServer();