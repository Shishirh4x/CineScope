// src/layouts/AdminLayout/AdminLayout.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import './AdminLayout.css';

const NAV = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard',   path: '/admin' },
  { id: 'movies',    icon: '🎬', label: 'Movies',      path: '/admin/movies' },
  { id: 'add',       icon: '➕', label: 'Add Movie',   path: '/admin/add' },
  { id: 'users',     icon: '👥', label: 'Users',       path: '/admin/users' },
];

export default function AdminLayout({ children }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const user      = useSelector((s) => s.auth.user);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">🎬 CS Admin</div>

        {NAV.map((item) => (
          <button
            key={item.id}
            className={`admin-nav-item ${location.pathname === item.path ? 'admin-nav-item--active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}

        <div className="admin-sidebar__spacer" />

        <button className="admin-nav-item" onClick={() => navigate('/')}>
          <span>←</span> Back to Site
        </button>
        <button className="admin-nav-item admin-nav-item--danger" onClick={() => { dispatch(logout()); navigate('/login'); }}>
          <span>🚪</span> Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
