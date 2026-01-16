import mongoose from "mongoose";
import logger from "./logger.config";

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI!;

        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined");
        }

        await mongoose.connect(mongoURI);

        logger.info(" MongoDB connected successfully");
    } catch (error: any) {
        logger.error(` MongoDB connection error: ${error.message}`);
        process.exit(1);
    }

    mongoose.connection.on("disconnected", () => {
        logger.warn(" MongoDB disconnected");
    });
};
