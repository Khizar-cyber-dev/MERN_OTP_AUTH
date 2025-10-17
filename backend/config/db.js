import mongoose from "mongoose";
import 'dotenv/config';

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Mongoose connected to DB");
        });
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
