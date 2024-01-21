import { HotelType } from "../models/hotels"

export type HotelSearchResponse{
    data: HotelType[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    }
}