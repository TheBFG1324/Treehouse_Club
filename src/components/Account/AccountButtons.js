import React, { useState } from 'react';
import './css/AccountButtons.css';
import sendFile from '../Api-Functions/sendFile';
import createPost from '../Api-Functions/createPost';

function AccountButtons(props) {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [isPublic, setView] = useState("Public");
    const [coverPicture, setCoverPicture] = useState(null);
    const [coverPictureType, setCoverPictureType] = useState(null);
    const [postFile, setPostFile] = useState(null);
    const [postFileType, setPostFileType] = useState(null);
    const [view, setAccountView] = useState(true);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const toggleAccountViewChange = () => {
        setAccountView(!view);
        props.changeAccount();
    };

    const handleCoverPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverPicture(file);
            setCoverPictureType(file.type);
        }
    };

    const handlePostFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPostFile(file);
            setPostFileType(file.type);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const coverPhotoId = await sendFile(coverPicture)
        const postFileId = await sendFile(postFile)

        if(coverPhotoId && postFileId){

            const data = {
                title: title,
                name: isPublic === "Public" ? props.publicName: props.anonymousName,
                postImage: coverPhotoId,
                post: postFileId,
                googleId: props.googleId,
                postType: postFileType,
                imageType: coverPictureType
            }
            const post = await createPost(data) 
            console.log(post)
        }
        setShowForm(false);
        props.toggleReload()
    };

    const handleChange = (e) => {
        setView(e.target.value);
    };

    return (
        <div className='post-container'>
            <button onClick={toggleForm}>Create Post</button>
            <button onClick={toggleAccountViewChange}>{view ? "Anonymous" : "Public"}</button>
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
                            Cover Image
                            <input type="file" onChange={handleCoverPhotoChange} />
                        </label>
                        <label>
                            Upload File
                            <input type="file" onChange={handlePostFileChange} />
                        </label>
                        <div className="form-buttons">
                            <button type="submit">Post</button>
                            <button onClick={toggleForm} type="button">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AccountButtons;

