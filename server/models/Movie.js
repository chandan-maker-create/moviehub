import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  poster: { type: String }, // URL or file path
  description: { type: String, required: true },
  trailer: { type: String }, // YouTube link
  downloadLink: { type: String },
  reviews: [reviewSchema],
  numReviews: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Movie', MovieSchema);
