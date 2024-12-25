import { useEffect, useState } from "react"
import { Appbar } from "../components/AppBar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const Dashboard = () => {
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

    const [balance, setBalance] = useState(0);
    const [name, setName] = useState("");

    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/account/balance', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then((response) => {
            setBalance(response.data.balance);
            setName(response.data.name);
        })
        .catch((error) => {
            console.error("Error fetching balance", error);
        });
    }, []);

    return (
        <div>
            <Appbar firstName={name}></Appbar>
            <div className="m-8">
                <Balance value={balance}></Balance>
                <Users></Users>
            </div>
        </div>
    );
}
