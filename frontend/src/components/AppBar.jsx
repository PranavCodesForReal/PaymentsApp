import { useNavigate } from "react-router-dom"
import { Button } from "./Button";
import axios from "axios";

export const Appbar = ({firstName}) => {
    const navigate = useNavigate();
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            Payments App
        </div>
        <button onClick={async(e)=>{
                navigate('/update') }} className=" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                 Update Info
            </button>

        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello , {firstName}
            </div>

        
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {firstName[0]}
                </div>
            </div>

            <button onClick={(e)=>{
                localStorage.removeItem("token");
                alert("Logging Out");
                navigate('/signin') }} className=" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                 Logout
            </button>



        </div>
        
    </div>
}
