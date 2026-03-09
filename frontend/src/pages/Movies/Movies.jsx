// src/pages/Movies/Movies.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../../components/MovieCard/MovieCard';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';
import GenreFilter from '../../components/GenreFilter/GenreFilter';
import InfiniteScrollContainer from '../../components/InfiniteScrollContainer/InfiniteScrollContainer';
import Footer from '../../components/Footer/Footer';
import tmdbAPI from '../../api/tmdb';
import { GENRES_MOVIE } from '../../utils/constants';
import './Movies.css';

export default function Movies() {
  const [items,   setItems]   = useState([]);
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [genre,   setGenre]   = useState(null);

  const loadMore = useCallback(async (pg, genreId) => {
    setLoading(true);
    try {
      const data = genreId
        ? await tmdbAPI.discoverByGenre('movie', genreId, pg)
        : await tmdbAPI.getPopularMovies(pg);
      setItems((prev) => pg === 1 ? (data.results || []) : [...prev, ...(data.results || [])]);
      setTotal(data.total_pages || 1);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset on genre change
  useEffect(() => {
    setItems([]); setPage(1); setTotal(1);
    loadMore(1, genre);
  }, [genre]);

  // Load next page
  useEffect(() => {
    if (page > 1) loadMore(page, genre);
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && page < total) setPage((p) => p + 1);
  };

  return (
    <div className="listing-page">
      <div className="listing-page__header">
        <h1 className="listing-page__title">🎬 Movies</h1>
        <p className="listing-page__sub">Discover the best movies from around the world</p>
      </div>

      <GenreFilter genres={GENRES_MOVIE} selected={genre} onChange={setGenre} />

      <InfiniteScrollContainer onLoadMore={handleLoadMore} hasMore={page < total} loading={loading}>
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
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard item={item} type="movie" />
            </motion.div>
          ))}
          {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </motion.div>
      </InfiniteScrollContainer>

      <Footer />
    </div>
  );
}
