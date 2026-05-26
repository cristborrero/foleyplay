CREATE TABLE `history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tmdb_id` integer NOT NULL,
	`media_type` text NOT NULL,
	`title` text NOT NULL,
	`poster_path` text NOT NULL,
	`season` integer,
	`episode` integer,
	`progress` integer DEFAULT 0 NOT NULL,
	`watched_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `history_user_tmdb_media_idx` ON `history` (`user_id`,`tmdb_id`,`media_type`);--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tmdb_id` integer NOT NULL,
	`media_type` text NOT NULL,
	`score` integer NOT NULL,
	`rated_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ratings_user_tmdb_media_idx` ON `ratings` (`user_id`,`tmdb_id`,`media_type`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image` text,
	`password` text,
	`approved` integer DEFAULT false NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `watchlist` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tmdb_id` integer NOT NULL,
	`media_type` text NOT NULL,
	`title` text NOT NULL,
	`poster_path` text NOT NULL,
	`added_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `watchlist_user_tmdb_media_idx` ON `watchlist` (`user_id`,`tmdb_id`,`media_type`);