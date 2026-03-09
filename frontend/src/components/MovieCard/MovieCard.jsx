// src/components/MovieCard/MovieCard.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiPlay, FiX } from 'react-icons/fi';
import { addFavoriteThunk, removeFavoriteThunk } from '../../features/favorites/favoritesSlice';
import { addHistoryThunk } from '../../features/history/historySlice';
import { showNotification } from '../../features/notification/notificationSlice';
import { getPosterUrl, getTitle, getYear, formatRating, getMediaType } from '../../utils/helpers';
import './MovieCard.css';

export default function MovieCard({ item, type, showRemove = false }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const isFav     = useSelector((s) => s.favorites.items.some((f) => String(f.id) === String(item.id)));
  const mediaType = type || getMediaType(item);

  const poster = getPosterUrl(item.poster_path);
  const title  = getTitle(item);
  const year   = getYear(item);

  const handleClick = () => {
    dispatch(addHistoryThunk({ ...item, media_type: mediaType }));
    navigate(`/details/${mediaType}/${item.id}`);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    if (isFav) {
      dispatch(removeFavoriteThunk(String(item.id)));
    } else {
      dispatch(addFavoriteThunk({ ...item, media_type: mediaType }));
      dispatch(showNotification({ message: `"${title}" added to favorites`, type: 'success' }));
    }
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-card__img-wrap">
        <img
          className="movie-card__img"
          src={poster}
          alt={title}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1a1e2a/525c70?text=🎬'; }}
        />
        <span className="movie-card__rating">★ {formatRating(item.vote_average)}</span>

        {/* Hover overlay */}
        <div className="movie-card__overlay">
          <p className="movie-card__overlay-title">{title}</p>
          <div className="movie-card__overlay-actions">
            <button className="movie-card__btn movie-card__btn--play" onClick={handleClick}>
              <FiPlay size={12} /> Play
            </button>
            {showRemove ? (
              <button className="movie-card__btn movie-card__btn--remove" onClick={handleFav}>
                <FiX size={12} />
              </button>
            ) : (
              <button
                className={`movie-card__btn movie-card__btn--fav ${isFav ? 'movie-card__btn--fav-active' : ''}`}
                onClick={handleFav}
              >
                <FiHeart size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="movie-card__info">
        <p className="movie-card__title">{title}</p>
        <p className="movie-card__year">{year}</p>
      </div>
    </div>
  );
}
