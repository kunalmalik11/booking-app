import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"

const GuestSection = () => {
    const {register, formState:{errors}} = useFormContext<HotelFormData>();
    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Guests</h2>
            <div className="flex justify-between bg-gray-300">
                <label className="p-5 flex-1" >
                    <span className="flex flex-col">
                        Adults
                        <input type="number" className="w-full px-2 py-2"  min={1}{...register("adultCount",{
                            required:"Required field"
                        })}></input>
                    </span>
                    {
                        errors.adultCount && (
                            <span className="text-red-500 text-sm font-bold">{errors.adultCount.message}</span>
                        )
                    }
                </label>
                <label className="p-5 flex-1">
                    <span className="flex flex-col">
                        Children
                        <input type="number" className="w-full px-2 py-2" min={0} {...register("childCount",{
                            required:"Required field"
                        })}></input>
                    </span>
                    {
                        errors.childCount && (
                            <span className="text-red-500 text-sm font-bold">{errors.childCount.message}</span>
                        )
                    }
                </label>
                

            </div>
        </div>
    );
};

export default GuestSection;