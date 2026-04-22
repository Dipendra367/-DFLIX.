import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const Top10Row = ({ title, movies }) => {
  const rowRef = useRef(null);
  const [isMoved, setIsMoved] = useState(false);
  const navigate = useNavigate();

  const handleClick = (direction) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  const top10 = movies.slice(0, 10);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      <div className="group relative">
        {isMoved && (
          <ChevronLeft
            className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
            onClick={() => handleClick('left')}
          />
        )}
        <div
          ref={rowRef}
          className="flex items-end gap-0 overflow-x-scroll no-scrollbar"
        >
          {top10.map((movie, index) => {
            const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
            return (
              <div
                key={movie.id}
                className="relative flex-shrink-0 flex items-end cursor-pointer group/item"
                onClick={() => navigate(`/title/${mediaType}/${movie.id}`)}
              >
                {/* Big number */}
                <span
                  className="text-[80px] md:text-[120px] font-black leading-none select-none"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px rgba(255,255,255,0.15)',
                    fontFamily: '"Arial Black", Impact, sans-serif',
                    marginRight: '-12px',
                    zIndex: 0,
                  }}
                >
                  {index + 1}
                </span>
                {/* Card */}
                <div className="relative z-10 w-[100px] md:w-[140px] h-[150px] md:h-[210px] movie-card rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={`${IMG_BASE}${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/40 transition-all duration-200 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold opacity-0 group-hover/item:opacity-100 transition-opacity text-center px-1 line-clamp-2">
                      {movie.title || movie.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <ChevronRight
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
};

export default Top10Row;
