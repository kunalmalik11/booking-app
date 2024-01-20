import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = ()=>{
    const queryClient = useQueryClient();
    const {showToast} = useAppContext();
    const mutation=useMutation(apiClient.signOut,{
        onSuccess: async ()=>{
            await queryClient.invalidateQueries('invalidateToken');
            showToast({message:"Logged Out Successfully",type:'SUCCESS'})
        },onError:(error:Error) =>{
            console.log("error")
            showToast({message:error.message,type:'ERROR'})
        }
    })
    const handleClick = ()=>{
        mutation.mutate();
    }
    return (
        <button className="text-blue-600 px-3 font-bold bg-white hover:bg-grey-100" onClick={handleClick}>Signout</button>
    )
}

export default SignOutButton;