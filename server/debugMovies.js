import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moviehub')
  .then(async () => {
    const movies = await Movie.find({});
    console.log(JSON.stringify(movies, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
