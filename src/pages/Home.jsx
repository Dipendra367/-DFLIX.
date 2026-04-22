import React, { useState, useEffect, useRef, useMemo } from 'react';
import tmdb, { requests } from '../services/tmdb';
import Hero from '../components/Hero';
import Row from '../components/Row';
import Top10Row from '../components/Top10Row';
import { SkeletonRow } from '../components/SkeletonCard';
import { useAuth } from '../hooks/useAuth';
import {
  generateRecommendations,
  getRecentlyWatched,
  getBecauseYouWatched,
} from '../ai/recommender';

const MOODS = [
  { label: 'All', id: null },
  { label: 'Action', id: 28 },
  { label: 'Comedy', id: 35 },
  { label: 'Horror', id: 27 },
  { label: 'Romance', id: 10749 },
  { label: 'Sci-Fi', id: 878 },
  { label: 'Thriller', id: 53 },
];

const Home = () => {
  const { userData } = useAuth();
  const [movies, setMovies] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodMovies, setMoodMovies] = useState([]);
  const [moodLoading, setMoodLoading] = useState(false);
  const recsGenerated = useRef(false);

  // Fetch all base rows once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [originals, trending, topRated, action, comedy, horror, scifi] = await Promise.all([
          tmdb.get(requests.fetchNetflixOriginals),
          tmdb.get(requests.fetchTrending),
          tmdb.get(requests.fetchTopRated),
          tmdb.get(requests.fetchActionMovies),
          tmdb.get(requests.fetchComedyMovies),
          tmdb.get(requests.fetchHorrorMovies),
          tmdb.get(requests.fetchSciFiMovies),
        ]);
        setMovies({
          originals: originals.data.results,
          trending: trending.data.results,
          topRated: topRated.data.results,
          action: action.data.results,
          comedy: comedy.data.results,
          horror: horror.data.results,
          scifi: scifi.data.results,
        });
      } catch (err) {
        console.error('Failed to fetch movies', err);
      }
    };
    fetchData();
  }, []);

  // Generate AI recs once
  useEffect(() => {
    if (movies && userData && !recsGenerated.current) {
      const pool = Object.values(movies).flat();
      setRecommendations(generateRecommendations(pool, userData));
      recsGenerated.current = true;
    }
  }, [movies, userData]);

  // Fetch from TMDB fresh when mood changes — this is what fixes the bug
  useEffect(() => {
    if (!selectedMood) {
      setMoodMovies([]);
      return;
    }
    let cancelled = false;
    const fetchMood = async () => {
      setMoodLoading(true);
      try {
        const { data } = await tmdb.get(
          `/discover/movie?with_genres=${selectedMood}&sort_by=popularity.desc&language=en-US`
        );
        if (!cancelled) setMoodMovies(data.results || []);
      } catch (err) {
        console.error('Mood fetch error', err);
      } finally {
        if (!cancelled) setMoodLoading(false);
      }
    };
    fetchMood();
    return () => { cancelled = true; };
  }, [selectedMood]); // Re-fetches every time selectedMood changes

  const heroMovie = useMemo(() => {
    if (!movies?.originals?.length) return null;
    return movies.originals[Math.floor(Math.random() * movies.originals.length)];
  }, [movies?.originals]);

  const recentlyWatched = useMemo(() => getRecentlyWatched(userData, 10), [userData]);
  const becauseYouWatched = useMemo(() => getBecauseYouWatched(userData), [userData]);
  const allPool = useMemo(() => {
    if (!movies) return [];
    const unique = new Map();
    Object.values(movies).flat().forEach(m => unique.set(m.id, m));
    return Array.from(unique.values());
  }, [movies]);

  if (!movies) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen">
        <div className="h-[50vh] bg-gray-900 animate-pulse" />
        <div className="px-4 lg:px-10 mt-6 space-y-10">
          <SkeletonRow />
          <SkeletonRow isLarge />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  const selectedMoodLabel = MOODS.find(m => m.id === selectedMood)?.label || '';

  return (
    <div className="bg-[#0a0a0a]">
      <Hero movie={heroMovie} />

      {/* Mood Filter Pills */}
      <div className="relative z-30 px-4 lg:px-10 pt-8 pb-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-3">Browse by genre</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {MOODS.map(mood => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                selectedMood === mood.id
                  ? 'bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.25)]'
                  : 'bg-white/[0.06] text-gray-400 hover:bg-white/[0.12] hover:text-white border border-white/[0.08] hover:border-white/[0.18]'
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </div>

      <section className="relative z-30 space-y-8 md:space-y-14 px-4 lg:px-10 pb-20 pt-6">
        {/* Mood filtered content — fetched from TMDB */}
        {selectedMood !== null && (
          moodLoading ? (
            <SkeletonRow />
          ) : (
            <Row title={`${selectedMoodLabel} Movies`} movies={moodMovies} />
          )
        )}

        {/* Normal rows — only when no mood is selected */}
        {selectedMood === null && (
          <>
            {recommendations.length > 0 && (
              <Row title="Recommended for You" movies={recommendations} isLargeRow />
            )}

            {becauseYouWatched && (
              <Row
                title={`Because You Watched: ${becauseYouWatched.title}`}
                movies={allPool.filter(m => m.id !== becauseYouWatched.id).slice(0, 20)}
              />
            )}

            {recentlyWatched.length > 0 && (
              <Row title="Continue Watching" movies={allPool.filter(m => recentlyWatched.some(r => r.id === m.id))} />
            )}

            <Top10Row title="Top 10 Today" movies={movies.trending} />
            <Row title="Trending Now" movies={movies.trending} />
            <Row title="Top Rated All Time" movies={movies.topRated} />
            <Row title="Action Thrillers" movies={movies.action} />
            <Row title="Comedy" movies={movies.comedy} />
            <Row title="Horror" movies={movies.horror} />
            <Row title="Sci-Fi" movies={movies.scifi} />
            <Row title="DFLIX Originals" movies={movies.originals} isLargeRow />
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
