import axios from 'axios';


const serverURL = 'http://localhost:4000'
const googleIdEnrolled = async (googleId) => {
    try {
        const response = await axios.get(`${serverURL}/api/google-id-enrolled`, { params: { googleId } });
        return response.data;
    } catch (error) {
        console.error('Error occurred while fetching enrollment status:', error);
        throw error;
    }
};

export default googleIdEnrolled;
