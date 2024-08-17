import axios from "../Services/axiosInterceptor";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [input, setInput] = useState({
        email: "", password: ""
    });
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("api/login", input);
            alert(res.data.message);
            if (res.status === 200) {
                localStorage.setItem("token",res.data.token);
                navigate("/");
            }
        }
        catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    };
    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    return (
        <form onSubmit={submitHandler}>
            <label>
                Email:
                <input type="text" name="email" value={input.email} onChange={handleChange} />
            </label>
            <label>
                Password:
                <input type="password" name="password" value={input.password} onChange={handleChange} />
            </label>
            <button type="submit">Login</button>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </form>
    );
};
export default Login;