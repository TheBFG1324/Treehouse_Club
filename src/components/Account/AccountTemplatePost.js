import React, { useState } from 'react'
import './css/AccountTemplatePost.css'


function AccountTemplatePost(props){
    const post = props.postInfo
    return (
        <div className='AccountTemplatePost-container' onClick={() => props.onClick(post)}>
            <div className='PostCover-container'></div>
            <div className='postImage-container'>
                <img src={post.postImage}></img>
                <h1 className='imagetitle'>{post.title}</h1>
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
    )
}

export default AccountTemplatePost