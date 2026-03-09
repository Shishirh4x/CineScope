// src/pages/MovieDetails/MovieDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlay, FiHeart, FiArrowLeft, FiStar, FiClock, FiCalendar } from 'react-icons/fi';
import { addFavoriteThunk, removeFavoriteThunk } from '../../features/favorites/favoritesSlice';
import { addHistoryThunk }   from '../../features/history/historySlice';
import tmdbAPI from '../../api/tmdb';
import Loader from '../../components/Loader/Loader';
import MovieCarousel from '../../components/MovieCarousel/MovieCarousel';
import Footer from '../../components/Footer/Footer';
import {
  getTitle, getYear, formatRating, formatRuntime, formatDate,
  getPosterUrl, getBackdropUrl, getProfileUrl, getYouTubeTrailer, truncate,
} from '../../utils/helpers';
import './MovieDetails.css';

// ── PersonCard (also used in Home) ─────────────────────────
export function PersonCard({ person }) {
  return (
    <div className="person-card">
      <img
        className="person-card__img"
        src={getProfileUrl(person.profile_path)}
        alt={person.name}
        loading="lazy"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200/1a1e2a/525c70?text=👤'; }}
      />
      <p className="person-card__name">{person.name}</p>
      <p className="person-card__role">{person.character || person.known_for_department || 'Actor'}</p>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────
export default function MovieDetails() {
  const { type, id }    = useParams();
  const navigate        = useNavigate();
  const dispatch        = useDispatch();
  const { setTrailer }  = useOutletContext() || {};

  const isFav = useSelector((s) => s.favorites.items.some((f) => String(f.id) === String(id)));

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    tmdbAPI.getDetails(type || 'movie', id)
      .then((data) => {
        setDetails(data);
        dispatch(addHistoryThunk({ ...data, media_type: type || 'movie' }));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [type, id]);

  if (loading)  return <div style={{ paddingTop: 64 }}><Loader /></div>;
  if (error || !details) return (
    <div className="details-error">
      <p>Could not load details. Please try again.</p>
      <button className="btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  const title     = getTitle(details);
  const trailer   = getYouTubeTrailer(details.videos);
  const cast      = details.credits?.cast?.slice(0, 12) || [];
  const similar   = (details.similar?.results || details.recommendations?.results || []).slice(0, 12);
  const backdrop  = getBackdropUrl(details.backdrop_path);
  const poster    = getPosterUrl(details.poster_path);

  const handlePlayTrailer = () => {
    setTrailer?.({ key: trailer?.key || null, title });
  };

  const handleToggleFav = () => {
    if (isFav) {
      dispatch(removeFavoriteThunk(String(id)));
    } else {
      dispatch(addFavoriteThunk({ ...details, media_type: type || 'movie' }));
    }
  };

  return (
    <div className="details-page">
      {/* Hero */}
      <div className="details-hero">
        <div className="details-hero__bg" style={{ backgroundImage: `url(${backdrop})` }} />
        <div className="details-hero__gradient" />

        <button className="details-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className="details-hero__content">
          {/* Poster */}
          <div className="details-poster">
            <img
              src={poster} alt={title}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1a1e2a/525c70?text=🎬'; }}
            />
          </div>

          {/* Info */}
          <div className="details-info">
            <div className="details-genres">
              {(details.genres || []).map((g) => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>

            <h1 className="details-title">{title}</h1>

            <div className="details-meta">
              <span className="details-rating"><FiStar /> {formatRating(details.vote_average)}</span>
              <span><FiCalendar size={13} /> {formatDate(details.release_date || details.first_air_date)}</span>
              {details.runtime && <span><FiClock size={13} /> {formatRuntime(details.runtime)}</span>}
              {details.number_of_seasons && <span>📺 {details.number_of_seasons} Seasons</span>}
            </div>

            <p className="details-overview">
              {details.overview || 'Description not available.'}
            </p>

            <div className="details-actions">
              <button className="btn-primary" onClick={handlePlayTrailer}>
                <FiPlay /> Watch Trailer
              </button>
              <button className={`btn-fav ${isFav ? 'btn-fav--active' : ''}`} onClick={handleToggleFav}>
                <FiHeart /> {isFav ? 'In Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <div className="details-section">
          <h2 className="details-section__title">Cast</h2>
          <div className="details-cast">
            {cast.map((member) => <PersonCard key={member.credit_id || member.id} person={member} />)}
          </div>
        </div>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <MovieCarousel
          title="You May Also Like"
          items={similar}
          type={type || 'movie'}
        />
      )}

      <Footer />
    </div>
  );
}
