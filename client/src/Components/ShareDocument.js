import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Services/axiosInterceptor';

const ShareDocument = () => {
    const [email, setEmail] = useState('');
    const { id: documentId } = useParams();
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
                navigate(`/document/${documentId}`);
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
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email
                <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button type="submit"> Add </button>
        </form>
    );
}

export default ShareDocument;
