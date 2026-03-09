// src/components/SkeletonCard/SkeletonCard.jsx
import React from 'react';
import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-card__poster" />
      <div className="skeleton-card__info">
        <div className="skeleton skeleton-card__line skeleton-card__line--long"  />
        <div className="skeleton skeleton-card__line skeleton-card__line--short" />
      </div>
    </div>
  );
}
