import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import dotenv from 'dotenv';
dotenv.config();

const unsplashImages = [
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop", // Cinema scene
  "https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=800&auto=format&fit=crop", // Sci-fi pattern
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", // Space
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop", // Dark red action
  "https://images.unsplash.com/photo-1502899576159-f224dc2349fa?q=80&w=800&auto=format&fit=crop", // City skyline
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moviehub')
  .then(async () => {
    const movies = await Movie.find({});
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        if (movie.poster && movie.poster.includes('tmdb.org')) {
            // Assign a random high quality unsplash image
            const newImage = unsplashImages[i % unsplashImages.length];
            await Movie.updateOne({ _id: movie._id }, { $set: { poster: newImage } });
            console.log(`Updated ${movie.title} with new poster`);
        }
    }
    console.log('Finished updating posters.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
