import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Film, Star, Clapperboard, ChevronRight, BookmarkCheck, TvMinimalPlay } from 'lucide-react';
import { logout } from '../services/firebase';
import { motion } from 'framer-motion';

const GENRE_MAP = {
  28: 'Action', 35: 'Comedy', 27: 'Horror', 10749: 'Romance',
  878: 'Sci-Fi', 53: 'Thriller', 99: 'Documentary', 18: 'Drama',
  16: 'Animation', 12: 'Adventure', 14: 'Fantasy', 80: 'Crime',
  9648: 'Mystery', 10752: 'War', 37: 'Western', 36: 'History',
  10402: 'Music', 10770: 'TV Movie',
};

const Profile = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const topGenres = [...(userData?.likedGenres || []), ...(userData?.watchedGenres || [])]
    .reduce((acc, g) => { acc[g] = (acc[g] || 0) + 1; return acc; }, {});
  const sortedGenres = Object.entries(topGenres)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => GENRE_MAP[id])
    .filter(Boolean);

  const totalWatched = userData?.watched?.length || 0;
  const totalRatings = Object.keys(userData?.ratings || {}).length;
  const totalWatchlist = (userData?.watchlist?.length || 0) + (userData?.completedWatchlist?.length || 0);

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Recently';

  const statItems = [
    { icon: <Film className="w-5 h-5" />, value: totalWatched, label: 'Watched', color: 'from-red-500 to-orange-500' },
    { icon: <Star className="w-5 h-5" />, value: totalRatings, label: 'Rated', color: 'from-yellow-500 to-amber-500' },
    { icon: <BookmarkCheck className="w-5 h-5" />, value: totalWatchlist, label: 'My List', color: 'from-blue-500 to-cyan-500' },
  ];

  const quickLinks = [
    { label: 'My List', icon: <TvMinimalPlay className="w-5 h-5" />, path: '/my-list' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 md:px-10 relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[80vw] h-[50vw] bg-[#E50914]/8 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[2rem] p-8 md:p-10 mb-8 overflow-hidden shadow-[0_8px_64px_rgba(0,0,0,0.4)]"
        >
          {/* Subtle top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E50914] to-transparent opacity-60" />

          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-6"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full p-[3px] bg-gradient-to-br from-[#E50914] via-[#E50914]/50 to-transparent">
                <img
                  src={user?.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover bg-[#141414]"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
            </motion.div>

            {/* Name & Email */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1"
            >
              {user?.displayName || 'DFLIX Member'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 text-sm font-medium mb-1"
            >
              {user?.email}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-gray-600 text-xs font-medium"
            >
              Member since {memberSince}
            </motion.p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {statItems.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 flex flex-col items-center gap-2 hover:bg-white/[0.07] transition-all duration-300 group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Taste DNA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-8"
        >
          <h2 className="text-base font-bold mb-4 flex items-center gap-2.5">
            <Clapperboard className="w-5 h-5 text-purple-400" />
            <span>Your Taste DNA</span>
          </h2>
          {sortedGenres.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sortedGenres.map((genre, i) => {
                const colors = [
                  'from-red-900/50 to-red-800/30 border-red-500/20 text-red-300',
                  'from-blue-900/50 to-blue-800/30 border-blue-500/20 text-blue-300',
                  'from-purple-900/50 to-purple-800/30 border-purple-500/20 text-purple-300',
                  'from-emerald-900/50 to-emerald-800/30 border-emerald-500/20 text-emerald-300',
                  'from-amber-900/50 to-amber-800/30 border-amber-500/20 text-amber-300',
                  'from-cyan-900/50 to-cyan-800/30 border-cyan-500/20 text-cyan-300',
                ];
                return (
                  <span
                    key={genre}
                    className={`px-4 py-2 rounded-xl bg-gradient-to-r ${colors[i % colors.length]} border text-sm font-semibold`}
                  >
                    {genre}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Watch more to build your taste profile ✨</p>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="space-y-3 mb-8"
        >
          {quickLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="w-full flex items-center gap-4 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-6 py-4 hover:bg-white/[0.08] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-gray-300 group-hover:text-white transition">
                {link.icon}
              </div>
              <span className="flex-1 text-left font-semibold text-gray-200 group-hover:text-white transition">{link.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </motion.div>

        {/* Sign Out */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 border border-red-500/15 hover:border-red-500/30 px-6 py-4 rounded-2xl transition-all duration-300 font-semibold"
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
};

export default Profile;
