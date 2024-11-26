import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
export const mongooseConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected successfully");
    } catch (err) {
        console.log(err)
    }
}