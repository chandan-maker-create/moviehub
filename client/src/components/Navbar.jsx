import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaSearch, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [keyword, setKeyword] = useState('');

  // Add scroll listener for transparent to black navbar effect
  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-2' : 'bg-transparent bg-gradient-to-b from-black/80 to-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-extrabold text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-pink drop-shadow-md">MovieHub</Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors duration-300">Home</Link>
              <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors duration-300">Movies</Link>
              <Link to="/mylist" className="text-gray-300 hover:text-white font-medium transition-colors duration-300">My List</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <form onSubmit={submitHandler} className="relative flex items-center">
               <input 
                 type="text"
                 name="q"
                 value={keyword}
                 onChange={(e) => setKeyword(e.target.value)}
                 placeholder="Search titles, genres..."
                 className="bg-dark-300/50 border border-gray-600/50 text-white text-sm rounded-full focus:outline-none focus:border-primary focus:bg-black/80 w-36 sm:w-64 transition-all duration-300 py-1.5 pl-10 pr-4"
               />
               <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
                 <FaSearch className="text-gray-400 hover:text-white transition cursor-pointer" />
               </button>
            </form>
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                   <Link to="/admin" className="text-sm border border-primary px-3 py-1 rounded hover:bg-primary transition text-white">Admin</Link>
                )}
                <div className="relative group cursor-pointer flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <span className="hidden sm:block text-sm">{user.name}</span>
                  <div className="absolute right-0 top-8 w-48 bg-dark-200 shadow-xl rounded py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-300 hover:text-white w-full text-left">
                      <FaSignOutAlt /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-white hover:text-primary transition font-medium">Log In</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-1 rounded hover:bg-red-700 transition font-medium">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
