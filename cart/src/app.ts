import express, { type Express } from "express";
import cors from "cors";
import cartRoutes from "../src/routes/cart.routes.js";
import internalRoutes from "./routes/internal.routes.js";
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use("/api/cart", cartRoutes);
app.use("/api/internal", internalRoutes);

export default app;
