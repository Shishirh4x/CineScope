// src/components/Loader/Loader.jsx
import React from 'react';
import './Loader.css';

export default function Loader({ fullPage = true }) {
  return (
    <div className={`loader ${fullPage ? 'loader--full' : ''}`}>
      <div className="loader__ring" />
      <span className="loader__text">Loading…</span>
    </div>
  );
}
