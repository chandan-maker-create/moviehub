import axios from 'axios';

const test = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/movies/genres');
    console.log('Genres from API:', res.data);
    process.exit(0);
  } catch (err) {
    console.error('API Error:', err.message);
    process.exit(1);
  }
};

test();
