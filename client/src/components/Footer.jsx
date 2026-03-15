import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark-100 border-t border-white/5 text-gray-400 py-10 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300">
            MovieHub
          </div>
          <p className="text-sm">© {new Date().getFullYear()} MovieHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition"><FaGithub size={20} /></a>
            <a href="#" className="hover:text-white transition"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
