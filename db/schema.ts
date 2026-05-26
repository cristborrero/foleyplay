import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Table Users
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image'),
  password: text('password'),
  approved: integer('approved', { mode: 'boolean' }).notNull().default(false),
  role: text('role', { enum: ['user', 'admin', 'superadmin'] }).notNull().default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now') * 1000)`),
});

// Table Watchlist
export const watchlist = sqliteTable('watchlist', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tmdbId: integer('tmdb_id').notNull(),
  mediaType: text('media_type', { enum: ['movie', 'tv'] }).notNull(),
  title: text('title').notNull(),
  posterPath: text('poster_path').notNull(),
  addedAt: integer('added_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now') * 1000)`),
}, (table) => ({
  userTmdbMediaIdx: uniqueIndex('watchlist_user_tmdb_media_idx').on(table.userId, table.tmdbId, table.mediaType),
}));

// Table History
export const history = sqliteTable('history', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tmdbId: integer('tmdb_id').notNull(),
  mediaType: text('media_type', { enum: ['movie', 'tv'] }).notNull(),
  title: text('title').notNull(),
  posterPath: text('poster_path').notNull(),
  season: integer('season'),
  episode: integer('episode'),
  progress: integer('progress').notNull().default(0),
  watchedAt: integer('watched_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now') * 1000)`),
}, (table) => ({
  historyUserTmdbMediaIdx: uniqueIndex('history_user_tmdb_media_idx').on(table.userId, table.tmdbId, table.mediaType),
}));

// Table Ratings
export const ratings = sqliteTable('ratings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tmdbId: integer('tmdb_id').notNull(),
  mediaType: text('media_type', { enum: ['movie', 'tv'] }).notNull(),
  score: integer('score').notNull(),
  ratedAt: integer('rated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now') * 1000)`),
}, (table) => ({
  ratingsUserTmdbMediaIdx: uniqueIndex('ratings_user_tmdb_media_idx').on(table.userId, table.tmdbId, table.mediaType),
}));
