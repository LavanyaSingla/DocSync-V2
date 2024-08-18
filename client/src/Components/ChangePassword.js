import React, { useState } from 'react';
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('api/changePassword', input, {
                headers: {
                    "authorization": `Bearer ${token}`,
                }
            });
            alert(res.data.message);
            navigate("/");
        } catch (err) {
            console.log("error", err);
            alert(err.response?.data?.message || 'Error occurred while changing password');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Change Password</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={input.newPassword}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="newPassword"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={input.confirmPassword}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="confirmPassword"
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Change Password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
