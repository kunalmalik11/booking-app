import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';  
import userRoutes from './routes/users' ;
import authRoutes from './routes/auth';
import cookieParser from "cookie-parser";
import myHotelRoutes from './routes/my-hotels'

import {v2 as cloudinary} from 'cloudinary';

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING as string)
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.COLUDINARY_API_KEY,
    api_secret:process.env.COLUDINARY_API_SECRET
});

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}));

app.use(cookieParser());
app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/my-hotels",myHotelRoutes);

app.listen(3000,()=>{
    console.log("server running on 3000")
})