import React from 'react'
import './componentcss/AccountTemplatePost.css'

function AccountTemplatePost(props){
    console.log(props.props.title)
    const postImage = props.props.postImage
    const title = props.props.title
    const date = props.props.date
    const likes = props.props.likes
    const commentsCount = props.props.commentsCount
    return (
        <div className='AccountTemplatePost-container'>
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