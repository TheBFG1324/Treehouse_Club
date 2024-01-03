import React, { useState } from 'react';
import './componentcss/AccountButtons.css'; // Ensure this path is correct based on your project structure

function AccountButtons(props) {
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState("")
    const [isPublic, setView] = useState("Public")
    const [file, setFile] = useState(null)
    const [view, setAccountView] = useState(true)

    const toggleForm = () => {
        setShowForm(!showForm)
    }

    const toggleAccountViewChange = () => {
        setAccountView(!view);
        props.changeAccount();

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ title, isPublic, file });
        setShowForm(false);
    };

    const handleChange = (e) => {
        setView(e.target.value);
    };

    return(
        <div className='post-container'>
            <button onClick={toggleForm}>Create Post</button>
            <button onClick={toggleAccountViewChange}>{view ? "Anonymous": "Public"}</button>
            {showForm && (
                <div className="form-modal">
                    <form onSubmit={handleSubmit} className="post-form">
                        <label>
                            Post Title
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </label>
                        <fieldset>
                            <legend>Visibility</legend>
                            <label>
                                <input 
                                    type="radio" 
                                    value="Public" 
                                    checked={isPublic === "Public"} 
                                    onChange={handleChange} />
                                Public
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="Anonymous" 
                                    checked={isPublic === "Anonymous"} 
                                    onChange={handleChange} />
                                Anonymous
                            </label>
                        </fieldset>
                        <label>
                            Upload File
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        <div className="form-buttons">
                            <button type="submit">Post</button>
                            <button onClick={toggleForm} type="button">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default AccountButtons;
