import axios from 'axios';

/**
 * Function to get account information by name.
 * @param {string} name - The name of the account to fetch information for.
 * @returns {Promise} - Promise object represents the response from the API.
 */
async function getAccountInfo(name) {
    if (!name) {
        throw new Error('Name parameter is required');
    }

    try {
        const response = await axios.get('http://localhost:4000/api/get-account-info', {
            params: { name }
        });
        return response.data;
    } catch (error) {
        // Handle error
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response:', error.response.data);
            throw new Error(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
            throw new Error('No response received');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
            throw new Error('Error making request');
        }
    }
}

export default getAccountInfo;
