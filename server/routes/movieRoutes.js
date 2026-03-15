import express from 'express';
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, createMovieReview, deleteMovieReview, getGenres } from '../controllers/movieController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.route('/genres').get(getGenres);

router.route('/')
  .get(getMovies)
  .post(protect, admin, upload.single('poster'), createMovie);

router.route('/:id')
  .get(getMovieById)
  .put(protect, admin, upload.single('poster'), updateMovie)
  .delete(protect, admin, deleteMovie);

router.route('/:id/reviews')
  .post(protect, createMovieReview);

router.route('/:id/reviews/:reviewId')
  .delete(protect, deleteMovieReview);

export default router;
