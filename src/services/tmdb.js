import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const requests = {
  fetchTrending: `/trending/all/week?language=en-US`,
  fetchNetflixOriginals: `/discover/tv?with_networks=213`,
  fetchTopRated: `/movie/top_rated?language=en-US`,
  fetchActionMovies: `/discover/movie?with_genres=28`,
  fetchComedyMovies: `/discover/movie?with_genres=35`,
  fetchHorrorMovies: `/discover/movie?with_genres=27`,
  fetchRomanceMovies: `/discover/movie?with_genres=10749`,
  fetchDocumentaries: `/discover/movie?with_genres=99`,
  fetchSciFiMovies: `/discover/movie?with_genres=878`,
  fetchThrillerMovies: `/discover/movie?with_genres=53`,
  fetchMovieDetails: (id) => `/movie/${id}?append_to_response=videos,credits,similar`,
  fetchTvDetails: (id) => `/tv/${id}?append_to_response=videos,credits,similar`,
  searchMovies: (query) => `/search/multi?query=${query}`,
};

export default tmdb;
