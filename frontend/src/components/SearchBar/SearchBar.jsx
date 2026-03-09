// src/components/SearchBar/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import useDebounce from '../../hooks/useDebounce';
import tmdbAPI from '../../api/tmdb';
import { getPosterUrl, getTitle, getYear, getMediaType } from '../../utils/helpers';
import './SearchBar.css';

export default function SearchBar({ onClose }) {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef  = useRef(null);
  const navigate  = useNavigate();
  const debounced = useDebounce(query, 350);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!debounced.trim()) { setResults([]); return; }
    setLoading(true);
    tmdbAPI.searchMulti(debounced).then((data) => {
      setResults((data?.results || []).slice(0, 8));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [debounced]);

  const handleSelect = (item) => {
    const type = getMediaType(item);
    navigate(`/details/${type}/${item.id}`);
    onClose();
  };

  const TYPE_LABELS = { movie: 'Movie', tv: 'TV', person: 'Person' };
  const TYPE_CLASSES = { movie: 'badge--movie', tv: 'badge--tv', person: 'badge--person' };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        {/* Input */}
        <div className="search-input-wrap">
          <FiSearch className="search-icon-left" size={20} />
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search movies, TV shows, actors…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                onClose();
              }
            }}
          />
          <button className="search-close" onClick={onClose} aria-label="Close search">
            <FiX size={16} />
          </button>
        </div>

        {/* Results dropdown */}
        {(results.length > 0 || loading) && (
          <div className="search-results">
            {loading && (
              <div className="search-results__loading">Searching…</div>
            )}
            {results.map((item) => {
              const type  = getMediaType(item);
              const thumb = item.poster_path || item.profile_path;
              return (
                <div key={item.id} className="search-result" onClick={() => handleSelect(item)}>
                  <div className="search-result__thumb">
                    {thumb
                      ? <img src={getPosterUrl(thumb, 'sm')} alt={getTitle(item)} />
                      : <span>{type === 'person' ? '👤' : '🎬'}</span>
                    }
                  </div>
                  <div className="search-result__info">
                    <p className="search-result__title">{getTitle(item)}</p>
                    <p className="search-result__meta">
                      {getYear(item)}{item.known_for_department ? ` · ${item.known_for_department}` : ''}
                    </p>
                  </div>
                  <span className={`type-badge ${TYPE_CLASSES[type] || ''}`}>
                    {TYPE_LABELS[type] || type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
