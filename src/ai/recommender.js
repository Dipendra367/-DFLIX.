// ── helpers ──────────────────────────────────────────────
const getStorage = (userId) => {
  const raw = localStorage.getItem(`dflix_${userId}`);
  if (raw) return JSON.parse(raw);
  const fresh = {
    liked: [], watched: [], likedGenres: [], watchedGenres: [],
    history: [], ratings: {}
  };
  localStorage.setItem(`dflix_${userId}`, JSON.stringify(fresh));
  return fresh;
};

const saveStorage = (userId, data) => {
  localStorage.setItem(`dflix_${userId}`, JSON.stringify(data));
  window.dispatchEvent(new Event('dflix_update'));
};

// ── track interaction ─────────────────────────────────────
export const trackInteraction = (userId, movie, type = 'watch') => {
  if (!userId) return;
  const data = getStorage(userId);
  const genreIds = movie.genre_ids || (movie.genres || []).map(g => g.id) || [];
  const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');

  if (type === 'watch') {
    if (!data.watched.includes(movie.id)) data.watched.push(movie.id);
    // Keep history ordered, most recent first
    data.history = [
      { id: movie.id, media_type: mediaType, title: movie.title || movie.name, poster: movie.poster_path, timestamp: Date.now() },
      ...data.history.filter(h => h.id !== movie.id)
    ].slice(0, 50);
    genreIds.forEach(g => { if (!data.watchedGenres.includes(g)) data.watchedGenres.push(g); });
  } else if (type === 'like') {
    const existingIdx = data.liked.findIndex(item =>
      typeof item === 'object' ? item.id === movie.id : item === movie.id
    );
    if (existingIdx !== -1) {
      data.liked.splice(existingIdx, 1);
    } else {
      data.liked.push({ id: movie.id, media_type: mediaType });
      genreIds.forEach(g => { if (!data.likedGenres.includes(g)) data.likedGenres.push(g); });
    }
  } else if (type === 'rate') {
    // rating should be passed as extra param — handled in rateMovie
  }

  saveStorage(userId, data);
};

// ── rate a movie ──────────────────────────────────────────
export const rateMovie = (userId, movieId, rating) => {
  if (!userId) return;
  const data = getStorage(userId);
  if (!data.ratings) data.ratings = {};
  if (rating === 0) {
    delete data.ratings[movieId];
  } else {
    data.ratings[movieId] = rating;
    // Boost liked genres for highly rated movies
    if (rating >= 4 && !data.liked.some(i => (typeof i === 'object' ? i.id === movieId : i === movieId))) {
      // don't auto-like, just store
    }
  }
  saveStorage(userId, data);
};

// ── get user rating ───────────────────────────────────────
export const getUserRating = (userData, movieId) => {
  return userData?.ratings?.[movieId] || 0;
};

// ── check if liked ────────────────────────────────────────
export const isMovieLiked = (userData, movieId) => {
  if (!userData?.liked) return false;
  return userData.liked.some(item =>
    typeof item === 'object' ? item.id === movieId : item === movieId
  );
};

// ── get liked items with media_type ──────────────────────
export const getLikedItems = (userData) => {
  if (!userData?.liked) return [];
  return userData.liked.map(item =>
    typeof item === 'object' ? item : { id: item, media_type: 'movie' }
  );
};

// ── get recently watched ──────────────────────────────────
export const getRecentlyWatched = (userData, limit = 10) => {
  return (userData?.history || []).slice(0, limit);
};

// ── get "because you watched" data ───────────────────────
export const getBecauseYouWatched = (userData) => {
  const history = userData?.history || [];
  if (history.length === 0) return null;
  return history[0]; // Most recently watched
};

// ── AI recommendations ────────────────────────────────────
export const generateRecommendations = (allMovies, userData) => {
  if (!userData || !allMovies || allMovies.length === 0) return [];

  const likedGenres = userData.likedGenres || [];
  const watchedGenres = userData.watchedGenres || [];
  const watchedIds = userData.watched || [];
  const ratings = userData.ratings || {};

  const scored = allMovies.map(movie => {
    let score = 0;
    const genres = movie.genre_ids || [];

    if (genres.some(g => likedGenres.includes(g))) score += 5;
    if (genres.some(g => watchedGenres.includes(g))) score += 3;
    if (movie.popularity > 80) score += 2;
    if (watchedIds.includes(movie.id)) score -= 10;
    const rating = ratings[movie.id];
    if (rating) score += (rating - 3) * 3; // -6 to +6 based on 1-5 stars

    return { ...movie, aiScore: score };
  });

  scored.sort((a, b) => b.aiScore - a.aiScore);

  const result = [];
  const seen = new Set();
  for (const m of scored) {
    if (m.aiScore > 0 && !seen.has(m.id)) {
      result.push(m);
      seen.add(m.id);
    }
    if (result.length >= 20) break;
  }
  return result;
};

// ── remove from history ──────────────────────────────────
export const removeFromHistory = (userId, movieId) => {
  if (!userId) return;
  const data = getStorage(userId);
  data.history = data.history.filter(h => h.id !== movieId);
  data.watched = data.watched.filter(id => id !== movieId);
  saveStorage(userId, data);
};

// ── genre-filtered recommendations ───────────────────────
export const getGenreMovies = (allMovies, genreId) => {
  if (!genreId) return allMovies;
  return allMovies.filter(m => (m.genre_ids || []).includes(genreId));
};
