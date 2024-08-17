import React from 'react'
import { useNavigate } from 'react-router';
const Home = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        navigate("/changePassword")
    }
    const handleLogout = async (e) => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    return (
        <div>Home
            <button onClick={handleSubmit}>Change Password</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Home