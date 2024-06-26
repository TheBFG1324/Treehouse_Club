import React, { useState, useEffect } from 'react';
import getPost from '../Api-Functions/getPost'
import './css/AccountTemplatePost.css';
import getFile from '../Api-Functions/getFile';

function AccountTemplatePost(props) {
    const [post, setPost] = useState(null);
    const [imageURL, setImageURL] = useState(null)
    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await getPost(props.postId);
                const postData = response.post
                if (postData && response.success) {
                    const coverPhoto = await getFile(postData.postImage)
                    const imageURL = URL.createObjectURL(coverPhoto);
                    setImageURL(imageURL)
                    setPost(postData);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                // Handle error appropriately
            }
        }

        fetchPost();
    }, [props.postId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    }
    
    
    

    if (!post) {
        return <div>Loading post...</div>; // Or any other placeholder
    }

    return (
        <div className='AccountTemplatePost-container' onClick={() => props.onClick(post)}>
            <div className='PostCover-container'></div>
            <div className='postImage-container'>
                <img src={imageURL} alt={post.title} />
                <h1 className='imagetitle'>{post.title}</h1>
            </div>
            <div className='PostInformation-container'>
                <div className='information-container'>
                    <img src='dateImage.png' alt="Date" />
                    <h2>{formatDate(post.date)}</h2>
                </div>
                <div className='information-container'>
                    <img src='likesImage.png' alt="Likes" />
                    <h2>{post.likes.length}</h2>
                </div>
                <div className='information-container'>
                    <img src='commentsImage.png' alt="Comments" />
                    <h2>{post.comments.length}</h2>
                </div>
            </div>
        </div>
    );
}

export default AccountTemplatePost;
