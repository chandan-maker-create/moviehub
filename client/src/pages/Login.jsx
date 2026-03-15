import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-100 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/ab180a27-b661-44d7-a6d9-940cb32f2f4a/7fb62e44-31fd-4e1c-b5e0-46840d75384c/US-en-20231009-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center bg-blend-overlay animate-fade-in" style={{ backgroundColor: 'rgba(10,10,10,0.85)' }}>
      <div className="glass p-12 rounded-2xl w-full max-w-md mt-16 animate-slide-up relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent-pink"></div>
        <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Sign In</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input 
            type="email" 
            placeholder="Email address" 
            className="p-4 bg-dark-300/50 backdrop-blur-sm border border-gray-600/50 text-white rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-4 bg-dark-300/50 backdrop-blur-sm border border-gray-600/50 text-white rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-white p-4 rounded-lg font-bold mt-4 hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 text-gray-400 text-sm">
          New to MovieHub? <Link to="/register" className="text-white hover:text-primary transition-colors font-semibold ml-1">Sign up now.</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
