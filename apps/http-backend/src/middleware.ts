import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import dotenv from "dotenv";

dotenv.config()

interface JwtPayload {
    userId: string
}
export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzYTY1NDAyMy1mMzE5LTRmNjEtODY3OS1lNDVkOWUyOWY5ZmQiLCJpYXQiOjE3NTE2MDA4MTJ9.YKl2nY5x1-WCnsq8qHzlQJhpDObQVMTJUy69OWIevdw";
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