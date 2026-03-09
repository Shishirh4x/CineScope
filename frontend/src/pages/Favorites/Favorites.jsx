// src/pages/Favorites/Favorites.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { clearFavorites } from '../../features/favorites/favoritesSlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import Footer from '../../components/Footer/Footer';
import '../Movies/Movies.css';
import './Favorites.css';

export default function Favorites() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const favorites = useSelector((s) => s.favorites.items);

  return (
    <div className="listing-page">
      <div className="listing-page__header listing-page__header--flex">
        <div>
          <h1 className="listing-page__title">❤️ Favorites</h1>
          <p className="listing-page__sub">{favorites.length} saved title{favorites.length !== 1 ? 's' : ''}</p>
        </div>
        {favorites.length > 0 && (
          <button className="btn-sm btn-danger" onClick={() => dispatch(clearFavorites())}>
            Clear All
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🎭</div>
          <p className="empty-state__text">No favorites yet</p>
          <p className="empty-state__sub">Start exploring and save movies you love</p>
          <button className="btn-primary" onClick={() => navigate('/movies')}>Browse Movies</button>
        </div>
      ) : (
        <motion.div 
          className="movie-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {favorites.map((item, index) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard item={item} type={item.media_type || 'movie'} showRemove={true} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
