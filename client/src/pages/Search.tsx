import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultCard";

const Search = () => {
    const search = useSearchContext();
    const [page,setPage] = useState<number>(1);

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
    }
    const { data:hotelData } = useQuery(["searchHotels",searchParams], () => apiClient.searchHotels(searchParams))
    //lg:grid-cols-[250px_1fr] 250 px for left container for large screens
    return(
        <>
        <div className="grid grid-col-1 lg:grid-cols-[250px_1fr] gap-5">
            <div className="rounded-lg border border-slate p-5 h-fit sticky top-10 ">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                        Filter by:
                    </h3>
                    {
                        /* TODO FILTERS */
                    }
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotels found
                        {search.destination ? `in ${search.destination}` : ""}

                    </span>
                    {/* TODO HOTEL SORT OPTIONS*/}
                </div>
                {hotelData?.data.map((hotel)=>(<SearchResultsCard hotel={hotel}/>))}
            </div>
        </div>
        </>
    )
}

export default Search;