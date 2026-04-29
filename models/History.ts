import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
  season?: number;
  episode?: number;
  watchedAt: Date;
  progress: number;
}

const HistorySchema = new Schema<IHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: Number, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true },
  title: { type: String, required: true },
  posterPath: { type: String, required: true },
  season: { type: Number },
  episode: { type: Number },
  watchedAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0, min: 0, max: 100 },
});

// A user should ideally have one history record per title, which updates its watchedAt and progress.
HistorySchema.index({ userId: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

export const History: Model<IHistory> = mongoose.models.History || mongoose.model<IHistory>('History', HistorySchema);