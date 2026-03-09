// src/components/MovieCarousel/MovieCarousel.jsx
import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MovieCard from '../MovieCard/MovieCard';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import './MovieCarousel.css';

export default function MovieCarousel({ title, items, loading, type = 'movie', renderItem }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 620, behavior: 'smooth' });
  };

  return (
    <section className="carousel-section">
      <div className="carousel-section__header">
        <h2 className="carousel-section__title">{title}</h2>
      </div>
      <div className="carousel-section__wrap">
        <button className="carousel-arrow carousel-arrow--left"  onClick={() => scroll(-1)} aria-label="Scroll left">
          <FiChevronLeft size={20} />
        </button>
        <div className="carousel" ref={ref}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : (items || []).map((item) =>
                renderItem
                  ? renderItem(item)
                  : <MovieCard key={item.id} item={item} type={type} />
              )
          }
        </div>
        <button className="carousel-arrow carousel-arrow--right" onClick={() => scroll(1)} aria-label="Scroll right">
          <FiChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
