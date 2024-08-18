import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../Services/axiosInterceptor';

const Home = () => {
    const navigate = useNavigate();
    const [userDocs, setUserDocs] = useState([]);

    const token = localStorage.getItem("token");

    const handleSubmit = async () => {
        navigate("/changePassword");
    };

    const handleLogout = async () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleCreateNewDoc = async () => {
        try {
            const response = await axios.post('api/createDocument', {}, {
                headers: {
                    "authorization": `Bearer ${token}`,
                }
            });
            if (response.status === 200) {
                navigate(`/document/${response.data.document._id}`);
            } else {
                alert('Error while creating doc');
            }
        } catch (err) {
            console.log("Error while creating document", err);
        }
    };

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const fetchedDocs = await axios.post("api/fetchDocuments", {}, {
                    headers: {
                        "authorization": `Bearer ${token}`
                    }
                });
                setUserDocs(fetchedDocs.data.documents);
            } catch (err) {
                console.log("Error while fetching documents", err);
            }
        };
        fetchDocs();
    }, []);

    return (
        <div>
            {/* Move the buttons to the left and align with the page layout */}
            <div className="container mt-4">
                {/* DocSync above the document list */}
                <div className="text-center mb-4">
                    <h2>DocSync</h2>
                </div>

                {/* Navbar-like buttons above the "Create Document" button */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button className="btn btn-primary" onClick={handleCreateNewDoc} style={{ cursor: 'pointer' }}>
                        Create a New Document
                    </button>
                    <div className="d-flex">
                        <button className="btn btn-secondary me-2" onClick={handleSubmit} style={{ cursor: 'pointer' }}>
                            Change Password
                        </button>
                        <button className="btn btn-danger" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            Logout
                        </button>
                    </div>

                </div>

                {/* Heading */}
                <div className="mb-4">
                    <h1>Your Documents</h1>
                </div>

                {/* Document list - black text, hover underline, 5 per row */}
                <div className="row">
                    {userDocs.map((doc) => (
                        <div className="col-md-2 mb-4" key={doc._id}>
                            <div className="card h-100">
                                <div className="card-body d-flex align-items-center justify-content-center">
                                    <span className="text-center">
                                        <Link to={`/document/${doc.name  ? doc.name : doc._id}/${doc._id}`} className="doc-link">
                                            {doc.name ? doc.name : doc._id}
                                        </Link>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom CSS for styling */}
            <style jsx>{`
                /* Change doc link to black, underline on hover */
                .doc-link {
                    color: black;
                    text-decoration: none;
                }
                .doc-link:hover {
                    text-decoration: underline;
                }

                /* Change cursor to pointer for buttons */
                button:hover {
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default Home;
