import axios from 'axios';

async function getPost(postId) {
    try {
        const response = await axios.get('http://localhost:4000/api/get-post', {
            params: { postId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export default getPost