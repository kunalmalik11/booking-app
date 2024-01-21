import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useMutation, useQuery } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () =>{
    const {hotelId} = useParams();
    const {data:hotel} = useQuery("getMyHotelById", () => apiClient.getMyHotelById(hotelId || ''),{
        enabled : !!hotelId,
    });
    const { showToast } = useAppContext();

    const { mutate, isLoading} = useMutation(apiClient.updateMyHotelById,{
        onSuccess: () => {
            showToast({message:"Hotel updated",type:'SUCCESS'});
        },
        onError: ( error:Error ) => {
            showToast({message:error.message,type:'ERROR'});
        }
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    }

    return <ManageHotelForm hotel={hotel} isLoading={isLoading} onSave={handleSave}/>
}

export default EditHotel;