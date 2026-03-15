import axios from 'axios';

const testApi = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/movies/genres');
    console.log('API Response status:', res.status);
    console.log('API Response data:', res.data);
  } catch (err) {
    console.error('API Error:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
  }
};

testApi();
