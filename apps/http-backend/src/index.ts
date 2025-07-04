import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from 'bcrypt'
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const hashedPass = await bcrypt.hash(parsedData.data?.password,12);
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: hashedPass,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "Incorrect inputs" });
        return;
    }

    const plainPass = parsedData.data?.password;
    try {
        const user = await prismaClient.user.findUnique({
            where: {
                email: parsedData.data.username
            }
        });

        if (!user) {
            res.status(403).json({ message: "Not Authorized" });
            return;
        }

        const isMatch = await bcrypt.compare(plainPass, user.password);

        if (!isMatch) {
            res.status(403).json({ message: "Incorrect Password!" });
            return;
        }

        const token = jwt.sign({ userId: user.id }, "123454");
        

        res.json({ token });
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



app.get("/chats/:roomId",middleware, async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.post("/room",middleware, async (req, res) => {
    
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    
    const userId = req.userId;
    const room = await prismaClient.room.upsert({
       where: {
        slug: parsedData.data.name
       },
       update:{},
       create: {
        adminId: userId,
        slug: parsedData.data.name
       }
    })

    res.json({
        room
    })
});

app.listen(3004);