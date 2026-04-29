import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWatchlist extends Document {
  userId: mongoose.Types.ObjectId;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
  addedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlist>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: Number, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true },
  title: { type: String, required: true },
  posterPath: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

WatchlistSchema.index({ userId: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

export const Watchlist: Model<IWatchlist> = mongoose.models.Watchlist || mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);