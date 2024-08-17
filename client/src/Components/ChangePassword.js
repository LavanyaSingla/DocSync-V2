import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../Services/axiosInterceptor';

const ChangePassword = () => {
    const [input, setInput] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('api/changePassword', input, {
                headers: {
                    "authorization": `Bearer ${token}`,
                }
            });
            alert(res.data.message);
            console.log(res);
            navigate("/");
        }
        catch (err) {
            console.log("error", err);
            alert(err.response.data.message);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label> New Password
                <input type="password" name="newPassword" value={input.newPassword} onChange={handleChange} />
            </label>
            <label > Confirm Password
                <input type="password" name="confirmPassword" value={input.confirmPassword} onChange={handleChange} />
            </label>
            <button type="submit">Change Password</button>
        </form>
    )
}

export default ChangePassword