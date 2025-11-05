ALTER TABLE `sessions` ADD `impersonated_by` text;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `timezone`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `region`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `region_code`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `colo`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `latitude`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `longitude`;--> statement-breakpoint
ALTER TABLE `users` ADD `role` text;--> statement-breakpoint
ALTER TABLE `users` ADD `banned` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `users` ADD `ban_expires` integer;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `stripe_customer_id`;