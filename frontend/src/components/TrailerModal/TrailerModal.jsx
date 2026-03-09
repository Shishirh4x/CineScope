// src/components/TrailerModal/TrailerModal.jsx
import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './TrailerModal.css';

export default function TrailerModal({ videoKey, title, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close trailer">
          <FiX size={18} />
        </button>

        <div className="modal__video-wrap">
          {videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
              title={title || 'Trailer'}
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="modal__no-trailer">
              <span className="modal__no-trailer-icon">🎞️</span>
              <p>Trailer for this movie is currently unavailable.</p>
            </div>
          )}
        </div>

        {title && (
          <div className="modal__footer">{title}</div>
        )}
      </div>
    </div>
  );
}
