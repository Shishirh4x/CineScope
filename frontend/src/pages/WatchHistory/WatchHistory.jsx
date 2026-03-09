// src/pages/WatchHistory/WatchHistory.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearHistory } from '../../features/history/historySlice';
import MovieCard from '../../components/MovieCard/MovieCard';
import Footer from '../../components/Footer/Footer';
import '../Movies/Movies.css';
import '../Favorites/Favorites.css';

export default function WatchHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const history  = useSelector((s) => s.history.items);

  return (
    <div className="listing-page">
      <div className="listing-page__header listing-page__header--flex">
        <div>
          <h1 className="listing-page__title">🕒 Watch History</h1>
          <p className="listing-page__sub">{history.length} recently viewed</p>
        </div>
        {history.length > 0 && (
          <button className="btn-sm btn-danger" onClick={() => dispatch(clearHistory())}>
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📽️</div>
          <p className="empty-state__text">No watch history</p>
          <p className="empty-state__sub">Movies you visit will appear here</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Explore Now</button>
        </div>
      ) : (
        <div className="movie-grid">
          {history.map((item) => (
            <MovieCard key={item.id} item={item} type={item.media_type || 'movie'} />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
