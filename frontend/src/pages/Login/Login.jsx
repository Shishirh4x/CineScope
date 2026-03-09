// src/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../features/auth/authSlice';
import './Auth.css';

export default function Login() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { loading, error, user } = useSelector((s) => s.auth);

  const [form,   setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) navigate(user.isAdmin ? '/admin' : '/');
  }, [user]);

  useEffect(() => () => dispatch(clearError()), []);

  const validate = () => {
    const e = {};
    if (!form.email.includes('@'))   e.email    = 'Enter a valid email';
    if (form.password.length < 6)    e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    dispatch(loginUser(form));
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">CINESCOPE</div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to continue your cinematic journey</p>

        {error && <div className="auth-alert">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className={`form-input ${errors.email ? 'form-input--error' : ''}`}
            type="email" placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            onKeyDown={handleKey}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className={`form-input ${errors.password ? 'form-input--error' : ''}`}
            type="password" placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            onKeyDown={handleKey}
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>

        <button className="btn-full" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}
