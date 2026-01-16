import { config } from "dotenv";
config();

export const PORT = process.env.PORT! || 3000;
console.log("1", process.env.AUTH_SERVICE_URL);
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL!;
export const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL!;
export const CART_SERVICE_URL = process.env.CART_SERVICE_URL!;
export const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL!;
export const ADDRESS_SERVICE_URL = process.env.ADDRESS_SERVICE_URL!;
export const REDIS_URL = process.env.REDIS_URL!;
