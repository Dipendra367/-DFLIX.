import React, { useState, useEffect } from 'react';
import { BookmarkCheck, X as XIcon, Film } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import tmdb, { requests } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { getLikedItems, trackInteraction } from '../ai/recommender';
import { motion, AnimatePresence } from 'framer-motion';

const MyList = () => {
  const { user, userData } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyList = async () => {
      const items = getLikedItems(userData);
      if (items.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }
      try {
        const promises = items.map(item => {
          const endpoint = item.media_type === 'tv'
            ? requests.fetchTvDetails(item.id)
            : requests.fetchMovieDetails(item.id);
          return tmdb.get(endpoint).catch(() => null);
        });
        const responses = await Promise.all(promises);
        const valid = responses
          .filter(r => r?.data)
          .map(r => {
            const matchItem = items.find(i => i.id === r.data.id);
            return { ...r.data, media_type: matchItem?.media_type || 'movie' };
          });
        setMovies(valid);
      } catch (err) {
        console.error('Error fetching my list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyList();
  }, [userData]);

  const handleRemove = (movie) => {
    trackInteraction(user?.uid, movie, 'like');
    setMovies(prev => prev.filter(m => m.id !== movie.id));
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 lg:px-12 pb-20 bg-gradient-to-br from-[#111] via-[#0d0d0d] to-[#080808] relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 pt-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <BookmarkCheck className="text-green-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              My List
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-medium tracking-wide">
              Your personalized collection of favorites
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/10 border-t-green-400 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : movies.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            <AnimatePresence>
              {movies.map(m => (
                <motion.div 
                  key={m.id}
                  layout
                  initial={{ opacity: 0.6, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative group w-full"
                >
                  <div className="w-full relative rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(255,255,255,0.06)]">
                    <MovieCard movie={m} isGrid={true} />
                  </div>
                  
                  {/* Modern Remove Button */}
                  <button
                    onClick={() => handleRemove(m)}
                    className="absolute -top-3 -right-3 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-[#141414] border border-white/10 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-110 shadow-xl"
                    title="Remove from My List"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 px-4 text-center bg-[#141414] rounded-3xl border border-white/5 shadow-2xl max-w-3xl mx-auto mt-10"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Film className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Your list is currently empty</h2>
            <p className="text-gray-400 max-w-md mb-8">
              Build your custom library by clicking the 👍 button on any movie or TV show you want to save for later.
            </p>
            <a href="/" className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
              Discover Movies
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyList;
