import React, { useState } from 'react';
import { Play, ThumbsUp, Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { trackInteraction, isMovieLiked, rateMovie, getUserRating } from '../ai/recommender';
import TrailerModal from './TrailerModal';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie, isLargeRow, isGrid }) => {
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const liked = isMovieLiked(userData, movie.id);
  const userRating = getUserRating(userData, movie.id);
  const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
  
  const handleLike = (e) => {
    e.stopPropagation();
    trackInteraction(user?.uid, movie, 'like');
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    console.log('[MovieCard] Play clicked, movie:', movie.title || movie.name, 'id:', movie.id);
    trackInteraction(user?.uid, movie, 'watch');
    setShowModal(true);
    console.log('[MovieCard] showModal set to true');
  };

  const handleRate = (e, star) => {
    e.stopPropagation();
    rateMovie(user?.uid, movie.id, star === userRating ? 0 : star);
  };

  const handleCardClick = () => {
    navigate(`/title/${mediaType}/${movie.id}`);
  };

  if (!movie.poster_path && !movie.backdrop_path) return null;

  const imgSrc = isLargeRow || isGrid
    ? `${IMG_BASE}${movie.poster_path || movie.backdrop_path}`
    : `${IMG_BASE}${movie.backdrop_path || movie.poster_path}`;

  return (
    <>
      <div
        className={`movie-card relative cursor-pointer rounded-lg overflow-hidden flex-shrink-0 border border-white/10 shadow-lg ${
          isGrid ? 'w-full h-full aspect-[2/3]' : (isLargeRow ? 'w-[160px] md:w-[200px]' : 'w-[180px] md:w-[260px]')
        }`}
        onClick={handleCardClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setHoveredStar(0); }}
      >
        <img
          src={imgSrc}
          className={`w-full object-cover brightness-110 contrast-110 ${isGrid ? 'h-full aspect-[2/3]' : (isLargeRow ? 'h-[240px] md:h-[300px]' : 'h-[100px] md:h-[145px]')}`}
          alt={movie.title || movie.name}
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="text-white font-semibold text-xs mb-1 truncate">{movie.title || movie.name}</h3>
          
          {/* Match % */}
          <p className="text-green-400 text-[10px] font-bold mb-2">
            {Math.round((movie.vote_average || 0) * 10)}% Match
          </p>

          {/* Star rating */}
          <div className="flex gap-0.5 mb-2" onClick={e => e.stopPropagation()}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={12}
                className={`cursor-pointer transition-colors ${star <= (hoveredStar || userRating) ? 'text-yellow-400' : 'text-gray-600'}`}
                fill={star <= (hoveredStar || userRating) ? 'currentColor' : 'none'}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={(e) => handleRate(e, star)}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlay}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition"
              title="Play Trailer"
            >
              <Play className="h-4 w-4" fill="black" />
            </button>
            <button
              onClick={handleLike}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                liked ? 'border-green-400 bg-green-500/20 text-green-400' : 'border-white/40 text-white hover:border-white'
              }`}
              title={liked ? "Remove from Pending" : "Add to Pending"}
            >
              {liked ? <Check className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {showModal && <TrailerModal movie={{ ...movie, media_type: mediaType }} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default MovieCard;
