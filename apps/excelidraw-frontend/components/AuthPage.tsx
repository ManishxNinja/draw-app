"use client";

export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    
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
                <button className="bg-blue-200 rounded p-2" onClick={() => {
                    
                }}>{isSignin ? "Sign in" : "Sign up"}</button>
            </div>
        </div>
    </div>

}