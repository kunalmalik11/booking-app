import express, { Request, Response } from "express";
import multer from 'multer';

const router=express.Router();
const storage=multer.memoryStorage();
import cloudinary from 'cloudinary';
import Hotel, { HotelType } from "../models/hotels";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
const upload=multer({
    storage:storage,
    limits:{
        fieldSize: 5 * 1024 * 1024 //5 MB
    }
})
router.post("/",verifyToken,[
    body("name").notEmpty().withMessage('Name is Required'),
    body("city").notEmpty().withMessage('City is Required'),
    body("country").notEmpty().withMessage('Country is Required'),
    body("type").notEmpty().withMessage('Type is Required'),
    body("description").notEmpty().withMessage('Description is Required'),
    body("pricePerNight").notEmpty().isNumeric().withMessage('Price Per Night is Required and must be a number'),
    body("facilities").notEmpty().isArray().withMessage('facilities is Required and must be a array'),


],upload.array("imageFiles",6),async (req:Request,res:Response) => {
    try{
        const imageFiles= req.files as Express.Multer.File[];
        const newHotel :HotelType= req.body;

        const uploadPromises = imageFiles.map(async(image) => {
            const base64= Buffer.from(image.buffer).toString("base64");
            let dataURI="data:"+image.mimetype+";base64,"+base64;
            const response=await cloudinary.v2.uploader.upload(dataURI);
            return response.url;
        })
        // resolving the promise as the cloudinary response is a Promise
        const imageUrls= await Promise.all(uploadPromises);

        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date(); 
        newHotel.userId = req.userId;

        const hotel= new Hotel(newHotel);
        await hotel.save();

        res.status(201).send(hotel);
    }catch(e){
        console.log("Error creating hotel :",e);
        res.status(500).json({message:"Something wrong occured"})
    }

})

export default router;