import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const baseUrl = process.env.MONGODB_URL;

export const connectToDB = async() => {
    try {
        console.log(baseUrl)
        await mongoose.connect(`${baseUrl}/CSV-Upload`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected using mongoose");
    } catch (error) {
        console.log(error);
    }
}