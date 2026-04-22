import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Sparkles, Zap, Shield, Mail } from 'lucide-react';
import { loginWithGoogle } from '../services/firebase';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
      console.error('Login failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#050505] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/93da5c27-be66-427c-8b72-5cb39d275279/web/IN-en-20241021-TRIFECTA-perspective_9e4437b7-fd3d-4a48-aebf-5e87c5e3f06a_large.jpg')] bg-cover bg-center opacity-20 filter blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505] pointer-events-none" />
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#E50914]/20 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 py-6 md:px-12 flex justify-between items-center">
        <span className="dflix-logo text-4xl md:text-5xl">DFLIX</span>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8 text-center pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm text-gray-300 font-medium mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-[#E50914]" />
            <span>Next-Generation Streaming</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-2">
            Limitless Entertainment.
            <br className="hidden md:block" /> Reimagined.
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
            A premium, lag-free streaming experience powered by AI recommendations. Built to redefine how you discover and watch.
          </p>

          <div className="pt-8">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-black" />
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 mt-4 text-sm">
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 px-4 text-left"
        >
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-[#E50914]/20 flex items-center justify-center mb-4">
              <Zap className="text-[#E50914]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Built with an ultra-modern local cache architecture to instantly load your movies and history with zero UI lag.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-[#E50914]/20 flex items-center justify-center mb-4">
              <Sparkles className="text-[#E50914]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart AI Match</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Our custom recommendation engine analyzes your taste profile and ratings to find exactly what you'll love next.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-[#E50914]/20 flex items-center justify-center mb-4">
              <Shield className="text-[#E50914]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Your data is yours. Authentication powered securely by Google, keeping your profile and history totally private.</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-lg mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Built by</span>
            <span className="text-white font-semibold tracking-wide">Dipendra Thapa</span>
          </div>
          
          <a 
            href="mailto:dipendrat055@gmail.com" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
          >
            <Mail size={16} />
            dipendrat055@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
