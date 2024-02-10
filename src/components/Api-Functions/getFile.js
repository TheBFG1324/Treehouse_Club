import axios from 'axios';

// Function to fetch the file using Axios
async function getFile(fileId) {
    try {
        const response = await axios.get(`http://localhost:4000/api/files/${fileId}`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error('Error fetching file:', error);
        return null;
    }
}

export default getFile