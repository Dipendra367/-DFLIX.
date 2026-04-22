import React, { useState } from 'react';
import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TrailerModal from './TrailerModal';
import { useAuth } from '../hooks/useAuth';
import { trackInteraction } from '../ai/recommender';

const Hero = ({ movie }) => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!movie) return <div className="h-[50vh] md:h-[70vh] bg-[#0a0a0a]" />;

  const handlePlay = () => {
    trackInteraction(user?.uid, movie, 'watch');
    setShowModal(true);
  };

  const truncate = (str, n) => (str?.length > n ? str.substring(0, n) + '...' : str);

  return (
    <>
      <div className="relative h-[50vh] md:h-[70vh] w-full select-none overflow-hidden">
        {/* Background image */}
        <img
          src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title || movie.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Bottom gradient - strong fade to background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        {/* Left gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />

        {/* Content - positioned well above the bottom edge */}
        <div className="absolute bottom-[20%] md:bottom-[18%] left-4 md:left-12 z-10 max-w-md space-y-2 md:space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            {movie.title || movie.name || movie.original_name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xs md:text-sm text-gray-300 max-w-sm leading-relaxed"
          >
            {truncate(movie.overview, 120)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-3 pt-1"
          >
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 rounded-md bg-white px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base font-bold text-black transition hover:bg-white/80"
            >
              <Play className="h-4 w-4 md:h-5 md:w-5" fill="black" /> Play
            </button>
            <button
              onClick={() => {
                const type = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
                navigate(`/title/${type}/${movie.id}`);
              }}
              className="flex items-center gap-2 rounded-md bg-gray-500/60 px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base font-bold text-white transition hover:bg-gray-500/40 backdrop-blur-sm"
            >
              <Info className="h-4 w-4 md:h-5 md:w-5" /> More Info
            </button>
          </motion.div>
        </div>
      </div>

      {showModal && <TrailerModal movie={movie} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Hero;
