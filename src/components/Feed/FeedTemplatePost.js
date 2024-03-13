import React, { useEffect, useState } from "react";
import "./css/FeedTemplatePost.css";
import getPost from "../Api-Functions/getPost";
import getFile from "../Api-Functions/getFile";
import getAccountInfo from "../Api-Functions/getAccountInfo";

function FeedTemplatePost(props) {
    const [account, setAccount] = useState('')
    const [postImage, setPostImage] = useState(null)
    const [profilePicture, setProfilePicture] = useState(null)
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [likesCount, setLikesCount] = useState(0)
    const [commentsCount, setCommentsCount] = useState(0)
    const [post, setPost] = useState(null)
    const postId = props.postId;

    
    useEffect(() => {
        const fetchData = async () => {
            const response = await getPost(postId)
            const postData = response.post
            setPost(postData)
            const profileInfo = await getAccountInfo(postData.owner)
            if(profileInfo.profileImage){
                const profPic = await getFile(profileInfo.profileImage)
                setProfilePicture(URL.createObjectURL(profPic))
            } else {
                setProfilePicture("Treehouse1.png")
            }
        
            const postPic = await getFile(postData.postImage)
            setAccount(postData.owner)
            setPostImage(URL.createObjectURL(postPic))
            setTitle(postData.title)
            setDate(postData.date)
            setLikesCount(postData.likes.length)
            setCommentsCount(postData.comments.length)
        }
        fetchData();
    }, [])

    return (
        <div className="feedTemplatePost-container" onClick={() => props.onClick(post)}>
            <div className="feed-profile-section">
                <img className="profile-pic" src={profilePicture} alt="profile pic"></img>
                <h3>{account}</h3>
            </div>
            <div className="post-content">
                <img className="post-image" src={postImage} alt="post image"></img>
                <h3 className="post-title-feed">{title}</h3>
            </div>
            <div className='PostInformation-container'>
                <div className='information-container'>
                    <img src='dateImage.png'></img>
                    <h2>{date}</h2>
                </div>
                <div className='information-container'>
                    <img src='likesImage.png'></img>
                    <h2>{likesCount}</h2>
                </div>
                <div className='information-container'>
                    <img src='commentsImage.png'></img>
                    <h2>{commentsCount}</h2>
                </div>
            </div>
        </div>
    );
}

export default FeedTemplatePost;

