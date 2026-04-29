import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRating extends Document {
  userId: mongoose.Types.ObjectId;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  score: number;
  ratedAt: Date;
}

const RatingSchema = new Schema<IRating>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: Number, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  ratedAt: { type: Date, default: Date.now },
});

RatingSchema.index({ userId: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

export const Rating: Model<IRating> = mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);