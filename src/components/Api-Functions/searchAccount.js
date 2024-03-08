import axios from 'axios';

const searchAccount = async (name) => {
  try {
   
    if (!name.trim()) {
      console.error('The search term is empty.');
      return;
    }

    const response = await axios.get('http://localhost:4000/api/search-account', {
      params: { name }
    });

    return response.data;
  } catch (error) {
    console.error('Error occurred while fetching accounts:', error.message);
    return []; 
  }
};

export default searchAccount;
