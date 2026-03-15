import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchWatchlist = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const { data } = await axios.get('/api/users/watchlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWatchlist(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch watchlist');
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, [user, navigate]);

  if (loading) return <div className="min-h-screen pt-24 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen pb-20 pt-24 bg-dark-100 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-10 border-b border-white/5 pb-4">My List</h1>
        
        {watchlist.length === 0 ? (
          <div className="text-center py-32 text-gray-400 glass-card rounded-2xl border-dashed border-2 border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-white">Your watchlist is empty</h2>
            <p className="text-lg">Explore movies and add them to your list to watch later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
