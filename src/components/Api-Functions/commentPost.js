import axios from 'axios';

const commentPost = async (postId, callingAccount, otherAccount, insert, comment) => {
    try {
        const response = await axios.post('http://localhost:4000/api/comment-post', {
            postId,
            callingAccount,
            otherAccount,
            insert,
            comment
        });

        return response.data;
    } catch (error) {
        // Handle error appropriately
        console.error('Error posting comment:', error);
        throw error;
    }
};

export default commentPost