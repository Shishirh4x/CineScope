import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
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
    movieSnapshot: {
      title: String,
      poster: String,
      rating: Number,
      year: String,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
    watchedTrailer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicates — upsert will update watchedAt instead
historySchema.index({ userId: 1, movieId: 1 }, { unique: true });

const History = mongoose.model('History', historySchema);
export default History;
