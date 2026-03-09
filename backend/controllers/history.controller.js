import History from '../models/history.model.js';
import asyncHandler from '../middleware/asyncHandler.js';

// GET /api/history
export const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    History.find({ userId: req.user._id }).sort('-watchedAt').skip(skip).limit(limit),
    History.countDocuments({ userId: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: history,
  });
});

// POST /api/history/add
// Body: { movieId, movieSnapshot?, watchedTrailer? }
// Uses upsert so revisiting a movie just updates watchedAt
export const addHistory = asyncHandler(async (req, res) => {
  const { movieId, movieSnapshot, watchedTrailer = false } = req.body;

  if (!movieId) {
    return res.status(400).json({ success: false, message: 'movieId is required.' });
  }

  const record = await History.findOneAndUpdate(
    { userId: req.user._id, movieId },
    { userId: req.user._id, movieId, movieSnapshot, watchedAt: new Date(), watchedTrailer },
    { upsert: true, new: true }
  );

  res.status(200).json({ success: true, message: 'History updated.', data: record });
});

// DELETE /api/history/:movieId  — remove single item
export const removeHistory = asyncHandler(async (req, res) => {
  const deleted = await History.findOneAndDelete({
    userId: req.user._id,
    movieId: req.params.movieId,
  });

  if (!deleted) {
    return res.status(404).json({ success: false, message: 'History record not found.' });
  }

  res.status(200).json({ success: true, message: 'History item removed.' });
});

// DELETE /api/history  — clear all history
export const clearHistory = asyncHandler(async (req, res) => {
  await History.deleteMany({ userId: req.user._id });
  res.status(200).json({ success: true, message: 'Watch history cleared.' });
});
