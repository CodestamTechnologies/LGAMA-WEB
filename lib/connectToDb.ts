"use server"

import mongoose from "mongoose";
let isConnected = false

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)
    if (isConnected) {
        console.log("Database is Connected");
        return;
    }
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB URI MISSING")
        }
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'lgama',
        })
        isConnected = true;

    } catch (error) {
        console.log(error);
    }
}
