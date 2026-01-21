import rateLimit from "express-rate-limit";

// Limit order creation to 5 per hour per IP to prevent spam
export const createOrderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: "Too many orders created from this IP, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limit for payment verification to prevent card testing/wallet draining
export const paymentLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3,
    message: "Too many payment verification attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});
