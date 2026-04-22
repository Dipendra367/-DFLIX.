import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ThumbsUp, Check, Star, ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import tmdb, { requests } from '../services/tmdb';
import TrailerModal from '../components/TrailerModal';
import Row from '../components/Row';
import { useAuth } from '../hooks/useAuth';
import { trackInteraction, isMovieLiked, rateMovie, getUserRating } from '../ai/recommender';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const BG_BASE = 'https://image.tmdb.org/t/p/w1280';

const MovieDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const liked = isMovieLiked(userData, parseInt(id));
  const userRating = getUserRating(userData, parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetch = async () => {
      setLoading(true);
      try {
        const endpoint = type === 'tv'
          ? requests.fetchTvDetails(id)
          : requests.fetchMovieDetails(id);
        const { data } = await tmdb.get(endpoint);
        setDetails(data);
      } catch (err) {
        console.error('Failed to fetch details', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [type, id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#E50914]" />
      </div>
    );
  }

  if (!details) return null;

  const title = details.title || details.name;
  const year = (details.release_date || details.first_air_date || '').substring(0, 4);
  const runtime = details.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details.episode_run_time?.[0]
    ? `${details.episode_run_time[0]}m / ep`
    : null;
  const genres = details.genres || [];
  const cast = details.credits?.cast?.slice(0, 12) || [];
  const similar = details.similar?.results?.slice(0, 12) || [];
  const trailerKey = details.videos?.results?.find(v => v.type === 'Trailer')?.key;

  const handlePlay = () => {
    trackInteraction(user?.uid, { ...details, media_type: type }, 'watch');
    setShowTrailer(true);
  };

  const handleLike = () => {
    trackInteraction(user?.uid, { ...details, media_type: type }, 'like');
  };

  const handleRate = (star) => {
    rateMovie(user?.uid, details.id, star === userRating ? 0 : star);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Backdrop */}
      <div className="relative h-[45vh] md:h-[60vh] w-full">
        <img
          src={`${BG_BASE}${details.backdrop_path || details.poster_path}`}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 md:left-8 z-20 flex items-center gap-2 text-white/70 hover:text-white transition"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      {/* Details */}
      <div className="relative z-10 -mt-40 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <img
              src={`${IMG_BASE}${details.poster_path}`}
              alt={title}
              className="w-40 md:w-56 rounded-xl shadow-2xl"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 space-y-4 pt-4 md:pt-0"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold">{title}</h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              {year && <span className="text-green-400 font-semibold">{year}</span>}
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {runtime}
                </span>
              )}
              <span className="px-2 py-0.5 border border-gray-600 rounded text-xs">
                {type === 'tv' ? 'TV Show' : 'Movie'}
              </span>
              {details.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star size={14} fill="currentColor" />
                  {details.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {genres.map(g => (
                <span key={g.id} className="px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
              {details.overview}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded-md hover:bg-white/80 transition"
              >
                <Play size={18} fill="black" /> Play
              </button>
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md border-2 font-semibold transition ${
                  liked
                    ? 'border-green-400 bg-green-500/20 text-green-400'
                    : 'border-white/40 text-white hover:border-white'
                }`}
              >
                {liked ? <Check size={18} /> : <ThumbsUp size={18} />}
                {liked ? 'Liked' : 'Add to List'}
              </button>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm text-gray-400">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={22}
                    className={`cursor-pointer transition-colors ${
                      star <= (hoveredStar || userRating)
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    }`}
                    fill={star <= (hoveredStar || userRating) ? 'currentColor' : 'none'}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRate(star)}
                  />
                ))}
              </div>
              {userRating > 0 && (
                <span className="text-yellow-400 text-sm font-semibold">{userRating}/5</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-gray-100">Cast</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {cast.map(person => (
                <div key={person.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 mb-2">
                    {person.profile_path ? (
                      <img
                        src={`${IMG_BASE}${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white line-clamp-1">{person.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-12 pb-20">
            <Row title="More Like This" movies={similar} />
          </div>
        )}
      </div>

      {showTrailer && (
        <TrailerModal
          movie={{ ...details, media_type: type }}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default MovieDetail;
