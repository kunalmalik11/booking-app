import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelType } from '../../server/src/models/hotels'
import { HotelSearchResponse } from '../../server/src/shared/types'

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;

//credentials:"include" --> set cookies 

export const register=async (formData:RegisterFormData)=>{
    const response=await fetch(`${API_BASE_URL}/api/users/register`,{
        method:'POST',
        credentials: "include",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    })
    const responseBody=await response.json();
    if(!response.ok){
        throw new Error(responseBody.message);
    }
};

export const validateToken= async ()=>{
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`,{
        credentials:"include"
    })
    if(!response.ok){
        throw new Error("token invalid")
    }
    return response.json();
}

export const signIn = async (formData:SignInFormData)=>{
    const response=await fetch(`${API_BASE_URL}/api/auth/login`,{
        method:'POST',
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(formData)
    })
    const responseBody=await response.json();
    if(!response.ok){
        throw new Error(responseBody.message);
    }
    return responseBody;
}

export const signOut= async () =>{
    const response=await fetch(`${API_BASE_URL}/api/auth/logout`,{
        credentials:"include",
        method:"POST"
    });
    if(!response.ok){
        throw new Error("Error in loggin out");
    }
}

export const addMyHotel = async (hotelFormData: FormData) => {
    const reponse = await fetch (`${API_BASE_URL}/api/my-hotels`,{
        method:'POST',
        credentials:'include',
        body:hotelFormData,
    });

    if(!reponse.ok){
        throw new Error('Failed to save');
    }
    return reponse.json();

}

export const getMyHotels = async (): Promise<HotelType[]> => {
    const reponse = await fetch(`${API_BASE_URL}/api/my-hotels`,{
        credentials:"include"
    });
    if(!reponse.ok){
        throw new Error("Error fetching details");
    }
    return reponse.json();
}

export const getMyHotelById = async (hotelId:string):Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`,{
        credentials:"include"
    });
    if(!response.ok){
        throw new Error("Error getting hotel");
    }
    return response.json();
}

export const updateMyHotelById = async (hotelFormData:FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,{
        credentials:"include",
        method:'PUT',
        body:hotelFormData
    });
    if(!response.ok){
        throw new Error("Failed to update");
    }
    return response.json();
}

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilites?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
}

export const searchHotels = async (searchParams: SearchParams) : Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination",searchParams.destination || "");
    queryParams.append("checkIn",searchParams.checkIn || "");
    queryParams.append("checkOut",searchParams.checkOut || "");
    queryParams.append("adultCount",searchParams.adultCount || "");
    queryParams.append("childCount",searchParams.childCount || "");
    queryParams.append("page",searchParams.page || "");
    queryParams.append("maxPrice",searchParams.maxPrice || "");
    queryParams.append("sortOption",searchParams.sortOption || "");

    searchParams.facilites?.forEach((facility) => 
        queryParams.append("facilities",facility)
    );
    searchParams.types?.forEach((type) => 
        queryParams.append("types",type)
    );
    searchParams.stars?.forEach((star) => 
        queryParams.append("stars",star)
    );

    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);
    if( !response.ok ){
        throw new Error ("Could not fetch hotels");
    }

    return response.json();
}

export const fetchHotelById = async(hotelId: string) : Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
    if(!response.ok){
        throw new Error("error fetching hotels");
    }

    return response.json();
}