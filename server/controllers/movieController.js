import Movie from '../models/Movie.js';

// @desc    Get all distinct genres
// @route   GET /api/movies/genres
// @access  Public
export const getGenres = async (req, res) => {
  try {
    const genres = await Movie.distinct('genre');
    res.json(genres.filter(Boolean).sort());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all movies (with search, filter, and pagination)
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req, res) => {
  try {
    const pageSize = 12; // Movies per page
    const page = Number(req.query.pageNumber) || 1;

    // Search by title
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    // Filter by genre
    const genre = req.query.genre 
      ? { 
          genre: {
            $regex: req.query.genre,
            $options: 'i'
          }
        } 
      : {};

    // Combine filters
    const query = { ...keyword, ...genre };

    const count = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ movies, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/movies/:id/reviews
// @access  Private
export const createMovieReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    console.log('--- createMovieReview triggered ---');
    console.log('req.body:', req.body);
    console.log('req.user:', req.user);
    
    const movie = await Movie.findById(req.params.id);
    console.log('Found movie:', movie ? movie.title : 'Not found');

    if (movie) {
      console.log('movie.reviews:', movie.reviews);
      
      if (!req.user || !req.user._id) {
         console.warn("User ID not found on request object");
         return res.status(401).json({ message: "Not authorized" });
      }

      const alreadyReviewed = movie.reviews.find(
        (r) => r.user && r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        console.log('User already reviewed.');
        return res.status(400).json({ message: 'Movie already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id || req.user.id,
      };
      
      console.log('Pushing review:', review);

      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;

      await movie.save({ validateModifiedOnly: true });
      console.log('Review saved successfully.');
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error('CRASH in createMovieReview:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
};

// @desc    Delete movie review
// @route   DELETE /api/movies/:id/reviews/:reviewId
// @access  Private
export const deleteMovieReview = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      if (!req.user || !req.user._id) {
         return res.status(401).json({ message: "Not authorized" });
      }

      // Find the review to verify it exists and belongs to the user
      const reviewIndex = movie.reviews.findIndex(
        (r) => r._id.toString() === req.params.reviewId
      );

      if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if user is the author of the review (or admin - optional)
      if (movie.reviews[reviewIndex].user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
         return res.status(403).json({ message: 'Not authorized to delete this review' });
      }

      // Remove the review
      movie.reviews.splice(reviewIndex, 1);

      // Recalculate stats
      movie.numReviews = movie.reviews.length;
      if (movie.reviews.length > 0) {
        movie.rating = movie.reviews.reduce((acc, item) => item.rating + acc, 0) / movie.reviews.length;
      } else {
        movie.rating = 0;
      }

      await movie.save({ validateModifiedOnly: true });
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error('CRASH in deleteMovieReview:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a movie
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = async (req, res) => {
  try {
    const { title, genre, year, rating, description, trailer, downloadLink } = req.body;
    let poster = '';
    
    if (req.file) {
      poster = req.file.path; // Cloudinary URL
    }

    const movie = new Movie({
      title,
      genre,
      year,
      rating: rating || 0,
      poster,
      description,
      trailer,
      downloadLink
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res) => {
  try {
    const { title, genre, year, rating, description, trailer, downloadLink } = req.body;
    
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      movie.title = title || movie.title;
      movie.genre = genre || movie.genre;
      movie.year = year || movie.year;
      movie.rating = rating || movie.rating;
      movie.description = description || movie.description;
      movie.trailer = trailer || movie.trailer;
      movie.downloadLink = downloadLink || movie.downloadLink;

      if (req.file) {
        movie.poster = req.file.path; // Cloudinary URL
      }

      const updatedMovie = await movie.save();
      res.json(updatedMovie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      await movie.deleteOne();
      res.json({ message: 'Movie removed' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
