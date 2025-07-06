import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import dotenv from "dotenv";

dotenv.config()

interface JwtPayload {
    userId: string
}
export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMTNjNTNhNS1jMDBhLTQyNDUtOTEzOS1jNjA2NzcwNTQ4ODQiLCJpYXQiOjE3NTE3ODUzMTR9.TBWYVdcJxk4kG0yJtDZGw3_ACoT55SfzvxkWWZ6cfeQ";
    console.log(process.env.TOKEN)
    console.log(JWT_SECRET);
    const decoded = jwt.verify(token, "123454") as JwtPayload;

    if (decoded) {
        req.userId = decoded.userId;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}