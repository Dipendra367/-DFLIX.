import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tmdb, { requests } from '../services/tmdb';

const TrailerModal = ({ movie, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getTrailer = async () => {
      setLoading(true);
      try {
        console.log('[TrailerModal] Movie data:', movie);
        
        // If video data is already embedded in movie object, use it directly
        if (movie?.videos?.results?.length) {
          const found =
            movie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
            movie.videos.results.find(v => v.site === 'YouTube');
          setTrailerKey(found?.key || null);
          setLoading(false);
          return;
        }

        // Determine media type with fallback
        const isTv = movie.media_type === 'tv' || !!movie.first_air_date;
        const endpoint = isTv ? requests.fetchTvDetails(movie.id) : requests.fetchMovieDetails(movie.id);
        
        console.log('[TrailerModal] Fetching from endpoint:', endpoint);
        console.log('[TrailerModal] Media type:', movie.media_type, 'isTv:', isTv);
        
        const { data } = await tmdb.get(endpoint);
        const videos = data?.videos?.results || [];
        
        console.log('[TrailerModal] Videos found:', videos.length);
        
        const found =
          videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
          videos.find(v => v.site === 'YouTube');
        
        console.log('[TrailerModal] Trailer key:', found?.key);
        
        setTrailerKey(found?.key || null);
      } catch (err) {
        console.error('[TrailerModal] Error fetching trailer:', err);
        setTrailerKey(null);
      } finally {
        setLoading(false);
      }
    };

    if (movie?.id) getTrailer();
  }, [movie]);

  const mediaType = movie?.media_type || (movie?.first_air_date ? 'tv' : 'movie');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl rounded-xl bg-[#141414] overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-50 rounded-full bg-black/60 p-1.5 hover:bg-white/20 transition"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Video */}
          <div className="relative pt-[56.25%] w-full bg-black">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-t-4 border-[#E50914]" />
              </div>
            ) : trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Trailer"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500">
                <span className="text-4xl">🎬</span>
                <p>No trailer available</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{movie?.title || movie?.name}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                  <span className="text-green-400 font-semibold">
                    {Math.round((movie?.vote_average || 0) * 10)}% Match
                  </span>
                  <span>{(movie?.release_date || movie?.first_air_date || '').substring(0, 4)}</span>
                </div>
              </div>
              <button
                onClick={() => { onClose(); navigate(`/title/${mediaType}/${movie.id}`); }}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg transition"
              >
                <ExternalLink size={13} /> Full Details
              </button>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{movie?.overview}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrailerModal;
