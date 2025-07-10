import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, TOKEN } from "@repo/backend-common/config";
import dotenv from "dotenv";

dotenv.config()

interface JwtPayload {
    userId: string
}
export function middleware(req: Request, res: Response, next: NextFunction) {

    console.log(process.env.TOKEN)
    console.log(JWT_SECRET);
    const decoded = jwt.verify(TOKEN, "123454") as JwtPayload;

    if (decoded) {
        req.userId = decoded.userId;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}