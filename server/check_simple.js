import mongoose from 'mongoose';
import Movie from './models/Movie.js';

const check = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/moviehub');
    const count = await Movie.countDocuments({});
    console.log('Movie count:', count);
    const movies = await Movie.find({}, 'title genre');
    console.log('Movies:', JSON.stringify(movies, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
check();
