import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import axios from '../Services/axiosInterceptor.js';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    })
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('api/register', input);
            alert(res.data.message);
            if (res.status === 201) { navigate("/login") };

        }
        catch (err) {
            console.error('Failed to sign up:', err);
        }
    }
    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" name="username" value={input.username} onChange={handleChange} />
            </label>
            <label>
                Password:
                <input type="password" name="password" value={input.password} onChange={handleChange} />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={input.email} onChange={handleChange} />
            </label>
            <button type='submit'>Sign Up</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
    )
}

export default Signup;