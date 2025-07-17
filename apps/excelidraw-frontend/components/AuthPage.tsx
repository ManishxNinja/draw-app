"use client";

import { CreateUserSchema, SigninSchema} from "@repo/common/types";
import { useState } from "react";

export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    const [userData,setUserData] = useState({
        Email: "",
        Password: "",
        UserName: ""
    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClick = () => {
        if(isSignin) {
            const result = SigninSchema.safeParse({
                username: userData.Email,
                password: userData.Password,
            })

            if(!result.success) {
                alert("Invalid Signin credentials");
                console.log(result.error.format());
                return;
            }

            console.log("Signin data valid", result.data);
        } else {
            const result = CreateUserSchema.safeParse({
                username: userData.Email,
                password: userData.Password,
                name: userData.UserName,
            });
            if(!result.success) {
                alert("Invalid Signup credentials");
                console.log(result.error.format());
                return;
            }

            console.log("Signup data valid", result.data);
        }
    }
    return <div className="w-screen h-screen flex justify-center items-center bg-black">
        <div className="p-6 m-2 bg-white rounded">
            <div className="p-2 border rounded mt-2">
                <input type="text" placeholder="Email"></input>
            </div>
            <div className="p-2 border rounded mt-2">
                <input type="text" placeholder="Password"></input>
            </div>

            <div className={`${!isSignin? "visible" : "hidden"} p-2 border rounded mt-2`} >
                <input type="text" placeholder="UserName"></input>
            </div>

            <div className="pt-2">
                <button className="bg-blue-200 rounded p-2" onClick={handleClick}>{isSignin ? "Sign in" : "Sign up"}</button>
            </div>
        </div>
    </div>

}