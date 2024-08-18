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
                localStorage.setItem("token", res.data.token);
                navigate("/");
            }
        } catch (err) {
            alert(err.response.data.message);
            console.log(err.response.data);
        }
    };

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Login</h2>
                            <form onSubmit={submitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={input.email}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="email"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={input.password}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="password"
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                            </form>
                            <p className="mt-3 text-center">
                                Don't have an account? <Link to="/signup">Sign Up</Link>
                            </p>
                            <p className="text-center">
                                Forgot Password? <Link to="/resetPassword">Click Here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
