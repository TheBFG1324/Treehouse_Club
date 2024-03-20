import React, { useState, useEffect } from 'react';
import FollowUnfollow from '../Api-Functions/FollowUnfollow';
import getAccountInfo from '../Api-Functions/getAccountInfo';
import './css/FollowButton.css'

function FollowButton(props) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [follow, setFollow] = useState(true);
    const [callingAccountGoogleId, setCallingAccountGoogleId] = useState(null)
    const [otherAccountGoogleId, setOtherAccountGoogleId] = useState(null)

    const callingAccount = props.callingAccount;
    const otherAccount = props.otherAccount;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAccountInfo(callingAccount);
                const response2 = await getAccountInfo(otherAccount)
                setCallingAccountGoogleId(response.googleId)
                setOtherAccountGoogleId(response2.googleId)
                if (response.following.includes(otherAccount)) {
                    setIsFollowing(true);
                    setFollow(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [callingAccount, otherAccount]); // Dependency array to run the effect when these values change

    const handleClick = async () => {
        try {
            const result = await FollowUnfollow(follow, callingAccountGoogleId, otherAccountGoogleId);
            console.log(result);
            if (result && result.message) {
                setIsFollowing(!isFollowing);
                setFollow(!follow);
            }
        } catch (error) {
            console.error('Error in follow/unfollow operation:', error);
        }
    };

    return (
        <button 
            onClick={handleClick}
            className={`followButton ${isFollowing ? 'unfollow' : ''}`}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    );
}

export default FollowButton;

