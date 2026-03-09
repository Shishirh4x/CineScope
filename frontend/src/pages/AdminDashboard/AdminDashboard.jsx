// src/pages/AdminDashboard/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminMovies, fetchAdminUsers, fetchAdminStats,
  addMovieThunk, deleteMovieThunk, toggleBanUserThunk, deleteUserThunk,
} from '../../features/admin/adminSlice';
import { GENRES_MOVIE } from '../../utils/constants';
import './AdminDashboard.css';

// ── Stats Dashboard ─────────────────────────────────────────
function Dashboard() {
  const { stats, movies } = useSelector((s) => s.admin);
  const STATS = [
    { label: 'Total Movies',    value: (stats.totalMovies || 0).toLocaleString(),    icon: '🎬' },
    { label: 'Total Users',     value: (stats.totalUsers || 0).toLocaleString(),     icon: '👥' },
    { label: 'Total Favorites', value: (stats.totalFavorites || 0).toLocaleString(), icon: '❤️' },
    { label: 'New (30 days)',   value: (stats.newUsersLast30Days || 0).toLocaleString(), icon: '📈' },
  ];
  return (
    <div>
      <h1 className="admin-title">Dashboard</h1>
      <div className="stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card__icon">{s.icon}</div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__label">{s.label}</div>

          </div>
        ))}
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-header"><span className="admin-table-title">Recent Movies</span></div>
        <table className="data-table">
          <thead><tr><th>Title</th><th>Year</th><th>Rating</th></tr></thead>
          <tbody>
            {movies.slice(0,6).map((m) => (
              <tr key={m._id || m.id}>
                <td style={{ fontWeight: 600 }}>{m.title}</td>
                <td style={{ color: 'var(--text2)' }}>{(m.release_date||'').slice(0,4)}</td>
                <td style={{ color: 'var(--accent)', fontWeight: 700 }}>★ {m.vote_average}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Movies Table ────────────────────────────────────────────
function MoviesTable() {
  const dispatch = useDispatch();
  const movies   = useSelector((s) => s.admin.movies);
  return (
    <div>
      <h1 className="admin-title">Movies</h1>
      <div className="admin-table-wrap">
        <table className="data-table">
          <thead><tr><th>Title</th><th>Year</th><th>Rating</th><th>Actions</th></tr></thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m._id || m.id}>
                <td style={{ fontWeight: 600 }}>{m.title}</td>
                <td style={{ color: 'var(--text2)' }}>{(m.release_date||'').slice(0,4)}</td>
                <td style={{ color: 'var(--accent)', fontWeight: 700 }}>★ {m.vote_average}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-sm btn-edit" disabled>Edit</button>
                    <button className="btn-sm btn-del" onClick={() => dispatch(deleteMovieThunk(m._id || m.id))}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Add Movie Form ──────────────────────────────────────────
function AddMovieForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', poster: '', description: '', releaseDate: '',
    tmdbId: '', trailer: '', genre: '', category: 'movie',
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    dispatch(addMovieThunk({
      title: form.title, overview: form.description,
      release_date: form.releaseDate, poster_path: form.poster || null,
      vote_average: 0, genre_ids: form.genre ? [parseInt(form.genre)] : [],
    }));
    navigate('/admin/movies');
  };

  return (
    <div>
      <h1 className="admin-title">Add Movie</h1>
      <div className="admin-form-card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Movie Title *</label>
            <input className="form-input" placeholder="Enter title…" value={form.title} onChange={set('title')} />
          </div>
          <div className="form-group">
            <label className="form-label">TMDB ID</label>
            <input className="form-input" placeholder="e.g. 550" value={form.tmdbId} onChange={set('tmdbId')} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input form-textarea" placeholder="Movie overview…" value={form.description} onChange={set('description')} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Poster URL</label>
            <input className="form-input" placeholder="https://…" value={form.poster} onChange={set('poster')} />
          </div>
          <div className="form-group">
            <label className="form-label">Trailer YouTube Link</label>
            <input className="form-input" placeholder="YouTube URL or video ID" value={form.trailer} onChange={set('trailer')} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Release Date</label>
            <input className="form-input" type="date" value={form.releaseDate} onChange={set('releaseDate')} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={set('category')}>
              <option value="movie">Movie</option>
              <option value="tv">TV Show</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Genre</label>
          <select className="form-input" value={form.genre} onChange={set('genre')}>
            <option value="">Select genre…</option>
            {GENRES_MOVIE.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSubmit}>Add Movie</button>
          <button className="btn-secondary" onClick={() => navigate('/admin/movies')}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Users Table ─────────────────────────────────────────────
function UsersTable() {
  const dispatch = useDispatch();
  const users    = useSelector((s) => s.admin.users);
  return (
    <div>
      <h1 className="admin-title">Users</h1>
      <div className="admin-table-wrap">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id || u.id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td style={{ color: 'var(--text2)' }}>{u.email}</td>
                <td><span className="plan-badge">{u.role}</span></td>
                <td><span className={`status-badge ${!u.isBanned ? 'status-active' : 'status-banned'}`}>{u.isBanned ? 'banned' : 'active'}</span></td>
                <td>
                  <div className="table-actions">
                    <button className="btn-sm btn-ban" onClick={() => dispatch(toggleBanUserThunk(u._id || u.id))}>
                      {u.isBanned ? 'Unban' : 'Ban'}
                    </button>
                    <button className="btn-sm btn-del" onClick={() => dispatch(deleteUserThunk(u._id || u.id))}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Root: init data and route to sub-views ──────────────────
export default function AdminDashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAdminMovies());
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="movies" element={<MoviesTable />} />
      <Route path="add" element={<AddMovieForm />} />
      <Route path="users" element={<UsersTable />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
