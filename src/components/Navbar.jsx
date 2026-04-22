import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Search as SearchIcon, X, User } from 'lucide-react';
import { logout } from '../services/firebase';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!searchInput.trim()) return;
    const t = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput, navigate]);

  useEffect(() => {
    if (!location.pathname.startsWith('/search')) {
      setSearchInput('');
      setShowSearch(false);
    }
  }, [location.pathname]);

  const handleNavClick = () => {
    setSearchInput('');
    setShowSearch(false);
  };

  const closeSearch = () => {
    setSearchInput('');
    setShowSearch(false);
    if (location.pathname.startsWith('/search')) navigate('/');
  };

  return (
    <header
      className={`fixed top-0 z-[60] flex w-full items-center justify-between px-4 py-3 transition-all duration-500 lg:px-10 ${
        isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      {/* Left */}
      <div className="flex items-center gap-6 md:gap-10">
        <Link to="/" onClick={handleNavClick}>
          <span className="dflix-logo">DFLIX</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5">
          {[
            ['Home', '/'],
            ['TV Shows', '/category/tv'],
            ['Movies', '/category/movies'],
            ['New & Popular', '/category/new'],
            ['My List', '/my-list'],
          ].map(([label, path]) => (
            <Link
              key={path}
              to={path}
              onClick={handleNavClick}
              className="text-[13px] font-medium text-gray-300 transition hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search */}
        <AnimatePresence initial={false}>
          {showSearch ? (
            <motion.div
              key="search-open"
              initial={{ width: 36, opacity: 0.5 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 36, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/[0.15] rounded-full px-3 py-1.5 overflow-hidden"
            >
              <SearchIcon className="h-4 w-4 text-gray-300 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search titles..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-500 min-w-0"
              />
              <button
                onClick={closeSearch}
                className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="h-3 w-3 text-gray-300" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="search-closed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setShowSearch(true);
                setTimeout(() => searchRef.current?.focus(), 100);
              }}
              className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/[0.2] flex items-center justify-center transition-all duration-200 group"
            >
              <SearchIcon className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Profile */}
        <Link to="/profile" onClick={handleNavClick} title="My Profile">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="h-8 w-8 rounded-full cursor-pointer border-2 border-transparent hover:border-white transition" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#E50914] flex items-center justify-center cursor-pointer hover:opacity-80 transition">
              <User size={16} />
            </div>
          )}
        </Link>

        <LogOut onClick={logout} className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white transition" />
      </div>
    </header>
  );
};

export default Navbar;
