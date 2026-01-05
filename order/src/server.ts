import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes, {} from "./routes/order.routes.js"
import { paymentWebhook } from "./controller/order.controller.js";

dotenv.config();

const app = express();

app.post(
  "/order/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhook
);

app.use(cors());
app.use(express.json());

app.use("/order", orderRoutes);
const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(` Order Service running on port: ${PORT}`);
});
