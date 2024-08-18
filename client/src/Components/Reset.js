import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../Services/axiosInterceptor';

const Reset = () => {
    const [input, setInput] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const { id, token } = useParams();
    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`api/reset/${id}/${token}`, { input });
            alert(res.data.message);
            console.log(res);
            navigate("/");
        }
        catch (err) {
            if (err.response && err.response.data.message === "Link has expired, please request a new one") {
                alert("Your reset link has expired. Please request a new one.");
            } else {
                alert(err.response.data.message);
            }
            console.log("error", err);
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

export default Reset