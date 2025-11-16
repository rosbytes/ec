import express, { type Express } from "express";
import cors from "cors";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use("/api/cart", cartRoutes);

export default app;
