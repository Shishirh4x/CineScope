// src/pages/SearchResults/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieCard from '../../components/MovieCard/MovieCard';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';
import Footer from '../../components/Footer/Footer';
import tmdbAPI from '../../api/tmdb';
import { getMediaType } from '../../utils/helpers';
import '../Movies/Movies.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    tmdbAPI.searchMulti(query)
      .then((d) => setResults((d?.results || []).filter((r) => r.media_type !== 'person')))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="listing-page">
      <div className="listing-page__header">
        <h1 className="listing-page__title">🔍 Search Results</h1>
        <p className="listing-page__sub">
          {loading ? 'Searching…' : `${results.length} results for "${query}"`}
        </p>
      </div>

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
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : results.map((item, index) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.3 }}
              >
                <MovieCard item={item} type={getMediaType(item)} />
              </motion.div>
            ))
        }
      </motion.div>

      {!loading && results.length === 0 && (
        <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text2)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎭</div>
          <p style={{ fontSize: 18, fontWeight: 600 }}>No results found</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Try a different search term</p>
        </div>
      )}

      <Footer />
    </div>
  );
}
