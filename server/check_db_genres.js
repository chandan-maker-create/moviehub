import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const checkGenres = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moviehub');
    console.log('MongoDB connected');

    const movies = await Movie.find({});
    console.log(`Total movies found: ${movies.length}`);
    
    const genres = await Movie.distinct('genre');
    console.log('Distinct genres found in DB:', genres);

    const filteredGenres = genres.filter(Boolean).sort();
    console.log('Filtered/Sorted genres:', filteredGenres);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkGenres();
