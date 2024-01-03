import React, { useState, useEffect } from 'react';
import './componentcss/Account.css';
import AccountTemplatePost from './AccountTemplatePost';
import AccountButtons from './AccountButtons';
import CryptoJS from 'crypto-js';

function Account(props) {
    const publicName = props.user;
    const privateName = "0x" + CryptoJS.SHA256(publicName).toString().slice(0, 16);
    const profilePicture = "test2.jpeg"; // Ensure this path is correct and accessible
    const postCount = 170;
    const followers = 170;
    const following = 190;
    const engagement = 789;

    const [accountUser, setAccount] = useState(props.user);
    const [view, setView] = useState(true);

    const toggleAccountChange = () => {
        setView(!view);
    };

    useEffect(() => {
        setAccount(props.user);
    }, [props.user]);

    let post = {
        account: "tim",
        coverPhoto: 'OdeToYes.pdf',
        postImage: "dec.jpeg",
        title: "Ode To Yes",
        date: "10/25/23",
        likes: 16,
        comments: {
            "Sally": "Good job Tim",
            "Bob": "Fuck you Tim"
        },
        commentsCount: 2
    };
    const publicPosts = new Array(6).fill(post); // Create an array of posts
    const privatePosts = new Array(3).fill(post);

    return (
        <div className='account-container'>
            <div className='account-header'>
                <div className='wrapper'>
                <div className='profile-section'>
                    <img src={view ? profilePicture : "Treehouse1.png"} alt="profile pic" className="circle-image"/>
                    <h1 className='profile-name'>{view ? publicName : privateName}</h1>
                </div>
                </div>
                <div className='account-info-buttons'>
                    <div className='account-information'>
                        <div className='stats posts'>
                            <h2 className='posts-count'>{postCount}</h2>
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
                        <div className='stats engagements'>
                            <h2 className='engagements-count'>{engagement}</h2>
                            <h3 className='engagement-title'>engagement</h3>
                        </div>
                    </div>
                    <div className='account-buttons'>
                        <AccountButtons account={accountUser} changeAccount={toggleAccountChange} />
                    </div>
                </div>
            </div>
            <div className='account-posts'>
                {view ? publicPosts.map((post, index) => (
                    <AccountTemplatePost key={index} props={post} />
                )) : privatePosts.map((post, index) => (
                    <AccountTemplatePost key={index} props={post} />
                ))}
            </div>
        </div>
    );
}

export default Account;

