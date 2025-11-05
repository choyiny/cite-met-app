import { z, createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { plans } from "../db/payment.schema";
import { json200Response, json400Response, json401Response } from "./openapi-helpers";
import { Variables } from "../variables";
import Stripe from "stripe";

const PlanSchema = z.object({
	id: z.string(),
	name: z.string(),
	price: z.number().min(0),
	limits: z.object({
		credits: z.number().min(0),
	}),
	freeTrial: z.object(),
});

export const planRoutes = new OpenAPIHono<{ Bindings: CloudflareBindings, Variables: Variables }>();
planRoutes.use("*", async (c, next) => {
  // middleware to ensure user is authenticated
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

const getPlans = createRoute({
	method: "get",
	path: "/",
	tags: ["Plans"],
	description: "Get all plans in the database.",
	responses: {
		...json200Response(z.array(PlanSchema), "List of plans"),
		...json401Response,
		...json400Response,
	},
});

planRoutes.openapi(getPlans, async (c) => {
  const stripeClient = new Stripe(c.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
  });
  const allPlans = await c.get("db").select().from(plans);
  const planOutput = await Promise.all(allPlans.map(async plan => {
    const stripePrice = await stripeClient.prices.retrieve(plan.stripePriceId);
    return {
      id: plan.id,
      name: plan.name,
      price: stripePrice.unit_amount ?? 0,
      limits: JSON.parse(plan.limits),
      freeTrial: JSON.parse(plan.freeTrial),
    }
  }));
  return c.json(planOutput, 200);
});
