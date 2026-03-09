import Movie from '../models/movie.model.js';
import asyncHandler from '../middleware/asyncHandler.js';

// GET /api/movies — list all with search + pagination
export const getMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.genre) filter.genre = { $in: [req.query.genre] };
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const sort = req.query.sort || '-createdAt';

  const [movies, total] = await Promise.all([
    Movie.find(filter).sort(sort).skip(skip).limit(limit),
    Movie.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    results: movies.length,
    data: movies,
  });
});

// GET /api/movies/trending
export const getTrending = asyncHandler(async (req, res) => {
  const movies = await Movie.find().sort('-popularity -rating').limit(20);
  res.status(200).json({ success: true, results: movies.length, data: movies });
});

// GET /api/movies/popular
export const getPopular = asyncHandler(async (req, res) => {
  const movies = await Movie.find().sort('-rating').limit(20);
  res.status(200).json({ success: true, results: movies.length, data: movies });
});

// GET /api/movies/featured
export const getFeatured = asyncHandler(async (req, res) => {
  const movies = await Movie.find({ isFeatured: true }).limit(10);
  res.status(200).json({ success: true, results: movies.length, data: movies });
});

// GET /api/movies/:id
export const getMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({ success: false, message: 'Movie not found.' });
  }
  res.status(200).json({ success: true, data: movie });
});
