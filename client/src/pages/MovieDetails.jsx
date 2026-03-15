import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlay, FaDownload, FaStar, FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Trailer Modal State
  const [showTrailer, setShowTrailer] = useState(false);

  // Helper to get YouTube embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url.startsWith('http') ? url : `https://${url}`;
  };

  useEffect(() => {
    const fetchMovieAndWatchlist = async () => {
      try {
        const { data } = await axios.get(`/api/movies/${id}`);
        setMovie(data);
        
        // If user is logged in, check if movie is in watchlist
        if (user) {
          const token = JSON.parse(localStorage.getItem('userInfo')).token;
          const { data: watchlist } = await axios.get('/api/users/watchlist', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setInWatchlist(watchlist.some(m => m._id === id));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Movie not found');
        setLoading(false);
      }
    };
    fetchMovieAndWatchlist();
  }, [id, user]);

  const toggleWatchlist = async () => {
    if (!user) return;
    setWatchlistLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (inWatchlist) {
        await axios.delete(`/api/users/watchlist/${id}`, config);
        setInWatchlist(false);
      } else {
        await axios.post(`/api/users/watchlist/${id}`, {}, config);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('Watchlist Error', error);
    }
    setWatchlistLoading(false);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!user) return;
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess('');
    
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post(`/api/movies/${id}/reviews`, { rating, comment }, config);
      setReviewSuccess('Review submitted successfully!');
      setRating(0);
      setComment('');
      
      // Refresh movie data to show new review
      const { data } = await axios.get(`/api/movies/${id}`);
      setMovie(data);
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to submit review');
    }
    setReviewLoading(false);
  };

  const deleteReviewHandler = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/movies/${id}/reviews/${reviewId}`, config);
      
      // Refresh movie data to show updated reviews
      const { data } = await axios.get(`/api/movies/${id}`);
      setMovie(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete review');
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;
  if (error) return <div className="min-h-screen pt-24 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Detail Hero Background */}
      <div className="relative h-[60vh] w-full">
        <img 
          src={movie.poster ? (movie.poster.startsWith('http') ? movie.poster : `http://localhost:5000${movie.poster}`) : 'https://via.placeholder.com/1200x800'} 
          alt={movie.title} 
          className="w-full h-full object-cover opacity-50 block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-100 via-dark-100/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          {/* Poster Container */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 mx-auto md:mx-0 animate-slide-up">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5 ring-1 ring-white/10 group relative">
              <img 
                src={movie.poster ? (movie.poster.startsWith('http') ? movie.poster : `http://localhost:5000${movie.poster}`) : 'https://via.placeholder.com/400x600'} 
                alt={movie.title} 
                className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Details Content */}
          <div className="flex-1 text-white pt-4 md:pt-16 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-lg">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-8 text-sm font-semibold">
              <span className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-base">
                <FaStar /> {movie.rating}
              </span>
              <span>{movie.year}</span>
              <span className="px-4 py-1.5 bg-dark-200/80 backdrop-blur-sm rounded-full text-xs tracking-widest uppercase border border-white/10 shadow-sm">{movie.genre}</span>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-3xl">
              {movie.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              {movie.trailer ? (
                <button 
                  onClick={() => setShowTrailer(true)} 
                  className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-all duration-300 transform hover:scale-105 font-bold"
                >
                   <FaPlay /> Watch Trailer
                </button>
              ) : (
                <button disabled className="flex items-center gap-2 bg-gray-600/50 text-gray-400 px-8 py-3.5 rounded-full cursor-not-allowed font-bold border border-white/5">
                   <FaPlay /> No Trailer Found
                </button>
              )}
              
              {movie.downloadLink ? (
                <a href={movie.downloadLink.startsWith('http') ? movie.downloadLink : `https://${movie.downloadLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 glass hover:bg-white/10 text-white px-8 py-3.5 rounded-full transition-all duration-300 font-bold border border-white/20">
                   <FaDownload /> Download File
                </a>
              ) : (
                <button disabled className="flex items-center gap-2 glass opacity-50 text-gray-400 px-8 py-3.5 rounded-full cursor-not-allowed font-bold border border-white/5">
                   <FaDownload /> Download Unavailable
                </button>
              )}
              
              {user && (
                <button 
                  onClick={toggleWatchlist} 
                  disabled={watchlistLoading}
                  className={`flex items-center gap-2 border px-8 py-3.5 rounded-full transition-all duration-300 font-bold shadow-lg md:ml-auto ${inWatchlist ? 'bg-white/10 border-white/30 text-white' : 'glass hover:bg-white/10 border-white/20 text-white'}`}
                >
                  {watchlistLoading ? '...' : inWatchlist ? <><FaCheck className="text-green-500" /> In Watchlist</> : <><FaPlus /> Add to List</>}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pb-20 border-t border-white/5 pt-12">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-10">Reviews</h2>
          
          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Review List */}
            <div className="flex-1">
              {movie.reviews && movie.reviews.length === 0 && (
                <div className="glass-card text-gray-400 p-8 rounded-xl text-center border-dashed border-2 border-gray-600/50">
                  No reviews yet. Be the first to share your thoughts!
                </div>
              )}
              <div className="space-y-6">
                {movie.reviews && movie.reviews.map(review => (
                  <div key={review._id} className="glass p-6 rounded-xl border border-white/5 hover-lift">
                    <div className="flex items-center justify-between mb-3">
                       <strong className="text-white text-lg font-bold">{review.name}</strong>
                       <div className="flex items-center gap-4">
                         <span className="flex items-center text-yellow-500 text-sm font-bold bg-yellow-500/10 px-2 py-0.5 rounded gap-1">
                           <FaStar /> {review.rating}
                         </span>
                         {user && (user._id === review.user || user.id === review.user || user.role === 'admin') && (
                           <button 
                             onClick={() => deleteReviewHandler(review._id)}
                             className="text-gray-400 hover:text-primary transition-colors focus:outline-none"
                             title="Delete Review"
                           >
                             <FaTrash />
                           </button>
                         )}
                       </div>
                    </div>
                    <p className="text-primary text-xs font-semibold tracking-wider mb-4 uppercase">{new Date(review.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Write a Review */}
            <div className="w-full md:w-1/3">
              <h3 className="text-2xl font-bold text-white mb-6">Write a Review</h3>
              {user ? (
                <form onSubmit={submitReviewHandler} className="glass p-8 rounded-xl">
                  {reviewError && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">{reviewError}</div>}
                  {reviewSuccess && <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg mb-6 text-sm">{reviewSuccess}</div>}
                  
                  <div className="mb-5">
                    <label className="block text-gray-300 text-sm font-semibold mb-2 uppercase tracking-wide">Rating</label>
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full p-4 bg-dark-300/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer appearance-none"
                      required
                    >
                      <option value="">Select a rating...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent ★</option>
                    </select>
                  </div>

                  <div className="mb-8">
                    <label className="block text-gray-300 text-sm font-semibold mb-2 uppercase tracking-wide">Comment</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="5"
                      className="w-full p-4 bg-dark-300/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                      required
                      placeholder="What did you think about the movie?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={reviewLoading}
                    className="w-full bg-primary text-white font-bold py-4 px-4 rounded-lg hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:transform-none"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="glass p-8 rounded-xl text-center border-dashed border-2 border-gray-600/50">
                  <p className="text-gray-300 mb-6 text-lg">Sign in to share your thoughts.</p>
                  <Link to="/login" className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition font-bold"
            >
              ✕
            </button>
            <iframe 
              src={getEmbedUrl(movie.trailer)} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovieDetails;
