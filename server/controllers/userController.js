import User from '../models/User.js';

// @desc    Add movie to watchlist
// @route   POST /api/users/watchlist/:movieId
// @access  Private
export const addToWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const movieId = req.params.movieId;

    if (user.watchlist.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    user.watchlist.push(movieId);
    await user.save();
    
    // Populate before sending back
    const updatedUser = await User.findById(user._id).populate('watchlist');
    res.json(updatedUser.watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/users/watchlist/:movieId
// @access  Private
export const removeFromWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const movieId = req.params.movieId;

    user.watchlist = user.watchlist.filter(id => id.toString() !== movieId);
    await user.save();
    
    // Populate before sending back
    const updatedUser = await User.findById(user._id).populate('watchlist');
    res.json(updatedUser.watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's watchlist
// @route   GET /api/users/watchlist
// @access  Private
export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('watchlist');
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
