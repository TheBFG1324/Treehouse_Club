import axios from "axios";

async function loadPosts(callingAccount, round) {
    try {
        const response = await axios.get('http://localhost:4000/api/load-posts', {
            params: {
                callingAccount: callingAccount,
                round: round
            }
        });
        return response.data
    } catch (error) {
        console.error('Error fetching posts:', error.message);
    }
}

export default loadPosts
