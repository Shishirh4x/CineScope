// src/components/GenreFilter/GenreFilter.jsx
import React from 'react';
import './GenreFilter.css';

export default function GenreFilter({ genres = [], selected, onChange }) {
  return (
    <div className="genre-filter">
      <button
        className={`genre-btn ${selected === null ? 'genre-btn--active' : ''}`}
        onClick={() => onChange(null)}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          className={`genre-btn ${selected === g.id ? 'genre-btn--active' : ''}`}
          onClick={() => onChange(g.id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
