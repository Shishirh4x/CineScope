import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import errorHandler from './middleware/error.middleware.js';

import authRoutes     from './routes/auth.routes.js';
import movieRoutes    from './routes/movie.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import historyRoutes  from './routes/history.routes.js';
import adminRoutes    from './routes/admin.routes.js';

// Connect to MongoDB
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Security ───────────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: "https://cine-scope-git-main-shishirs-projects-d48ead95.vercel.app",
  credentials: true,
}));

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  message: { success: false, message: 'Too many requests. Try again later.' },
});
app.use('/api', limiter);

// ── Parsing ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging ─────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🎬 CineScope API is running', env: process.env.NODE_ENV });
});

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/movies',    movieRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history',   historyRoutes);
app.use('/api/admin',     adminRoutes);

// ── 404 & Static Files ──────────────────────────────────────────
const buildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, message: `API Route not found: ${req.method} ${req.originalUrl}` });
  }
  res.sendFile(path.join(buildPath, 'index.html'));
});

// ── Global Error Handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
