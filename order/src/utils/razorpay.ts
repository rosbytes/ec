import Razorpay from "razorpay";
import { config } from "dotenv";

config();

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!, // apikey
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
