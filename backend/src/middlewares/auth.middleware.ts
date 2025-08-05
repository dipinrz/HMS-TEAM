import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { verifyAccessToken } from "../utils/token";



export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;


    if (!authHeader?.startsWith("Bearer ")) {
        throw new ApiError("Unauthorized: token missing", 401)
    }

    try {

        const token = authHeader.split(" ")[1]

        const decoded = verifyAccessToken(token)

        if (!decoded) {
            return next(new ApiError("Invalid or expired token", 401));

        }

        (req as any).user = decoded

        next()

    } catch (error) {
        return next(new ApiError("Invalid or expired token", 401));

    }

}