import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { sentry } from "@hono/sentry";
import { swaggerUI } from '@hono/swagger-ui';
import { createAuth } from "./auth";
import { OpenAPIHono } from "@hono/zod-openapi";
import { injectDb } from "./db/middleware";
import { planRoutes } from "./routers/plan-router";
import { deployRoutes } from "./routers/deploy-router";
import { Variables } from "./variables";
import { request } from "http";
import { proxyToSandbox } from "@cloudflare/sandbox";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings; Variables: Variables }>();
app.use("*", sentry());
app.use("*", injectDb);
app.use("*", logger());

// CORS configuration for auth routes
app.use(
  "*",
  cors({
    origin: [
      "https://2026a152-9b98-48ca-ae75-55eab2b47b98.sandbox.lovable.dev",
      "https://id-preview--2026a152-9b98-48ca-ae75-55eab2b47b98.lovable.app",
      "https://preview--cite-met-app-frontend.lovable.app",
      "*"
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Middleware to initialize auth and user instance for each request
app.use("*", async (c, next) => {
  const auth = createAuth(c.env, (c.req.raw as any).cf || {});
  c.set("auth", auth);

  // Set user instance if available
  const session = await auth.api.getSession({
    headers: c.req.raw.headers
  });
  if (session?.user) {
    c.set("user", session.user);
  }

  await next();
});

// Handle all auth routes
app.all("/api/auth/*", async (c) => {
  const auth = c.get("auth");
  return auth.handler(c.req.raw);
});

app.route("/api/plans/", planRoutes);
app.route("/api/deploy/", deployRoutes);

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'CiteMET API',
    description: 'API for the CiteMET platform',
  },
})
app.get('/swagger-ui', swaggerUI({ url: '/doc' }))

app.get("*", async (c) => {
  if (c.req.path.startsWith("/api/auth/")) {
    const auth = c.get("auth");
    return auth.handler(c.req.raw);
  } else {
    const asset = await c.env.ASSETS.fetch(c.req.raw);
    console.log(c.req.url)
    if (asset.status === 404) {
      return c.env.ASSETS.fetch(
        new Request(c.req.url.replace(/\/+[^\/]*$/, "/index.html"), c.req)
      );
    }
  }
});

export default {
  fetch: async (request, env, ctx) => {
    // Handle preview URL routing first
    const proxyResponse = await proxyToSandbox(request, env);
    if (proxyResponse) return proxyResponse;
    return app.fetch(request, env, ctx);
  },
};

export { Sandbox } from '@cloudflare/sandbox';