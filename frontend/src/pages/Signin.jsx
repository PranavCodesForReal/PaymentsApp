import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export const Signin = () => {
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const [UserName , setUsername] = useState("");
    const [password,setPassword] = useState("");
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={e=>{
          setUsername(e.target.value)
        }} placeholder="pranav502" label={"Username"} />
        <InputBox onChange = {e=>{
          setPassword(e.target.value);
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick = {async ()=>{
            try{
              const response = await axios.post('http://localhost:3000/api/v1/user/signin', {
                username : UserName,
                password
              })

              localStorage.setItem("token" , response.data.token);
              setShowError(false);
              navigate("/dashboard");
            }catch(e){
              setShowError(true);
    
            }
             
              
            
          }} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        {showError && (
            <div className="font-light text-red-700 text-xs mt-2">
              Signin Failed!
            </div>
          )}
      </div>
    </div>
  </div>
}