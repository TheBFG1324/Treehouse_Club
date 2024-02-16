import React, { useEffect, useState } from "react";
import "./css/ViewPost.css"
import getPdf from "../Api-Functions/getPdf";
import getFile from "../Api-Functions/getFile";

function PostView(props){
    const user = props.user;
    const post = props.postInfo
    const [postUrl, setPostUrl] = useState(null)
    const [postOwner, setPostOwner] = useState('')
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [likes, setLikes] = useState(0)
    const [commentsCount, setCommentsCount] = useState(0)
    const [comments, setComments] = useState([])

    useEffect(() => {
        async function fetchData (){
            try{
                const pdf = await getPdf(post.post)
                setPostUrl(URL.createObjectURL(pdf))
                setPostOwner(post.owner)
                setTitle(post.title)
                setDate(post.date)
                setLikes(post.likes.length)
                setCommentsCount(post.comments.length)
                setComments(comments)
            } catch (error) {
                console.log("Error fetching data: ", error)
            }
        }

        fetchData()
    }, [props.user, props.postInfo])

    return(
        <div className="PostView-container">
            <div className="post-title">
                <h1>{title}</h1>
                <div className="button-container">
                    {user === postOwner && <button className="delete-button" onClick={() => {/* handle delete */}}>Delete</button>}
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
            <div className="engagements">
                {comments.map((commentObj, index) => (
                    <div key={index}>
                        <strong>{commentObj.name}:</strong> {commentObj.comment}
                    </div>
                ))}
            </div>
            <button className="comment-button" onClick={props.onClick}>Comment</button>
        </div>
    )
}

export default PostView;
