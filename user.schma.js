import mongoose from "mongoose";

const userSchma = new mongoose.Schema({
    name:String,
})

export const userModel = mongoose.model("user", userSchma);