import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '', genre: '', year: '', rating: '', description: '', trailer: '', downloadLink: ''
  });
  const [posterFile, setPosterFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchMovies();
  }, [user, navigate]);

  const fetchMovies = async () => {
    try {
      const { data } = await axios.get('/api/movies');
      // API returns { movies, page, pages } - extract the movies array
      setMovies(Array.isArray(data) ? data : (data.movies || []));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch movies');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPosterFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    // For file upload, need FormData
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    
    if (posterFile) {
      submissionData.append('poster', posterFile);
    }

    try {
      if (isEditing) {
        await axios.put(`/api/movies/${editId}`, submissionData, config);
        setMessage('Movie updated successfully');
      } else {
        await axios.post('/api/movies', submissionData, config);
        setMessage('Movie created successfully');
      }
      
      setFormData({ title: '', genre: '', year: '', rating: '', description: '', trailer: '', downloadLink: '' });
      setPosterFile(null);
      setIsEditing(false);
      setEditId(null);
      fetchMovies();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Operation failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (movie) => {
    setIsEditing(true);
    setEditId(movie._id);
    setFormData({
      title: movie.title,
      genre: movie.genre,
      year: movie.year,
      rating: movie.rating || '',
      description: movie.description,
      trailer: movie.trailer || '',
      downloadLink: movie.downloadLink || ''
    });
    setPosterFile(null);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        await axios.delete(`/api/movies/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchMovies();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  if (loading) return <div className="text-center mt-20 text-white">Loading Admin Dashboard...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-dark-100 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {message && <div className="bg-primary/20 border border-primary text-white p-4 rounded mb-8">{message}</div>}

        <div className="bg-dark-200 p-6 rounded-lg shadow-lg mb-12 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">{isEditing ? 'Edit Movie' : 'Add New Movie'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-dark-300 border-none rounded p-2 text-white focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Genre</label>
              <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} required className="w-full bg-dark-300 border-none rounded p-2 text-white focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Release Year</label>
              <input type="number" name="year" value={formData.year} onChange={handleInputChange} required className="w-full bg-dark-300 border-none rounded p-2 text-white focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Rating</label>
              <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleInputChange} className="w-full bg-dark-300 border-none rounded p-2 text-white focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Trailer URL</label>
              <input type="text" name="trailer" value={formData.trailer} onChange={handleInputChange} className="w-full bg-dark-300 border-none rounded p-2 text-white focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Download Link</label>
              <input type="text" name="downloadLink" value={formData.downloadLink} onChange={handleInputChange} className="w-full bg-dark-300 border-none rounded p-2 text-white focus:ring-1 focus:ring-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-400">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" className="w-full bg-dark-300 border-none rounded p-2 text-white focus:ring-1 focus:ring-primary"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-400">Movie Poster File (JPG/PNG)</label>
              <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer" />
            </div>
            <div className="md:col-span-2 flex gap-4 mt-2">
              <button type="submit" className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition">
                {isEditing ? 'Update Movie' : 'Save Movie'}
              </button>
              {isEditing && (
                <button type="button" onClick={() => { setIsEditing(false); setEditId(null); setFormData({ title: '', genre: '', year: '', rating: '', description: '', trailer: '', downloadLink: '' }); setPosterFile(null); }} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Manage Movies</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-dark-200 rounded-lg overflow-hidden">
              <thead className="bg-dark-300 text-gray-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b border-gray-800">Title</th>
                  <th className="px-6 py-4 border-b border-gray-800">Year</th>
                  <th className="px-6 py-4 border-b border-gray-800">Genre</th>
                  <th className="px-6 py-4 border-b border-gray-800">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {movies.map((m) => (
                  <tr key={m._id} className="hover:bg-dark-300/50 transition">
                    <td className="px-6 py-4 font-medium text-white">{m.title}</td>
                    <td className="px-6 py-4 text-gray-400">{m.year}</td>
                    <td className="px-6 py-4 text-gray-400">{m.genre}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(m)} className="text-blue-400 hover:text-blue-300 mr-4 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(m._id)} className="text-primary hover:text-red-400 font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {movies.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-dark-200">No movies found</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
