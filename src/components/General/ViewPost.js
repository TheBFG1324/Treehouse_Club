import React from "react";
import "./css/ViewPost.css"

function PostView(props){
    const user = props.user;
    const post = props.postInfo
    return(
        <div className="PostView-container">
            <div className="post-title">
                <h1>{post.title}</h1>
                <div className="button-container">
                    {user === post.account && <button className="delete-button" onClick={() => {/* handle delete */}}>Delete</button>}
                    <button className="close-button" onClick={props.onClick}>X</button>
                </div>
            </div>
            <h4>{user}</h4>
            <embed src={post.post} type="application/pdf" width="100%" height="500px" />
            <div className='PostInformation-container'>
                <div className='information-container'>
                    <img src='dateImage.png' alt='date icon'></img>
                    <h2>{post.date}</h2>
                </div>
                <div className='information-container'>
                    <img src='likesImage.png' alt='likes icon'></img>
                    <h2>{post.likes}</h2>
                </div>
                <div className='information-container'>
                    <img src='commentsImage.png' alt='comments icon'></img>
                    <h2>{post.commentsCount}</h2>
                </div>
            </div>
            <div className="engagements">
                {Object.entries(post.comments).map(([name1, comment]) => (
                    <div key={name1}>
                        <strong>{name1}:</strong> {comment}
                    </div>
                ))}
            </div>
            <button className="comment-button" onClick={props.onClick}>Comment</button>
        </div>
    )
}

export default PostView;
