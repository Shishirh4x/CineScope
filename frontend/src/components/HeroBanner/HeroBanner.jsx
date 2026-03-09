// src/components/HeroBanner/HeroBanner.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiInfo, FiStar } from 'react-icons/fi';
import { getBackdropUrl, getTitle, getYear, formatRating, truncate } from '../../utils/helpers';
import { GENRES_MOVIE } from '../../utils/constants';
import './HeroBanner.css';

export default function HeroBanner({ movies = [], onPlayTrailer }) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const items = movies.slice(0, 6);

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return <div className="hero hero--empty" />;

  const movie  = items[current];
  const backdrop = getBackdropUrl(movie.backdrop_path);
  const title    = getTitle(movie);
  const year     = getYear(movie);
  const genres   = (movie.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRES_MOVIE.find((g) => g.id === id)?.name)
    .filter(Boolean);

  return (
    <section className="hero">
      {/* Background */}
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${backdrop})` }}
        key={current}
      />
      <div className="hero__gradient" />

      {/* Content */}
      <div className="hero__content" key={`content-${current}`}>
        <span className="hero__badge">🔥 Trending Now</span>

        <h1 className="hero__title">{title}</h1>

        <div className="hero__meta">
          <span className="hero__rating">
            <FiStar /> {formatRating(movie.vote_average)}
          </span>
          <span>{year}</span>
          {genres.map((g) => <span key={g}>{g}</span>)}
        </div>

        <p className="hero__desc">{truncate(movie.overview, 180)}</p>

        <div className="hero__actions">
          <button
            className="btn-primary"
            onClick={() => onPlayTrailer?.(movie)}
          >
            <FiPlay /> Watch Trailer
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate(`/details/${movie.media_type || 'movie'}/${movie.id}`)}
          >
            <FiInfo /> Details
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="hero__dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
