import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { schema } from "./schema";

export type DrizzleDB = DrizzleD1Database<typeof schema>;

export async function injectDb(c, next) {
  const db = drizzle(c.env.DB, { logger: true });
  c.set("db", db);
  return await next();
}