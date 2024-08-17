import React, { useState } from 'react'

const SaveDocument = () => {
    const [docName, setDocName] = useState('');
    const token = localStorage.getItem("token");
    const handleChange = (e) => {
        setDocName(e.target.value);
    }
    const handleSubmit = async () => {
        try {
            const response = await axios("api/renameDoc", docName, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            if (response.status == 200) {
                alert("Name saved successfully!");
                Navigate("/");
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
                <input type="text" value="docName" onChange={handleChange} />
            </label>
            <button type="submit">Save</button>
        </form>
    )
}

export default SaveDocument