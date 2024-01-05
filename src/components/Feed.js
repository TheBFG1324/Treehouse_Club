import React, { useState } from 'react'
import FeedTemplatePost from './FeedTemplatePost';
import './componentcss/Feed.css'
import PostView from "./ViewPost.js"


function Feed(){
    let post = {
        account: "TheBFG1324",
        post: 'OdeToYes.pdf',
        postImage: "dec.jpeg",
        title: "Ode To Yes",
        date: "10/25/23",
        likes: 16,
        comments: {
            "Sally": "Good job Tim",
            "Bob": "Fuck you Tim"
        },
        commentsCount: 2,
        profilePicture: "test2.jpeg"
    };

    let initial = [post, post, post, post, post]

    const [posts, setPosts] = useState(initial)
    const [selectedPost, setSelectedPost] = useState(null);

    const closePost = () =>{
        setSelectedPost(null)
    }

    const selectPost = (post) => {
        setSelectedPost(post)
    }

    const addMorePosts = () => {
        setPosts(prevPosts => [...prevPosts, post, post, post, post, post])
    }

    return(
       <div className='feed-container'>
            <div className='feedPosts-container'>
                {posts.map((post, index) => (
                    <FeedTemplatePost key={index} postInfo={post} onClick={selectPost} />
                ))}
            </div>
            <div className='addPosts-btn'>
                <button onClick={addMorePosts}>Load Posts</button>
            </div>
            {selectedPost && (
                <div className='modal'>
                    <div className='modal-content'>
                        <PostView postInfo={selectedPost} user={post.account} onClick={closePost}/>
                     </div>
                </div>
            )}
       </div>
    )
}

export default Feed