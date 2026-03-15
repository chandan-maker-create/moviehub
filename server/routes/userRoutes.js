import express from 'express';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/watchlist')
  .get(protect, getWatchlist);

router.route('/watchlist/:movieId')
  .post(protect, addToWatchlist)
  .delete(protect, removeFromWatchlist);

export default router;
