import React from "react";
import "./componentcss/FeedTemplatePost.css";

function FeedTemplatePost(props) {
    const post = props.postInfo;

    return (
        <div className="feedTemplatePost-container">
            <div className="profile-section">
                <img className="profile-pic" src={post.profilePicture} alt="profile pic"></img>
                <h3>{post.account}</h3>
            </div>
            <div className="post-content">
                <img className="post-image" src={post.postImage} alt="post image"></img>
                <h3 className="post-title-feed">{post.title}</h3>
            </div>
            <div className='PostInformation-container'>
                <div className='information-container'>
                    <img src='dateImage.png'></img>
                    <h2>{post.date}</h2>
                </div>
                <div className='information-container'>
                    <img src='likesImage.png'></img>
                    <h2>{post.likes}</h2>
                </div>
                <div className='information-container'>
                    <img src='commentsImage.png'></img>
                    <h2>{post.commentsCount}</h2>
                </div>
            </div>
        </div>
    );
}

export default FeedTemplatePost;

