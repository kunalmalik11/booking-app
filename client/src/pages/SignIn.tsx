import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router";
import { Link, useLocation } from "react-router-dom";

export type SignInFormData = {
    email: string;
    password: string;
}

//destructure erros from formState

const SignIn= () =>{
    const {register, formState: {errors},handleSubmit} = useForm<SignInFormData>();
    const {showToast} = useAppContext();
    const navigate = useNavigate();
    const queryClient= useQueryClient();

    const location = useLocation();
    const mutation= useMutation(apiClient.signIn,{
        onSuccess:async () => {
            showToast({message:"Signed In",type:'SUCCESS'});
            await queryClient.invalidateQueries('invalidateToken');
            navigate(location.state?.from?.pathname || "/");
        },onError: (error:Error)=>{
            showToast({message:error.message,type:'ERROR'});
        }
    })
    const onSubmit = handleSubmit((data)=>{
        mutation.mutate(data);
    });
    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold"> Sign In</h2>
            <label className="text-gray-700 text-sm font-bold flex flex-col gap-2 flex-1" >
                Email
                <input type="email" className="border rounded w-fill py-1 px-2 font-normal" {...register("email",{required:"This field is required"})}></input>
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            <label  className="text-gray-700 text-sm font-bold flex flex-col gap-2 flex-1" >
                Password
                <input type="password" className="border rounded w-fill py-1 px-2 font-normal"
                {...register("password",{required:"This field is required",
                minLength:{
                    value:6,
                    message:"Password must be atlease 6 char long"
                }})}></input>
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm">Not Registered? <Link to="/register" className="underline hover:cursor">Create an account here</Link></span>
                <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">Sign In</button>

            </span>
        </form>
    )
}

export default SignIn;