import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {} from "./routes/order.routes.js"

dotenv.config();

const app = express();

app.post(
  "/order/webhook/payment",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    //raw body to controller
    (req as any).rawBody = req.body;
    next();
  }
);

app.use(cors());
app.use(express.json());

app.use("/order", orderRoutes);
const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(` Order Service running on port: ${PORT}`);
});
