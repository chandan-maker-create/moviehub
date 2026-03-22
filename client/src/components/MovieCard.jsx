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
    <Link to={`/movie/${movie._id}`} className="group relative rounded-2xl overflow-hidden cursor-pointer hover-lift bg-dark-200 aspect-[2/3] block border border-white/10 shadow-lg">
      {posterUrl ? (
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:opacity-80"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-dark-300 text-gray-500 text-center p-4">
          No Poster Available
        </div>
      )}
      
      {/* Center Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none">
          <div className="bg-white/20 backdrop-blur-md border border-white/40 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,11,24,0.3)] transform scale-75 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <FaPlay className="pl-1 text-2xl" />
          </div>
      </div>
      
      {/* Overlay Details Panel - Sliding up */}
      <div className="absolute inset-x-0 bottom-0 glass-panel translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-end p-5 z-20">
        <h3 className="text-white font-extrabold text-lg leading-tight mb-2 drop-shadow-md truncate">{movie.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
          <span className="text-green-400 font-bold bg-green-400/20 px-2 py-0.5 rounded border border-green-500/30">{movie.rating}</span>
          <span className="opacity-50">•</span>
          <span className="font-semibold text-gray-200">{movie.year}</span>
          <span className="opacity-50">•</span>
          <span className="truncate border border-white/20 px-2 py-0.5 rounded-full bg-black/40 text-gray-300 shadow-inner">{movie.genre}</span>
        </div>
        
        {user && (
            <button 
              onClick={toggleWatchlist}
              disabled={watchlistLoading}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm border border-white/20 text-white p-2 text-sm rounded-full hover:border-white hover:bg-white/20 transition-all flex items-center justify-center hover:scale-110 z-30 pointer-events-auto shadow-xl"
              title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              {watchlistLoading ? '...' : inWatchlist ? <FaCheck className="text-green-500" /> : <FaPlus />}
            </button>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
