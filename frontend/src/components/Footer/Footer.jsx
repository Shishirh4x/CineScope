// src/components/Footer/Footer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const COL2 = [
  { label: 'Home',      path: '/'         },
  { label: 'Movies',    path: '/movies'   },
  { label: 'TV Shows',  path: '/tv'       },
  { label: 'Favorites', path: '/favorites'},
  { label: 'History',   path: '/history'  },
];
const COL3 = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller'];
const COL4 = ['About Us', 'Careers', 'Press', 'Blog', 'Help Center'];

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <div className="footer__logo">CINESCOPE</div>
          <p className="footer__desc">
            Your ultimate destination for discovering movies, TV shows, and more.
            Stream, explore, and bookmark your favourites.
          </p>
        </div>
        <div>
          <p className="footer__col-title">Navigate</p>
          {COL2.map((l) => (
            <span key={l.path} className="footer__link" onClick={() => navigate(l.path)}>{l.label}</span>
          ))}
        </div>
        <div>
          <p className="footer__col-title">Genres</p>
          {COL3.map((g) => <span key={g} className="footer__link">{g}</span>)}
        </div>
        <div>
          <p className="footer__col-title">Company</p>
          {COL4.map((l) => <span key={l} className="footer__link">{l}</span>)}
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} CineScope. Powered by TMDB API.</span>
        <div className="footer__socials">
          {['𝕏', 'f', 'in', '▶'].map((s) => (
            <button key={s} className="footer__social-btn">{s}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}
