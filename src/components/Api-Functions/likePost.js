import axios from 'axios';

async function likePost(postId, callingAccount, otherAccount, insert) {
    try {
        const response = await axios.post('http://localhost:4000/api/like-post', {
            postId,
            callingAccount,
            otherAccount,
            insert
        });
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export default likePost;
