import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    // Snapshot so we don't need a second DB call to render the favorites page
    movieSnapshot: {
      title: String,
      poster: String,
      rating: Number,
      year: String,
    },
  },
  { timestamps: true }
);

// Prevent duplicate favorites
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
