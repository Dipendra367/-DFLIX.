# 🎬 DFLIX - AI-Powered Movie Streaming Platform

A modern, Netflix-inspired streaming platform built with React, featuring intelligent movie recommendations powered by a custom AI engine. Browse thousands of movies, get personalized suggestions, and enjoy a premium viewing experience.

![DFLIX Banner](https://via.placeholder.com/1200x400/0a0a0a/E50914?text=DFLIX)

## ✨ Features

### 🎯 Smart Recommendations
- **AI-Powered Engine**: Custom recommendation algorithm that learns from your viewing habits
- **Personalized Rows**: "Recommended for You" and "Because You Watched" sections
- **Genre Intelligence**: Tracks your favorite genres and suggests similar content
- **Rating-Based Learning**: Recommendations improve based on your star ratings

### 🎨 Premium UI/UX
- **Netflix-Inspired Design**: Sleek, modern interface with dark theme
- **Smooth Animations**: Powered by Framer Motion for fluid transitions
- **Glass-Morphism Effects**: Modern frosted glass UI elements
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile

### 🔥 Core Features
- **Browse by Genre**: Action, Comedy, Horror, Romance, Sci-Fi, Thriller
- **Search**: Fast, debounced search with real-time results
- **My List**: Save movies to watch later
- **Continue Watching**: Pick up where you left off
- **Star Ratings**: Rate movies from 1-5 stars
- **Trailer Playback**: Watch YouTube trailers in a modal player
- **Top 10 Today**: Trending movies with animated rankings

### 🔐 User Management
- **Firebase Authentication**: Secure login with Google or Email/Password
- **User Profiles**: Personalized profile with viewing stats
- **Watch History**: Track everything you've watched
- **Offline-First**: LocalStorage-based data persistence

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **React Router** - Client-side routing

### Backend & APIs
- **Firebase Auth** - User authentication and management
- **TMDB API** - Real movie data, posters, and trailers
- **LocalStorage** - Client-side data persistence

### UI Components
- **Lucide React** - Beautiful, consistent icon set
- **Custom Components** - Reusable MovieCard, Row, Hero, Modal components

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))
- Firebase Project ([Create one here](https://console.firebase.google.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dflix.git
cd dflix
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

4. **Configure Firebase**

Update `src/services/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
dflix/
├── src/
│   ├── ai/
│   │   └── recommender.js          # AI recommendation engine
│   ├── components/
│   │   ├── Hero.jsx                # Hero banner component
│   │   ├── MovieCard.jsx           # Movie card with hover effects
│   │   ├── Row.jsx                 # Horizontal movie row
│   │   ├── Top10Row.jsx            # Top 10 with rankings
│   │   ├── TrailerModal.jsx        # YouTube trailer player
│   │   ├── Navbar.jsx              # Navigation with search
│   │   └── Footer.jsx              # Footer component
│   ├── pages/
│   │   ├── Home.jsx                # Main landing page
│   │   ├── Search.jsx              # Search results page
│   │   ├── Category.jsx            # Genre category pages
│   │   ├── MovieDetail.jsx         # Movie details page
│   │   ├── MyList.jsx              # User's saved movies
│   │   ├── Profile.jsx             # User profile page
│   │   └── Login.jsx               # Authentication page
│   ├── services/
│   │   ├── tmdb.js                 # TMDB API client
│   │   └── firebase.js             # Firebase config
│   ├── hooks/
│   │   └── useAuth.js              # Authentication hook
│   ├── App.jsx                     # Main app component
│   └── main.jsx                    # Entry point
├── public/                         # Static assets
├── .env                            # Environment variables
└── package.json                    # Dependencies
```

## 🧠 AI Recommendation Engine

The recommendation system uses a custom scoring algorithm that considers:

- **Genre Preferences**: +5 points for liked genres, +3 for watched genres
- **Popularity**: +2 points for highly popular movies
- **User Ratings**: -6 to +6 points based on 1-5 star ratings
- **Watch History**: -10 points for already watched movies

Movies are scored, sorted, and the top 20 are displayed in the "Recommended for You" row.

## 🎨 Key Features Breakdown

### Personalized Recommendations
```javascript
// AI scoring logic
const scored = allMovies.map(movie => {
  let score = 0;
  if (genres.some(g => likedGenres.includes(g))) score += 5;
  if (genres.some(g => watchedGenres.includes(g))) score += 3;
  if (movie.popularity > 80) score += 2;
  if (watchedIds.includes(movie.id)) score -= 10;
  const rating = ratings[movie.id];
  if (rating) score += (rating - 3) * 3;
  return { ...movie, aiScore: score };
});
```

### Smooth Animations
- Staggered card entrance animations
- Hover scale and glow effects
- Modal fade-in/fade-out transitions
- Smooth row scrolling

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts (2-6 columns)
- Touch-friendly interactions
- Optimized for all screen sizes

## 🔮 Future Enhancements

- [ ] Backend API (Node.js + MongoDB)
- [ ] Collaborative filtering recommendations
- [ ] Social features (share lists, follow friends)
- [ ] Watch parties with real-time sync
- [ ] Multiple user profiles per account
- [ ] Advanced search filters
- [ ] Watchlist sharing
- [ ] Email notifications
- [ ] Dark/Light theme toggle
- [ ] Accessibility improvements (WCAG compliance)

## 📸 Screenshots

### Home Page
![Home](https://via.placeholder.com/800x450/0a0a0a/E50914?text=Home+Page)

### Movie Details
![Details](https://via.placeholder.com/800x450/0a0a0a/E50914?text=Movie+Details)

### My List
![My List](https://via.placeholder.com/800x450/0a0a0a/E50914?text=My+List)

### Profile
![Profile](https://via.placeholder.com/800x450/0a0a0a/E50914?text=Profile)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie database API
- [Firebase](https://firebase.google.com/) for authentication services
- [Lucide](https://lucide.dev/) for the beautiful icon set
- [Framer Motion](https://www.framer.com/motion/) for animation capabilities
- Netflix for design inspiration

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/dflix](https://github.com/yourusername/dflix)

---

⭐ Star this repo if you found it helpful!
