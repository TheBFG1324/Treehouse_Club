import React, { useState } from 'react'
import './componentcss/AccountTemplatePost.css'


function AccountTemplatePost(props){
    console.log("here")
    console.log(props.user)
    console.log(props)
    const postImage = props.postInfo.postImage
    const title = props.postInfo.title
    const date = props.postInfo.date
    const likes = props.postInfo.likes
    const commentsCount = props.postInfo.commentsCount

    return (
        <div className='AccountTemplatePost-container' onClick={() => props.onClick(props.postInfo)}>
            <div className='PostCover-container'></div>
            <div className='postImage-container'>
                <img src={postImage}></img>
                <h1 className='imagetitle'>{title}</h1>
            </div>
            <div className='PostInformation-container'>
                <div className='information-container'>
                    <img src='dateImage.png'></img>
                    <h2>{date}</h2>
                </div>
                <div className='information-container'>
                    <img src='likesImage.png'></img>
                    <h2>{likes}</h2>
                </div>
                <div className='information-container'>
                    <img src='commentsImage.png'></img>
                    <h2>{commentsCount}</h2>
                </div>
            </div>
        </div>
    )
}

export default AccountTemplatePost