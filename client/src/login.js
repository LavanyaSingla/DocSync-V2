import React, { useState } from "react";
import { useAuth } from './authContext';
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const submitHandler = async (e) => {
        e.preventDefault();
        const user = await signIn(username, password);
        if (user) {
            navigate(`/documents/${user.id}`);
        }
        else {
            alert('Invalid Credentials');
        }
    };
    return (
        <form onSubmit={submitHandler}>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit">Login</button>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </form>
    );
};
export default Login;