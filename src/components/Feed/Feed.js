import React, { useEffect, useState, useCallback } from 'react';
import FeedTemplatePost from './FeedTemplatePost.js';
import './css/Feed.css';
import PostView from "../General/ViewPost.js";
import loadPosts from '../Api-Functions/loadPosts.js';

function Feed(props) {
    const user = props.user;
    const [round, setRound] = useState(0);
    const [feedPostIds, setFeedPostIds] = useState([]);

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

    const closePost = () => {
        setSelectedPost(null);
    };

    const selectPost = (post) => {
        console.log("POST", post)
        setSelectedPost(post);
    };

    const addMorePosts = useCallback(() => {
        setRound(prevRound => prevRound + 1);
    }, []);

    const isScrollBottom = () => {
        // Checks if the user has scrolled to the bottom of the document
        return window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isScrollBottom()) {
                addMorePosts();
            }
        };

        // Adding the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Removing the event listener on cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, [addMorePosts]);

    return (
        <div className='feed-container'>
            <div className='feedPosts-container'>
                {feedPostIds.map((postId, index) => (
                    <FeedTemplatePost key={index} postId={postId} onClick={selectPost} />
                ))}
            </div>
            {selectedPost && (
                <div className='modal'>
                    <div className='modal-content'>
                        <PostView postInfo={selectedPost} user={user} onClick={closePost} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Feed;
