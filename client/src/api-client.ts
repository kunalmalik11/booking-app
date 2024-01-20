import { HotelFormData } from "./forms/ManageHotelForm/ManageHotelForm";
import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelType } from '../../server/src/models/hotels'

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