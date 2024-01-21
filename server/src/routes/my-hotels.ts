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

        const imageUrls = await uploadImagesToCloudinary(imageFiles);

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

router.get("/",verifyToken,async (req:Request,res:Response) => {
    
    try{
        const hotels=await Hotel.find({userId:req.userId});
        res.json(hotels);
    }catch (e) {
        res.status(500).json({message:"Error Fetching hotels"})
    }
})

router.get("/:id",verifyToken,async (req:Request,res:Response) => {

    try{
        const id = req.params.id.toString();
        const hotel = await Hotel.findOne({
            _id:id,
            userId:req.userId,
        });
        res.json(hotel);
    }catch(e){
        res.status(500).json({message:"Error fetching hotels"});
    }
    
});

router.put("/:hotelId",verifyToken, upload.array("imageFiles"), async (req:Request,res:Response)=>{
    try{
        const hotelId= req.params.hotelId.toString();
        const updatedHotel:HotelType = req.body;
        updatedHotel.lastUpdated = new Date();
        const hotel = await Hotel.findOneAndUpdate({
            _id:hotelId,
            userId:req.userId
        },updatedHotel,{new:true});

        if(!hotel){
            return res.json(404).json({message:"Hotel not found"});
        }
        //req.files will only have those files that are uploaded by user not deleted or left as same from previous upload
        const files=req.files as Express.Multer.File[];
        const updatedImageUrls= await uploadImagesToCloudinary(files);
        //updatedHotel.imageUrls will have all the urls only that user wants to keep from previous edit or add
        hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];

        await hotel.save();
        res.status(201).json(hotel);
    } catch (e){
        res.status(500).json({message:"Something went wrong"})
    }
})

async function uploadImagesToCloudinary(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const base64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + base64;
        const response = await cloudinary.v2.uploader.upload(dataURI);
        return response.url;
    });
    // resolving the promise as the cloudinary response is a Promise
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default router;
