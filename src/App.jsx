import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import MyList from './pages/MyList';
import Category from './pages/Category';
import MovieDetail from './pages/MovieDetail';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-14 w-14 animate-spin rounded-full border-t-4 border-[#E50914]" />
      </div>
    );
  }

  return (
    <div className="relative">
      <ScrollToTop />
      {user && <Navbar user={user} />}
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
        <Route path="/my-list" element={user ? <MyList /> : <Navigate to="/login" />} />
        <Route path="/category/:type" element={user ? <Category /> : <Navigate to="/login" />} />
        <Route path="/title/:type/:id" element={user ? <MovieDetail /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      </Routes>
      {user && <Footer />}
    </div>
  );
}

export default App;
