import rateLimit from "express-rate-limit";

// Limit add to cart operations to 20 per minute to prevent bot scraping/hoarding
export const addToCartLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
    message: "Too many add to cart requests, please slow down",
    standardHeaders: true,
    legacyHeaders: false,
});
