import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Services/axiosInterceptor';

const ShareDocument = () => {
    const [email, setEmail] = useState('');
    const { id: documentId } = useParams();

    const { docName: docName } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`api/share/document/${documentId}`, { email }, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });

            // Handle successful request (status 200)
            if (response.status === 200) {
                alert("User added successfully!");
                navigate(`/document/${docName}/${documentId}`);
            }
        } catch (err) {
            // Handle error response (status 400 or other)
            if (err.response && err.response.status === 400) {
                alert(err.response.data.message); // Display the error message
            } else {
                alert("An unexpected error occurred");
            }
            console.log("Error while sharing the document", err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Share Document</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control"
                                        id="email"
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareDocument;
