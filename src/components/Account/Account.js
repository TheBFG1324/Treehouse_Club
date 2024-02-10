import React, { useState, useEffect } from 'react';
import './css/Account.css';
import AccountTemplatePost from './AccountTemplatePost';
import AccountButtons from './AccountButtons';
import PostView from '../General/ViewPost';
import getAccountInfo from '../Api-Functions/getAccountInfo'
import getFile from '../Api-Functions/getFile';


function Account(props) {
    const publicName = props.user;
    const anonymousName = "0x" + props.anonymousUser
    const googleId = props.googleId
    
    const [publicPostCount, setPublicPostCount] = useState(0);
    const [privatePostCount, setPrivatePostCount] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [publicEngagement, setPublicEngagement] = useState(0);
    const [privateEngagement, setPrivateEngagement] = useState(0);
    const [profilePictureURL, setProfilePictureURL] = useState(null);
    const [publicPostIds, setPublicPostIds] = useState([]);
    const [anonymousPostIds, setAnonymousPostIds] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const pubProfileInfo = await getAccountInfo(props.user);
                const anonymousProfileInfo = await getAccountInfo(props.anonymousUser);
                const profilePictureId = pubProfileInfo.profileImage;
                const pic = await getFile(profilePictureId)
                const imageURL = URL.createObjectURL(pic);
                setFollowers(pubProfileInfo.followers.length);
                setFollowing(pubProfileInfo.following.length);
                setProfilePictureURL(imageURL)
                setPublicPostIds(pubProfileInfo.posts)
                setPublicPostCount(pubProfileInfo.posts.length);
                setPublicEngagement(pubProfileInfo.engagements);
                setPrivateEngagement(anonymousProfileInfo.engagements);
                setAnonymousPostIds(anonymousProfileInfo.posts);
                setPrivatePostCount(anonymousProfileInfo.posts.length);
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
                    <img src={Public ? profilePictureURL : "Treehouse1.png"} alt="profile pic" className="circle-image"/>
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
                        <AccountButtons account={accountUser} changeAccount={toggleAccountChange} googleId={googleId} publicName={props.user} anonymousName={props.anonymousUser} />
                    </div>
                </div>
            </div>
            <div className='account-posts'>
                {Public ? publicPostIds.map((postId, index) => (
                    <AccountTemplatePost key={index} postId={postId} onClick={selectPost}/>
                )) : anonymousPostIds.map((postId, index) => (
                    <AccountTemplatePost key={index} postId={postId} onClick={selectPost}/>
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

