import { useState, useEffect } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Update = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate('/signup');
    } else {
        axios.get('http://localhost:3000/api/v1/me', {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((response) => {
            console.log("Verified");
        })
        .catch((error) => {
            console.error("Error during verification", error);
            navigate('/signup');
        });
    }
}, [navigate]);

  const [showError, setShowError] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const handleUpdate = async () => {
    try {
      const updateData = {};

      // Only include fields if they are not empty
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (password) updateData.password = password;

      const response = await axios.put(
        "http://localhost:3000/api/v1/user/",
        updateData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setShowError(false);
      alert("Info Updated");
      navigate("/dashboard");
    } catch (e) {
      setShowError(true);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Update Info"} />
          <SubHeading label={"Leave the fields not to be updated"} />
          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="John"
            label={"New First Name"}
          />
          <InputBox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Doe"
            label={"New Last Name"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"New Password"}
          />
          <div className="pt-4">
            <Button onClick={handleUpdate} label={"Update"} />
          </div>

          {showError && (
            <div className="font-light text-red-700 text-xs mt-2">
              Update Failed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
