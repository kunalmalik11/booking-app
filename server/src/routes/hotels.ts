import express, { Request, Response } from "express";
import Hotel from "../models/hotels";
import { HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router(); 

 

router.get("/search",async (req:Request,res:Response) => {
    try{
        const query = constructSearchQuery(req.query);
        
        let sortOptions = {};
        switch(req.query.sortOption) {
            case "starRating":
                sortOptions = {starRating: -1};
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1};
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1};
                break;
        }

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page? req.query.page.toString():"1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);
        const total = await Hotel.countDocuments(query);
        const response: HotelSearchResponse = {
            data : hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total/pageSize)
            },
        };
        res.json(response);

    } catch(error){
        res.status(500).json({message:"Something went wrong"})
    }
})

const constructSearchQuery = (queryParams:any) => {
    let constructSearchQuery: any ={};
    if(queryParams.destination){
        constructSearchQuery.$or = [
            { city: new RegExp(queryParams.destination, "i")},
            { country: new RegExp(queryParams.destination, "i")},
        ];
    };

    if(queryParams.adultCount){
        constructSearchQuery.adultCount= {
            $gte:parseInt(queryParams.adultCount),
        };
    };

    if(queryParams.childCount){
        constructSearchQuery.childCount= {
            $gte:parseInt(queryParams.childCount),
        };
    };

    if (queryParams.facilities) {
        constructSearchQuery.facilities = {
            $all: Array.isArray(queryParams.facilities) ? queryParams.facilities : [queryParams.facilities],
        };
    };
    // user may have selected multiple type of hotels
    if (queryParams.types) {
        constructSearchQuery.type = {
            $in: Array.isArray(queryParams.types) ? queryParams.types : [queryParams.types],
        };
    };

    if(queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars) 
            ? queryParams.stars.map((star:string) => parseInt(star)) : parseInt(queryParams.stars);

        constructSearchQuery.starRating = { $in : starRatings};
    }

    if(queryParams.maxPrice) {
        constructSearchQuery.pricePerNight = { $lte :parseInt (queryParams.maxPrice).toString()};
    }
    return constructSearchQuery;

};

router.get("/:id",[param("id").notEmpty().withMessage("Hotel Id is required")],async (req:Request,res:Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    console.log(" request for hotel received");
    const id = req.params.id.toString();
    console.log(" id is "+id);
    try{
        const hotel = await Hotel.findById(id);
        res.json(hotel);
    } catch(error) {
        console.log(error);
        res.status(500).json({message:"Error while getting hotel"});
    }
});

router.post("/:hotelId/bookings/payment-intent",verifyToken, async (req: Request, res: Response) => {
    //total cost hotelId userId
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if(!hotel) {
        return res.status(400).json({message:"Hotel not found"});
    }
    // currency should always be lowercase
    const totalCost = hotel.pricePerNight * numberOfNights;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost,
        currency: "inr",
        metadata: {
            hotelId,
            userId: req.userId,
        },
    });

    if(!paymentIntent.client_secret){
        return res.status(500).json({message:"Error Creating Payment Intent"});
    }
    const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
    };
    res.send(response);
});


export default router;