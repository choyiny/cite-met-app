import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  plan: text('plan').notNull(),
  referenceId: text('reference_id').notNull(), // User ID or org ID
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: text('status').notNull(), // active, canceled, etc.
  periodStart: integer("period_start", { mode: "timestamp" }),
  periodEnd: integer("period_end", { mode: "timestamp" }),
  cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: "boolean" }),
  seats: integer('seats'),
  trialStart: integer("trial_start", { mode: "timestamp" }),
  trialEnd: integer("trial_end", { mode: "timestamp" }),
})

export const plans = sqliteTable('plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  stripePriceId: text('stripe_price_id').notNull(),
  annualDiscountStripePriceId: text('annual_discount_stripe_price_id'),
  limits: text('limits').$defaultFn(() => '{}').notNull(), // JSON string
  freeTrial: text('free_trial').$defaultFn(() => '{}').notNull(), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});