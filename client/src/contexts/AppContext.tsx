import { useQuery } from "react-query";
import Toast from "../components/Toast";
import * as apiClient from '../api-client'

import React, { useContext, useState } from "react";
type ToastMessage={
    message:string;
    type:'SUCCESS'|'ERROR';
}
// different objects exposed to other components
type AppContext = {
    showToast: (toastMessage:ToastMessage) => void;
    isLoggedIn: boolean;
}

const AppContext = React.createContext<AppContext | undefined>(undefined); 
// (undefined) --> default value when project loads

export const AppContextProvider = ({children,}:{children:React.ReactNode}) =>{

    const [toast,setToast] = useState<ToastMessage | undefined>(undefined);
    const {isError} = useQuery('invalidateToken',apiClient.validateToken,{
        retry:false,
    });
    return (
        <AppContext.Provider value={{showToast:(toastMessage)=>{
            setToast(toastMessage)
        },
        isLoggedIn: !isError
        
        }}>
            {toast && (<Toast message={toast.message} type={toast.type} onClose={()=> setToast(undefined)}/>)}
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () =>{
    const context = useContext(AppContext);
    return context as AppContext;
}
