import React, { useState } from 'react'
import axios from '../Services/axiosInterceptor';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const handleClick = async () => {
        try {
            const response = await axios.post("api/resetPassword", { email }, { timeout: 100000 });
            alert(response.data.message);
            console.log(response)
        }
        catch (err) {
            alert(err.response.data.message);
            console.log("Error", err)
        }
    }
    return (
        <div>
            <h1>Forgot Password ?</h1>
            <h2>Enter your email</h2>
            <p>We will send you a link to reset the password on your email</p>
            <input type="text" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <button onClick={handleClick}>Send Email</button>
            <button onClick={() => navigate("/login")}>Login</button>
        </div>
    )
}

export default ResetPassword