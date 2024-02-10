import axios from 'axios';

async function createPost(postData) {
    try {
        const response = await axios.post('http://localhost:4000/api/create-post', postData);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }
}

export default createPost