import Favorite from '../models/favorite.model.js';
import asyncHandler from '../middleware/asyncHandler.js';

// GET /api/favorites
export const getFavorites = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [favorites, total] = await Promise.all([
    Favorite.find({ userId: req.user._id }).sort('-createdAt').skip(skip).limit(limit),
    Favorite.countDocuments({ userId: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: favorites,
  });
});

// POST /api/favorites/add
// Body: { movieId, movieSnapshot? }
export const addFavorite = asyncHandler(async (req, res) => {
  const { movieId, movieSnapshot } = req.body;

  if (!movieId) {
    return res.status(400).json({ success: false, message: 'movieId is required.' });
  }

  // upsert = true means it creates if not found, updates if found
  const favorite = await Favorite.findOneAndUpdate(
    { userId: req.user._id, movieId },
    { userId: req.user._id, movieId, movieSnapshot },
    { upsert: true, new: true }
  );

  res.status(201).json({ success: true, message: 'Added to favorites.', data: favorite });
});

// DELETE /api/favorites/remove/:movieId
export const removeFavorite = asyncHandler(async (req, res) => {
  const deleted = await Favorite.findOneAndDelete({
    userId: req.user._id,
    movieId: req.params.movieId,
  });

  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Favorite not found.' });
  }

  res.status(200).json({ success: true, message: 'Removed from favorites.' });
});

// GET /api/favorites/check/:movieId
export const checkFavorite = asyncHandler(async (req, res) => {
  const exists = await Favorite.exists({
    userId: req.user._id,
    movieId: req.params.movieId,
  });
  res.status(200).json({ success: true, isFavorite: !!exists });
});
