PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`description` text,
	`stripe_price_id` text NOT NULL,
	`annual_discount_stripe_price_id` text,
	`limits` text NOT NULL,
	`free_trial` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_plans`("id", "name", "price", "description", "stripe_price_id", "annual_discount_stripe_price_id", "limits", "free_trial", "created_at", "updated_at") SELECT "id", "name", "price", "description", "stripe_price_id", "annual_discount_stripe_price_id", "limits", "free_trial", "created_at", "updated_at" FROM `plans`;--> statement-breakpoint
DROP TABLE `plans`;--> statement-breakpoint
ALTER TABLE `__new_plans` RENAME TO `plans`;--> statement-breakpoint
PRAGMA foreign_keys=ON;