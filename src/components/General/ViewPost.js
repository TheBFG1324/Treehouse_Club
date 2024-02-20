import React, { useEffect, useState } from "react";
import "./css/ViewPost.css";
import getPdf from "../Api-Functions/getPdf";
import deletePost from "../Api-Functions/deletePost";
import commentPost from "../Api-Functions/commentPost";

function PostView(props) {
    const user = props.user;
    const post = props.postInfo;
    const [postUrl, setPostUrl] = useState(null);
    const [postOwner, setPostOwner] = useState('');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [likes, setLikes] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [commentBoxVisible, setCommentBoxVisible] = useState(false);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const pdf = await getPdf(post.post);
                setPostUrl(URL.createObjectURL(pdf));
                setPostOwner(post.owner);
                setTitle(post.title);
                setDate(post.date);
                setLikes(post.likes.length);
                setCommentsCount(post.comments.length);
                setComments(post.comments);
            } catch (error) {
                console.log("Error fetching data: ", error);
            }
        }

        fetchData();
    }, [props.user, props.postInfo]);

    const postBeGone = async () => {
        const result = await deletePost(post._id);
        if (result && result.message) {
            props.onClick();
            props.toggleReload(prev => !prev);
        } else {
            console.log("Error deleting post");
        }
    }

    const handleCommentButtonClick = () => {
        setCommentBoxVisible(true);
    }

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    }

    const submitComment = async () => {
        const result = await commentPost(post._id, props.user, postOwner, true, {name: props.user, comment: newComment})
        setNewComment('');
        setCommentBoxVisible(false);
    }

    return (
        <div className="PostView-container">
            <div className="post-title">
                <h1>{title}</h1>
                <div className="button-container">
                    {user === postOwner && <button className="delete-button" onClick={postBeGone}>Delete</button>}
                    <button className="close-button" onClick={props.onClick}>X</button>
                </div>
            </div>
            <h4>{user}</h4>
            <embed src={postUrl} type="application/pdf" width="100%" height="500px" />
            <div className='PostInformation-container'>
                <div className='information-container'>
                    <img src='dateImage.png' alt='date icon'></img>
                    <h2>{date}</h2>
                </div>
                <div className='information-container'>
                    <img src='likesImage.png' alt='likes icon'></img>
                    <h2>{likes}</h2>
                </div>
                <div className='information-container'>
                    <img src='commentsImage.png' alt='comments icon'></img>
                    <h2>{commentsCount}</h2>
                </div>
            </div>
            {commentBoxVisible && (
                <div>
                    <textarea value={newComment} onChange={handleCommentChange}></textarea>
                    <div className="submit-button-container">
                    <button className="comment-submit" onClick={submitComment}>Send</button>
                    </div>
                </div>
            )}
            <button className="comment-button" onClick={handleCommentButtonClick}>Comment</button>
            <div className="engagements">
                {comments.map((commentObj, index) => (
                    <div key={index}>
                        <strong>{commentObj.name}:</strong> {commentObj.comment}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PostView;