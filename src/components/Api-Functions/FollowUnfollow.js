import axios from 'axios';

async function followUnfollow(follow, callingAccount, otherAccount) {
    try {
        const data = {
            follow,
            callingAccount,
            otherAccount
        };

        const response = await axios.post('http://localhost:4000/api/follow-unfollow', data);
        return response.data;
    } catch (error) {
        console.error('Error in follow/unfollow operation:', error);
        return null;
    }
}

export default followUnfollow;
