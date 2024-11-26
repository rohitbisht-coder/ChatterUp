import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import http from "http"
import { msgModel } from "./message.schma.js";
import { userModel } from "./user.schma.js";
const app = express();
app.use(cors());

export const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const room = 123;

io.on("connection", (socket) => {
    console.log("Connection made");
    socket.on("loginUser", async (name, url) => {
        socket.userName = name.charAt(0).toUpperCase() + name.slice(1)
        const newUser = new userModel({
            name: socket.userName,
        })
        await newUser.save()
        socket.join(room);
        socket.userId = newUser._id;
        socket.url = url
        const allUsers = await userModel.find();
        const allMsg = await msgModel.find().populate("user");
        socket.emit("userLogin", {
            text: ` Welcome ${socket.userName} `
        }, allUsers, allMsg);
        socket.broadcast.to(room).emit("message", {
            text: `${socket.userName} has joined the room.`
        }, allUsers)
    })


    socket.on("sendMessage", async (data) => {
        const newMsg = new msgModel({
            text: data,
            user: socket.userId,
            createdAt: new Date().toLocaleTimeString()
        })
        await newMsg.save()
        socket.broadcast.to(room).emit("recieveMsg", newMsg, socket.userName)
        socket.emit("sendMsg", newMsg, socket.userName);
    })


    socket.on("userTyping", () => {
        socket.broadcast.to(room).emit("typingUserName", socket.userName)
    })
    socket.on("disconnect", () => {
        console.log("Connection disconnected");
    });
})


