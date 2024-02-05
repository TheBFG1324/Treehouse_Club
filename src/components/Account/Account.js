import React, { useState, useEffect } from 'react';
import './css/Account.css';
import AccountTemplatePost from './AccountTemplatePost';
import AccountButtons from './AccountButtons';
import PostView from '../General/ViewPost';
import getAccountInfo from '../Api-Functions/getAccountInfo'

function Account(props) {
    const publicName = props.user;
    const anonymousName = "0x" + props.anonymousUser
    
    const [publicPostCount, setPublicPostCount] = useState(0);
    const [privatePostCount, setPrivatePostCount] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [publicEngagement, setPublicEngagement] = useState(0);
    const [privateEngagement, setPrivateEngagement] = useState(0);

    
    useEffect(() => {
        async function fetchData() {
            try {
                const pubProfileInfo = await getAccountInfo(props.user);
                const anonymousProfileInfo = await getAccountInfo(props.anonymousUser);
                setPublicPostCount(pubProfileInfo.posts.length);
                setPrivatePostCount(anonymousProfileInfo.posts.length);
                setFollowers(pubProfileInfo.followers.length);
                setFollowing(anonymousProfileInfo.following.length);
                setPublicEngagement(pubProfileInfo.engagements);
                setPrivateEngagement(anonymousProfileInfo.engagements);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [props.publicName, props.anonymousUser]); // Dependencies for useEffect

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

    const publicPosts = new Array(6).fill(post); // Create an array of posts
    const anonymousPosts = new Array(3).fill(post);
    const profilePicture = "test2.jpeg"; // Ensure this path is correct and accessible

    const [accountUser, setAccount] = useState(props.user);
    const [Public, setPublic] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    const toggleAccountChange = () => {
        setPublic(!Public);
    };

    const selectPost = (post) => {
        setSelectedPost(post);
    };

    const closePost = () => {
        setSelectedPost(null)
    }

    return (
        <div className='account-container'>
            <div className='account-header'>
                <div className='profile-section'>
                    <img src={Public ? profilePicture : "Treehouse1.png"} alt="profile pic" className="circle-image"/>
                    <h1 className='profile-name-account'>{Public ? publicName : anonymousName}</h1>
                </div>
                <div className='account-info-buttons'>
                    <div className='account-information'>
                        <div className='stats posts'>
                            <h2 className='posts-count'>{Public ? publicPostCount: privatePostCount}</h2>
                            <h3 className='post-title'>posts</h3>
                        </div>
                        <div className='stats followers'>
                            <h2 className='followers-count'>{followers}</h2>
                            <h3 className='followers-title'>followers</h3>
                        </div>
                        <div className='stats following'>
                            <h2 className='following-count'>{following}</h2>
                            <h3 className='following-title'>following</h3>
                        </div>
                        <div className='engagment'>
                            <h2 className='engagements-count'>{Public ? publicEngagement: privateEngagement}</h2>
                            <h3 className='engagement-title'>engagement</h3>
                        </div>
                    </div>
                    <div className='account-buttons'>
                        <AccountButtons account={accountUser} changeAccount={toggleAccountChange} />
                    </div>
                </div>
            </div>
            <div className='account-posts'>
                {Public ? publicPosts.map((post, index) => (
                    <AccountTemplatePost key={index} postInfo={post} onClick={selectPost}/>
                )) : anonymousPosts.map((post, index) => (
                    <AccountTemplatePost key={index} postInfo={post} onClick={selectPost}/>
                ))}
            </div>
            {selectedPost && (
                <div className='modal'>
                    <div className='modal-content'>
                        {Public && <PostView postInfo={selectedPost} user={publicName} onClick={closePost}/>}
                        {!Public && <PostView postInfo={selectedPost} user={anonymousName} onClick={closePost}/>}
                     </div>
                </div>
            )}
        </div>
    );
}

export default Account;

