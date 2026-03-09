// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { logout } from '../../features/auth/authSlice';
import { NAV_LINKS } from '../../utils/constants';
import './Navbar.css';

export default function Navbar({ onSearchOpen, theme, onThemeToggle }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const user      = useSelector((s) => s.auth.user);
  const favCount  = useSelector((s) => s.favorites.items.length);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Close profile dropdown on click outside
  useEffect(() => {
    if (!profileOpen) return;
    const hide = () => setProfileOpen(false);
    window.addEventListener('click', hide);
    return () => window.removeEventListener('click', hide);
  }, [profileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isHome = location.pathname === '/';

  return (
    <>
      <nav className={`navbar ${scrolled || !isHome ? 'navbar--scrolled' : 'navbar--transparent'}`}>
        {/* Logo */}
        <span className="navbar__logo" onClick={() => navigate('/')}>CINESCOPE</span>

        {/* Links — desktop only */}
        <ul className="navbar__links">
          {NAV_LINKS.map((l) => (
            <li key={l.path}>
              <Link
                to={l.path}
                className={`navbar__link ${location.pathname === l.path ? 'navbar__link--active' : ''}`}
              >
                {l.label}
                {l.path === '/favorites' && favCount > 0 && <span className="navbar__dot"></span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="navbar__right">
          <button className="icon-btn" onClick={onSearchOpen} aria-label="Search">
            <FiSearch />
          </button>
          <button className="icon-btn" onClick={onThemeToggle} aria-label="Toggle theme">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          
          {user ? (
            <div className="navbar__profile-container" onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}>
              <div className="navbar__avatar" title="Account menu">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              
              {profileOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-name">{user.name}</p>
                    <p className="navbar__dropdown-email">{user.email}</p>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  {user.isAdmin && (
                    <Link to="/admin" className="navbar__dropdown-item">
                      Admin Dashboard
                    </Link>
                  )}
                  <button className="navbar__dropdown-item navbar__dropdown-item--logout" onClick={() => dispatch(logout())}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-primary btn-primary--sm navbar__signin-btn" onClick={() => navigate('/login')}>
              Sign In
            </button>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="icon-btn navbar__hamburger"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'mobile-overlay--visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <aside className={`mobile-drawer ${mobileOpen ? 'mobile-drawer--open' : ''}`}>
        <ul className="mobile-drawer__links">
          {NAV_LINKS.map((l) => (
            <li key={l.path}>
              <Link
                to={l.path}
                className={`mobile-drawer__link ${location.pathname === l.path ? 'mobile-drawer__link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
                {l.path === '/favorites' && favCount > 0 && <span className="navbar__dot"></span>}
              </Link>
            </li>
          ))}
          {user?.isAdmin && (
            <li>
              <Link
                to="/admin"
                className={`mobile-drawer__link ${location.pathname.startsWith('/admin') ? 'mobile-drawer__link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile auth section */}
        <div className="mobile-drawer__footer">
          {user ? (
            <button
              className="mobile-drawer__logout"
              onClick={() => { dispatch(logout()); setMobileOpen(false); }}
            >
              Sign Out
            </button>
          ) : (
            <button
              className="btn-primary mobile-drawer__signin"
              onClick={() => { navigate('/login'); setMobileOpen(false); }}
            >
              Sign In
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
