import { Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MovieCard = ({ movie }) => {
  const API = import.meta.env.VITE_API_URL || '';
  const { user } = useContext(AuthContext);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const posterUrl = movie.poster 
    ? (movie.poster.startsWith('http') ? movie.poster : `${API}${movie.poster}`)
    : null;

  useEffect(() => {
    if (user) {
      const checkWatchlist = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('userInfo')).token;
          const { data } = await axios.get(`${API}/api/users/watchlist`, {
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
        await axios.delete(`${API}/api/users/watchlist/${movie._id}`, config);
        setInWatchlist(false);
      } else {
        await axios.post(`${API}/api/users/watchlist/${movie._id}`, {}, config);
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
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-duration-400 ease-in-out flex flex-col justify-end p-5">
        <h3 className="text-white font-extrabold text-xl leading-tight mb-2 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{movie.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-300 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          <span className="text-green-400 font-bold bg-green-400/10 px-1.5 py-0.5 rounded">{movie.rating}</span>
          <span className="opacity-50">•</span>
          <span className="font-medium text-gray-300">{movie.year}</span>
          <span className="opacity-50">•</span>
          <span className="truncate border border-white/20 px-2 py-0.5 rounded-full bg-white/5">{movie.genre}</span>
        </div>
        <div className="flex gap-3 items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
          <div className="bg-primary text-white p-3 rounded-full hover:bg-primary-hover transition shadow-[0_0_15px_rgba(255,11,24,0.5)] flex items-center justify-center hover:scale-110">
            <FaPlay className="pl-0.5 text-sm" />
          </div>
          {user && (
            <button 
              onClick={toggleWatchlist}
              disabled={watchlistLoading}
              className="bg-dark-300/80 border border-white/20 text-white p-3 text-sm rounded-full hover:border-white hover:bg-white/10 transition flex items-center justify-center hover:scale-110"
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
