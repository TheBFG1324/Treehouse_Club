import axios from 'axios';


const serverURL = 'http://localhost:4000' 

const sendFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${serverURL}/api/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.fileId; 
    } catch (error) {
        throw error; 
    }
};

export default sendFile;

