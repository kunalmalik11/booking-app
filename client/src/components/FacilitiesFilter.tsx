import { hotelFacilities } from "../config/hotel-options-config";

type Props = {
    selectedFacilites: string[];
    onChange: (event : React.ChangeEvent<HTMLInputElement>)=>void;
}

const HotelFacilitiesFilter = ({selectedFacilites,onChange} : Props) => {
    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Hotel Facilities</h4>
            {hotelFacilities.map((facility)=>(
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" value={facility} checked={selectedFacilites.includes(facility)}
                    onChange={onChange}/>
                    <span>{facility} </span>
                </label>
            ))}
        </div>
    )
}

export default HotelFacilitiesFilter;