import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Film, AlertCircle } from 'lucide-react';
import tmdb, { requests } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      try {
        let endpoint;
        if (query.trim()) {
          endpoint = requests.searchMovies(query);
        } else {
          endpoint = `/discover/movie?language=en-US&sort_by=popularity.desc`;
        }
        const { data } = await tmdb.get(endpoint);
        let results = (data.results || []).filter(r => r.media_type !== 'person');
        setMovies(results);
      } catch (err) {
        console.error('Error searching:', err);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchSearch, 400);
    return () => clearTimeout(t);
  }, [query]);

  // Framer motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 lg:px-12 pb-20 bg-[#0a0a0a]">
      {/* Search Header */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <div className="w-12 h-12 rounded-full bg-[#E50914]/20 flex items-center justify-center flex-shrink-0">
          <SearchIcon className="text-[#E50914] w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
            {query ? `Results for "${query}"` : 'Discover Trending'}
          </h1>
          {!loading && movies.length > 0 && (
            <p className="text-sm text-gray-400 mt-1 font-medium tracking-wide uppercase">
              {movies.length} {movies.length === 1 ? 'Title' : 'Titles'} Found
            </p>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 border-t-[#E50914] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="w-5 h-5 text-gray-500 animate-pulse" />
            </div>
          </div>
        </div>
      ) : movies.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8"
        >
          {movies.map(movie => (
            <motion.div key={movie.id} variants={item} className="w-full">
              <MovieCard movie={movie} isGrid={true} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 px-4 text-center bg-[#141414] rounded-3xl border border-white/5 shadow-2xl max-w-3xl mx-auto mt-10"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">No matching titles found</h2>
          <p className="text-gray-400 max-w-md">
            We couldn't find anything matching "{query}". Try using different keywords, or check for typos.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Search;
