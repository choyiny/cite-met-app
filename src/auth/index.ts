import { betterAuth } from "better-auth";
import { admin, anonymous } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { plans, schema } from "../db";
import Stripe from "stripe";
import { stripe } from "@better-auth/stripe";


// Single auth configuration that handles both CLI and runtime scenarios
function createAuth(
  env?: CloudflareBindings,
  cf?: IncomingRequestCfProperties,
) {
  // Use actual DB for runtime, empty object for CLI
  const db = env ? drizzle(env.DB, { schema, logger: true }) : ({} as any);

  const plugins: any[] = [
    anonymous(),
    admin(),
    passkey(),
  ]
  
  if (env) {
    plugins.push(
      stripe({
        stripeClient: new Stripe(env.STRIPE_SECRET_KEY!, {
          apiVersion: "2025-08-27.basil",
        }),
        stripeWebhookSecret: env?.STRIPE_WEBHOOK_SECRET!,
        createCustomerOnSignUp: true,
        subscription: {
          enabled: true,
          plans: async () => {
            const appPlans = await db.select().from(plans).all();
            return appPlans.map(p => ({
              id: p.id,
              name: p.name,
              priceId: p.stripePriceId,
              annualDiscountPriceId: p.annualDiscountStripePriceId,
              limits: JSON.parse(p.limits || '{}'),
              freeTrial: JSON.parse(p.freeTrial || '{}'),
            }));
          },
        }
      }),
    );
  }
  
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      usePlural: true,
      debugLogs: true,
    }),
    socialProviders: {
      github: { 
        clientId: env?.GITHUB_CLIENT_ID as string, 
        clientSecret: env?.GITHUB_CLIENT_SECRET as string, 
      }, 
    },
    plugins,
    rateLimit: {
      enabled: true,
    },
    advanced: {
      cookiePrefix: "authapp",
      ipAddress: {
        ipAddressHeaders: ['cf-connecting-ip']
      },
      defaultCookieAttributes: {
        sameSite: "None",
        secure: true,
      }
    },
    trustedOrigins: [
      "localhost",
      "https://2026a152-9b98-48ca-ae75-55eab2b47b98.sandbox.lovable.dev",
      "https://id-preview--2026a152-9b98-48ca-ae75-55eab2b47b98.lovable.app",
      "https://preview--cite-met-app-frontend.lovable.app",
    ]
  });
}

// Export for CLI schema generation
export const auth = createAuth();

// Export for runtime usage
export { createAuth };
