import mongoose from "mongoose";

const mesgSchma = new mongoose.Schema({
    text:String,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    },
    createdAt:String
})

export const msgModel = mongoose.model("message", mesgSchma);