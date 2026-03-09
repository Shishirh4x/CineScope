import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: 'No description available.',
    },
    poster: {
      type: String,
      default: null,
    },
    backdrop: {
      type: String,
      default: null,
    },
    releaseDate: {
      type: Date,
    },
    trailerUrl: {
      type: String,
      default: null,
    },
    genre: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['movie', 'tv', 'anime', 'documentary'],
      default: 'movie',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
