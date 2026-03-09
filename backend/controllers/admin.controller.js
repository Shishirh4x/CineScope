import Movie from '../models/movie.model.js';
import User from '../models/user.model.js';
import Favorite from '../models/favorite.model.js';
import History from '../models/history.model.js';
import asyncHandler from '../middleware/asyncHandler.js';

// ── Helpers ──────────────────────────────────────────────────

/** Escape RegExp special characters to prevent ReDoS */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ── MOVIE CRUD ───────────────────────────────────────────────

// GET /api/admin/movies
export const adminGetMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [movies, total] = await Promise.all([
    Movie.find().populate('createdBy', 'name email').sort('-createdAt').skip(skip).limit(limit),
    Movie.countDocuments(),
  ]);

  res.status(200).json({ success: true, total, page, totalPages: Math.ceil(total / limit), data: movies });
});

// POST /api/admin/movies
export const createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: movie });
});

// PUT /api/admin/movies/:id
export const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });

  res.status(200).json({ success: true, data: movie });
});

// DELETE /api/admin/movies/:id
export const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });

  res.status(200).json({ success: true, message: 'Movie deleted.' });
});

// ── USER MANAGEMENT ──────────────────────────────────────────

// GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search) {
    const safeSearch = escapeRegex(req.query.search);
    const re = new RegExp(safeSearch, 'i');
    filter.$or = [{ name: re }, { email: re }];
  }
  if (req.query.role) filter.role = req.query.role;

  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, total, page, totalPages: Math.ceil(total / limit), data: users });
});

// PUT /api/admin/ban/:userId — toggle ban
export const toggleBanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  if (String(user._id) === String(req.user._id)) {
    return res.status(400).json({ success: false, message: 'You cannot ban yourself.' });
  }

  user.isBanned = !user.isBanned;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully.`,
    isBanned: user.isBanned,
  });
});

// DELETE /api/admin/delete-user/:userId
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  if (String(user._id) === String(req.user._id)) {
    return res.status(400).json({ success: false, message: 'You cannot delete yourself.' });
  }

  // Clean up all user data
  await Promise.all([
    Favorite.deleteMany({ userId: user._id }),
    History.deleteMany({ userId: user._id }),
    user.deleteOne(),
  ]);

  res.status(200).json({ success: true, message: 'User and all their data deleted.' });
});

// ── DASHBOARD STATS ──────────────────────────────────────────

// GET /api/admin/stats
export const getStats = asyncHandler(async (req, res) => {
  const [totalMovies, totalUsers, totalFavorites, totalHistory] = await Promise.all([
    Movie.countDocuments(),
    User.countDocuments(),
    Favorite.countDocuments(),
    History.countDocuments(),
  ]);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
  const recentUsers = await User.find().sort('-createdAt').limit(5).select('name email role createdAt');

  res.status(200).json({
    success: true,
    data: { totalMovies, totalUsers, totalFavorites, totalHistory, newUsersLast30Days: newUsers, recentUsers },
  });
});
