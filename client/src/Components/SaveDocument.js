import React, { useState } from 'react'
import axios from '../Services/axiosInterceptor';
import { useParams, useNavigate } from 'react-router-dom';

const SaveDocument = () => {
    const [docName, setDocName] = useState('');
    const token = localStorage.getItem("token");
    const { id: documentId } = useParams();
    const navigate = useNavigate();
    const handleChange = (e) => {
        setDocName(e.target.value);
    }
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
            }
            else {
                alert("error found");
                console.log(response);
            }
        }
        catch (err) {
            console.log("Error while saving the doc name", err);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>
                new name
                <input type="text" name="docName" value={docName} onChange={handleChange} />
            </label>
            <button type="submit">Save</button>
        </form>
    )
}

export default SaveDocument