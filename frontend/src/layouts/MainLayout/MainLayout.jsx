// src/layouts/MainLayout/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../../features/favorites/favoritesSlice';
import { fetchHistory } from '../../features/history/historySlice';
import Navbar from '../../components/Navbar/Navbar';
import SearchBar from '../../components/SearchBar/SearchBar';
import TrailerModal from '../../components/TrailerModal/TrailerModal';

export default function MainLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  
  const [showSearch, setShowSearch] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('cs_theme') || 'dark');
  const [trailer, setTrailer] = useState(null); // { key, title }

  // Apply theme class to <html>
  useEffect(() => {
    document.documentElement.className = theme === 'light' ? 'light' : '';
    localStorage.setItem('cs_theme', theme);
  }, [theme]);

  // Fetch defaults on login/mount
  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
      dispatch(fetchHistory());
    }
  }, [user, dispatch]);

  const handleThemeToggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Allow child pages to trigger the trailer modal via a custom event
  useEffect(() => {
    const handler = (e) => setTrailer(e.detail);
    window.addEventListener('cs:play-trailer', handler);
    return () => window.removeEventListener('cs:play-trailer', handler);
  }, []);

  return (
    <>
      <Navbar
        onSearchOpen={() => setShowSearch(true)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet context={{ setTrailer }} />
          </motion.div>
        </AnimatePresence>
      </main>

      {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}

      {trailer && (
        <TrailerModal
          videoKey={trailer.key}
          title={trailer.title}
          onClose={() => setTrailer(null)}
        />
      )}
    </>
  );
}
