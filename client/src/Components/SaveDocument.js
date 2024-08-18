import React, { useState } from 'react';
import axios from '../Services/axiosInterceptor';
import { useParams, useNavigate } from 'react-router-dom';

const SaveDocument = () => {
    const [docName, setDocName] = useState('');
    const token = localStorage.getItem("token");
    const { id: documentId } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setDocName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`api/renameDoc/document/${documentId}`, { docName }, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                alert("Name saved successfully!");
                navigate(`/document/${documentId}`);
            } else {
                alert("Error found");
                console.log(response);
            }
        } catch (err) {
            console.log("Error while saving the doc name", err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Save the Document Name</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="docName" className="form-label">New Name</label>
                                    <input
                                        type="text"
                                        name="docName"
                                        value={docName}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="docName"
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaveDocument;
