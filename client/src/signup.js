import React, { useState } from 'react';
import { useAuth } from './authContext.js';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const { Signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/signUp', { username, password, email, role });
            const user = await Signup(username, password, email, role);
            if (user) {
                navigate(`documents/${user.id}`);
            }
        }
        catch (err) {
            console.error('Failed to sign up:', err);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                Role:
                <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
            </label>
            <button>Sign Up</button>
        </form>
    )
}

export default Signup