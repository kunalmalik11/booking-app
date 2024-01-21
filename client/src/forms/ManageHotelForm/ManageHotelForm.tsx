import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./Guest";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../server/src/models/hotels";
import { useEffect } from "react";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    imageUrls: string[];
    adultCount: number;
    childCount: number;
}

type Props = {
    hotel?: HotelType;
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
}

const ManageHotelForm = ({ onSave, isLoading, hotel } : Props) => {
    const formMethods = useForm<HotelFormData>();

    const { handleSubmit, reset } = formMethods;

    useEffect(() => {
        reset(hotel);
    },[hotel,reset])

    const onSubmit = handleSubmit((formDataJson:HotelFormData)=>{
        console.log(formDataJson);
        const formData= new FormData();
        if(hotel){
            //used in api-client.ts to fetch hotelId to send in params
            formData.append("hotelId",hotel._id);
        }
        formData.append("name",formDataJson.name);
        formData.append("city",formDataJson.city);
        formData.append("country",formDataJson.country);
        formData.append("description",formDataJson.description);
        formData.append("type",formDataJson.type);
        formData.append("pricePerNight",formDataJson.pricePerNight.toString());
        formData.append("starRating",formDataJson.starRating.toString());
        formData.append("childCount",formDataJson.childCount.toString());
        formData.append("adultCount",formDataJson.adultCount.toString());

        formDataJson.facilities.forEach((facility,index)=>{
            formData.append(`facilities[${index}]`,facility);
        });

        if(formDataJson.imageUrls){
            formDataJson.imageUrls.forEach((url,index)=>{
                formData.append(`imageUrls[${index}]`,url);
            })
        }

        Array.from(formDataJson.imageFiles).forEach((images)=>{
            formData.append(`imageFiles`,images);
        });

        onSave(formData);

    });

    return (
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-6" onSubmit={onSubmit}>
                <DetailsSection/> 
                <TypeSection/>
                <FacilitiesSection/>
                <GuestSection/>
                <ImagesSection/>
                <span className="flex justify-end">
                    <button disabled={isLoading} type="submit" className="bg-blue-600 text-white p-2 font-bold hover:cursor hover:bg-blue-500 text-xl disabled:bg-gray-500">
                        
                        Save</button> 
                </span>
            </form>     
        </FormProvider>
  )
}

export default ManageHotelForm;