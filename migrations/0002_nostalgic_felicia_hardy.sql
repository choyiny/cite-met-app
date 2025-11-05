CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`stripe_price_id` text NOT NULL,
	`annual_discount_stripe_price_id` text,
	`limits` text DEFAULT '{}',
	`free_trial` text DEFAULT '{}',
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
