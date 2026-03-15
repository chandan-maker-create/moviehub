import { Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MovieCard = ({ movie }) => {
  const { user } = useContext(AuthContext);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const posterUrl = movie.poster 
    ? (movie.poster.startsWith('http') ? movie.poster : `http://localhost:5000${movie.poster}`)
    : null;

  useEffect(() => {
    if (user) {
      const checkWatchlist = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('userInfo')).token;
          const { data } = await axios.get('/api/users/watchlist', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setInWatchlist(data.some(m => m._id === movie._id));
        } catch (error) {
          console.error(error);
        }
      };
      checkWatchlist();
    }
  }, [user, movie._id]);

  const toggleWatchlist = async (e) => {
    e.preventDefault(); // Prevent navigating to MovieDetails
    if (!user) return;
    setWatchlistLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (inWatchlist) {
        await axios.delete(`/api/users/watchlist/${movie._id}`, config);
        setInWatchlist(false);
      } else {
        await axios.post(`/api/users/watchlist/${movie._id}`, {}, config);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error(error);
    }
    setWatchlistLoading(false);
  };

  return (
    <Link to={`/movie/${movie._id}`} className="group relative rounded-xl overflow-hidden cursor-pointer hover-lift bg-dark-200 aspect-[2/3] block border border-white/5 shadow-lg">
      {posterUrl ? (
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-dark-300 text-gray-500 text-center p-4">
          No Poster Available
        </div>
      )}
      
      {/* Overlay Details */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-bold text-lg leading-tight mb-2 truncate">{movie.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-300 mb-3">
          <span className="text-green-500 font-semibold">{movie.rating} Rating</span>
          <span>•</span>
          <span>{movie.year}</span>
          <span>•</span>
          <span className="truncate">{movie.genre}</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-white text-black p-2 rounded-full hover:bg-gray-300 transition w-8 flex items-center justify-center">
            <FaPlay className="pl-0.5" />
          </div>
          {user && (
            <button 
              onClick={toggleWatchlist}
              disabled={watchlistLoading}
              className="bg-transparent border border-gray-400 text-white p-2 text-sm rounded-full hover:border-white transition flex items-center justify-center"
              title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              {watchlistLoading ? '...' : inWatchlist ? <FaCheck className="text-green-500" /> : <FaPlus />}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
