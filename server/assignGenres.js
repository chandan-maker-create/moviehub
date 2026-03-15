import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const assignGenres = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moviehub');
    
    const genreMap = {
      "Inception": "Action",
      "Interstellar": "Sci-Fi",
      "The Dark Knight": "Action",
      "Avatar": "Sci-Fi",
      "Titanic": "Romance",
      "Joker": "Drama",
      "Spider-Man No Way Home": "Action",
      "Doctor Strange": "Sci-Fi",
      "Gladiator": "Action"
    };

    const movies = await Movie.find({});
    for (let movie of movies) {
      if (genreMap[movie.title]) {
        await Movie.updateOne({ _id: movie._id }, { $set: { genre: genreMap[movie.title] } });
        console.log(`Updated ${movie.title} category to ${genreMap[movie.title]}`);
      } else {
        await Movie.updateOne({ _id: movie._id }, { $set: { genre: "Drama" } });
        console.log(`Updated ${movie.title} category to Drama`);
      }
    }

    console.log('Finished updating genres');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

assignGenres();
