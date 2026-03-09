// src/pages/Register/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../features/auth/authSlice';
import '../Login/Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((s) => s.auth);

  const [form,   setForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (user) navigate('/'); }, [user]);
  useEffect(() => () => dispatch(clearError()), []);

  const validate = () => {
    const e = {};
    if (!form.name.trim())              e.name    = 'Name is required';
    if (!form.email.includes('@'))      e.email   = 'Enter a valid email';
    if (form.password.length < 6)       e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm  = "Passwords don't match";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
  };

  const fields = [
    { key: 'name',     type: 'text',     label: 'Full Name',        placeholder: 'John Doe'         },
    { key: 'email',    type: 'email',    label: 'Email Address',    placeholder: 'you@example.com'  },
    { key: 'password', type: 'password', label: 'Password',         placeholder: '••••••••'         },
    { key: 'confirm',  type: 'password', label: 'Confirm Password', placeholder: '••••••••'         },
  ];

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">CINESCOPE</div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Join millions of movie lovers</p>

        {error && <div className="auth-alert">{error}</div>}

        {fields.map(({ key, type, label, placeholder }) => (
          <div className="form-group" key={key}>
            <label className="form-label">{label}</label>
            <input
              className={`form-input ${errors[key] ? 'form-input--error' : ''}`}
              type={type} placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
            {errors[key] && <p className="form-error">{errors[key]}</p>}
          </div>
        ))}

        <button className="btn-full" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating…' : 'Create Account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
