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
    <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3' : 'bg-transparent bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-extrabold text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-pink drop-shadow-md">MovieHub</Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="relative text-gray-300 hover:text-white font-medium tracking-wide transition-colors duration-300 group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/" className="relative text-gray-300 hover:text-white font-medium tracking-wide transition-colors duration-300 group">
                Movies
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/mylist" className="relative text-gray-300 hover:text-white font-medium tracking-wide transition-colors duration-300 group">
                My List
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <form onSubmit={submitHandler} className="relative flex items-center group">
               <input 
                 type="text"
                 name="q"
                 value={keyword}
                 onChange={(e) => setKeyword(e.target.value)}
                 placeholder="Search movies..."
                 className="bg-white/5 border border-white/10 text-white text-sm rounded-full focus:outline-none focus:border-white/30 focus:bg-white/10 w-[140px] sm:w-[200px] focus:w-[180px] sm:focus:w-[280px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] py-2 pl-11 pr-4 backdrop-blur-md shadow-inner"
               />
               <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20">
                 <FaSearch className="text-gray-400 group-focus-within:text-white transition-colors duration-300 cursor-pointer" />
               </button>
            </form>
            {user ? (
              <div className="flex items-center gap-5">
                {user.role === 'admin' && (
                   <Link to="/admin" className="text-sm border border-primary px-3 py-1 rounded hover:bg-primary transition text-white">Admin</Link>
                )}
                <div className="relative group cursor-pointer flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent-pink rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span className="hidden sm:block text-sm">{user.name}</span>
                  <div className="absolute right-0 top-10 w-48 bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white w-full text-left transition-colors">
                      <FaSignOutAlt className="text-primary" /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium tracking-wide">Log In</Link>
                <Link to="/register" className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] font-bold tracking-wide">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
