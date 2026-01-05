import express from "express";
import cors from "cors";
import mangoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import router from "./routes/product.routes";
import logger from "./config/logger.config";
import mongoose from "mongoose";
import dotenv from "dotenv";
import internal from "./routes/internal.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(mangoSanitize());

app.use("/api/products", router);
app.use("/api/internal", internal);

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI!;

    await mongoose.connect(mongoURI);

    logger.info(" MongoDB connected successfully");
  } catch (error: any) {
    logger.error(` MongoDB connection error: ${error.message}`);
    process.exit(1); //  if DB fails
  }

  mongoose.connection.on("disconnected", () => {
    logger.warn(" MongoDB disconnected");
  });
};
const PORT = process.env.SERVER_PORT;
connectDB().then(() => {
  app.listen(PORT, () => () => logger.info(`Server running on ${PORT}`));
});
