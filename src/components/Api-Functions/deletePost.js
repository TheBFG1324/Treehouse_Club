import axios from 'axios';

const deletePost = async (postId) => {
    try {
        const response = await axios.post('http://localhost:4000/api/delete-post', { postId });
        console.log(response.data); // Handle the response as needed
        return response.data;
    } catch (error) {
        console.error('Error occurred while deleting post:', error.response ? error.response.data : error);
        throw error; // Re-throw the error for further handling if necessary
    }
};

export default deletePost;
