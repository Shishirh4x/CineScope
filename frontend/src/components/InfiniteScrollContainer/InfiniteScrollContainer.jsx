// src/components/InfiniteScrollContainer/InfiniteScrollContainer.jsx
import React, { useEffect, useRef } from 'react';
import Loader from '../Loader/Loader';

/**
 * Wraps children and triggers onLoadMore when the sentinel
 * div scrolls into view.
 */
export default function InfiniteScrollContainer({ children, onLoadMore, hasMore, loading }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <>
      {children}
      {loading && <Loader fullPage={false} />}
      {hasMore && <div ref={sentinelRef} style={{ height: 60 }} />}
    </>
  );
}
