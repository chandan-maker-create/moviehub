import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { FaPlay, FaInfoCircle, FaChevronDown } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
  const API = import.meta.env.VITE_API_URL || '';
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Always re-derive from current location.search on every render
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';
  const genre = searchParams.get('genre') || '';

  // Fetch distinct genres from DB on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await axios.get(`${API}/api/movies/genres`);
        setGenres(data);
      } catch (err) {
        console.error('Failed to fetch genres', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch movies whenever the URL search string changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams(location.search);
        const kw = params.get('keyword') || '';
        const g = params.get('genre') || '';
        const pg = Number(params.get('pageNumber')) || 1;

        const { data } = await axios.get(
          `${API}/api/movies?keyword=${encodeURIComponent(kw)}&genre=${encodeURIComponent(g)}&pageNumber=${pg}`
        );

        if (Array.isArray(data)) {
          setMovies(data);
          setPage(1);
          setPages(1);
        } else {
          setMovies(data.movies || []);
          setPage(data.page || 1);
          setPages(data.pages || 1);
        }
      } catch (err) {
        setError('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [location.search]); // guaranteed to change on every navigation

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenreChange = (selectedGenre) => {
    setIsDropdownOpen(false);
    if (selectedGenre) {
      navigate(`/?genre=${encodeURIComponent(selectedGenre)}`);
    } else {
      navigate('/');
    }
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    params.set('pageNumber', newPage);
    if (keyword) params.set('keyword', keyword);
    if (genre) params.set('genre', genre);
    navigate(`/?${params.toString()}`);
  };

  // Hero only on page 1 with no filters active
  const heroMovie = (movies.length > 0 && page === 1 && !keyword && !genre) ? movies[0] : null;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      {heroMovie && (
        <div className="relative h-[80vh] w-full">
          <div className="absolute inset-0">
             <img 
              src={heroMovie.poster && heroMovie.poster.startsWith('http') ? heroMovie.poster : `${API}${heroMovie.poster}`} 
              alt={heroMovie.title}
              className="w-full h-full object-cover animate-scale-slow"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
          </div>
          
          <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl pt-24 z-10 relative">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-slide-up tracking-tight leading-[1.1]">{heroMovie.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-300 mb-8 font-semibold animate-slide-up" style={{animationDelay: '0.1s'}}>
                <span className="text-green-400 bg-green-400/10 px-3 py-1.5 rounded-md border border-green-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(74,222,128,0.15)]">{heroMovie.rating} Rating</span>
                <span className="text-lg font-medium">{heroMovie.year}</span>
                <span className="border border-white/20 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md shadow-lg text-white">{heroMovie.genre}</span>
              </div>
              
              <p className="text-lg md:text-xl text-gray-300/90 mb-10 line-clamp-3 md:line-clamp-4 animate-slide-up font-light leading-relaxed max-w-2xl" style={{animationDelay: '0.2s'}}>
                {heroMovie.description}
              </p>
              
              <div className="flex flex-wrap gap-5 animate-slide-up" style={{animationDelay: '0.3s'}}>
                <Link to={`/movie/${heroMovie._id}`} className="flex items-center gap-3 bg-white hover:bg-gray-200 text-black px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 font-bold shadow-[0_10px_30px_rgba(255,255,255,0.3)]">
                  <FaPlay className="text-xl" /> Play Now
                </Link>
                <Link to={`/movie/${heroMovie._id}`} className="flex items-center gap-3 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-10 py-4 rounded-full transition-all duration-300 font-bold border border-white/20 shadow-lg hover:shadow-2xl">
                  <FaInfoCircle className="text-xl" /> More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : (
          <div className="mb-12 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-100">
                {keyword ? `Search Results for "${keyword}"` : genre ? `${genre} Movies` : 'Latest Movies'}
              </h2>
              
              {/* Genre Dropdown */}
              <div className="relative w-full sm:w-56" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="w-full bg-white/5 backdrop-blur-md hover:bg-white/10 text-white border border-white/10 rounded-xl p-3.5 focus:outline-none transition-all duration-300 flex justify-between items-center shadow-lg group"
                >
                  <span className="font-medium tracking-wide">{genre || 'All Genres'}</span>
                  <FaChevronDown className={`text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-white' : 'text-gray-400 group-hover:text-white'}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-full glass-panel rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden max-h-72 overflow-y-auto animate-fade-in border border-white/10">
                    <div 
                      onClick={() => handleGenreChange('')}
                      className={`px-5 py-3.5 cursor-pointer border-b border-gray-700/30 transition-all duration-200 ${!genre ? 'bg-primary/20 text-primary font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                    >
                      All Genres
                    </div>
                    {genres.map((g, index) => (
                      <div 
                        key={g}
                        onClick={() => handleGenreChange(g)}
                        className={`px-5 py-3.5 cursor-pointer transition-all duration-200 ${index !== genres.length - 1 ? 'border-b border-gray-700/30' : ''} ${genre === g ? 'bg-primary/20 text-primary font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                      >
                        {g}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {movies.length === 0 ? (
              <p className="text-gray-400 py-12 text-center">
                No movies found{genre ? ` for genre "${genre}"` : ''}.
              </p>
            ) : (
              <div className="grid grid-cols-2 mt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded font-medium transition ${
                    page === 1 
                      ? 'bg-dark-300/50 text-gray-600 cursor-not-allowed' 
                      : 'bg-dark-300 text-gray-400 hover:bg-dark-200 hover:text-white'
                  }`}
                >
                  Prev
                </button>
                
                {[...Array(pages).keys()].map(x => (
                  <button
                    key={x + 1}
                    onClick={() => handlePageChange(x + 1)}
                    className={`px-4 py-2 rounded font-medium transition ${
                      x + 1 === page 
                        ? 'bg-primary text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]' 
                        : 'bg-dark-300 text-gray-400 hover:bg-dark-200 hover:text-white'
                    }`}
                  >
                    {x + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pages}
                  className={`px-4 py-2 rounded font-medium transition ${
                    page === pages 
                      ? 'bg-dark-300/50 text-gray-600 cursor-not-allowed' 
                      : 'bg-dark-300 text-gray-400 hover:bg-dark-200 hover:text-white'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
