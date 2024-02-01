import axios from 'axios';

const serverURL = 'http://localhost:4000'

const createAccount = async (userData) => {
    try {
        const response = await axios.post(`${serverURL}/api/create-account`, userData);
        return response.data;
    } catch (error) {
        console.error('Error occurred while creating account:', error);
        throw error;
    }
};

export default createAccount;
