import type { Request, Response, NextFunction } from "express";

export const internalAuth = (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers["x-internal-key"] as string | undefined;

    if (key !== process.env.INTERNAL_SERVICE_KEY) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Internal service authentication failed"
        });
    }

    next();
};
