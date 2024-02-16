import axios from 'axios';

async function getPdf(fileId) {
    try {
        const url = `http://localhost:4000/api/pdf/${fileId}`;
        const response = await axios.get(url, { responseType: 'blob' });
        return response.data
    } catch (error) {
        console.error('Error fetching PDF:', error);
        return null;
    }
}

export default getPdf;
