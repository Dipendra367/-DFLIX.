import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import tmdb, { requests } from '../services/tmdb';
import Hero from '../components/Hero';
import Row from '../components/Row';

const Category = () => {
  const { type } = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        let url;
        if (type === 'tv') url = requests.fetchNetflixOriginals;
        else if (type === 'movies') url = requests.fetchActionMovies;
        else if (type === 'new') url = requests.fetchTrending;
        if (url) {
          const { data } = await tmdb.get(url);
          setMovies(data.results || []);
        }
      } catch (err) {
        console.error('Error fetching category', err);
      }
    };
    fetchCategory();
  }, [type]);

  const title = type === 'tv' ? 'TV Shows' : type === 'movies' ? 'Movies' : 'New & Popular';

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {movies.length > 0 && <Hero movie={movies[0]} />}
      <div className="relative z-30 -mt-16 px-4 lg:px-10">
        <Row title={title} movies={movies.slice(1)} isLargeRow />
      </div>
    </div>
  );
};

export default Category;
