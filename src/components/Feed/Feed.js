import React, { useEffect, useState } from 'react'
import FeedTemplatePost from './FeedTemplatePost.js';
import './css/Feed.css'
import PostView from "../General/ViewPost.js"
import loadPosts from '../Api-Functions/loadPosts.js';

function Feed(props){
    const user = props.user
    const [round, setRound] = useState(0)
    const [feedPostIds, setFeedPostIds] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const currentRoundPostIds = await loadPosts(user, round);
            if (currentRoundPostIds) {
                setFeedPostIds(prevIds => [...prevIds, ...currentRoundPostIds]);
            }
        };
        fetchData();
    }, [round]);
    

    const [selectedPost, setSelectedPost] = useState(null);

    const closePost = () =>{
        setSelectedPost(null)
    }

    const selectPost = (post) => {
        setSelectedPost(post)
    }

    const addMorePosts = () => {
        setRound(prevRound => prevRound + 1);
    };
    

    return(
       <div className='feed-container'>
            <div className='feedPosts-container'>
                {feedPostIds.map((postId, index) => (
                    <FeedTemplatePost key={index} postId={postId} onClick={selectPost} />
                ))}
            </div>
            <div className='addPosts-btn'>
                <button onClick={addMorePosts}>Load Posts</button>
            </div>
            {selectedPost && (
                <div className='modal'>
                    <div className='modal-content'>
                        <PostView postInfo={selectedPost} user={user} onClick={closePost}/>
                     </div>
                </div>
            )}
       </div>
    )
}

export default Feed