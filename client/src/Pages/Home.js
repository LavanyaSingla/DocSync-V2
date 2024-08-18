import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from '../Services/axiosInterceptor';

const Home = () => {
    const navigate = useNavigate();
    const [userDocs, setUserDocs] = useState([]);

    const token = localStorage.getItem("token");
    const handleSubmit = async (e) => {
        navigate("/changePassword")
    }
    const handleLogout = async (e) => {
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
            console.log(response);
            if (response.status === 200) {
                navigate(`/document/${response.data.document._id}`);
            }
            else {
                alert(`Error while creating doc`);
                console.log("Error while creating document", response)
            }
        }
        catch (err) {
            console.log("Error while creating document", err)
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
                console.log(fetchedDocs);
                setUserDocs(fetchedDocs.data.documents);
            }
            catch (err) {
                console.log("Error while fetching documents", err)
            }
        };
        fetchDocs();
    }, []);
    return (
        <div>
            <h1>Your documents</h1>
            <button onClick={handleCreateNewDoc}>Create a new document</button>
            <ul>
                {userDocs.map((doc) => (
                    <li key={doc._id}>
                        <Link to={`/document/${doc._id}`}>{doc.name ? doc.name : doc._id}</Link>
                    </li>
                ))}
            </ul>
            <button onClick={handleSubmit}>Change Password</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Home