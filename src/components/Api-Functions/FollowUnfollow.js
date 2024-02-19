import axios from 'axios';

async function followUnfollow(follow, callingAccountGoogleId, otherAccountGoogleId) {
    try {
        const data = {
            follow,
            callingAccountGoogleId,
            otherAccountGoogleId
        };

        const response = await axios.post('http://localhost:4000/api/follow-unfollow', data);
        return response.data;
    } catch (error) {
        console.error('Error in follow/unfollow operation:', error);
        return null;
    }
}

export default followUnfollow;
