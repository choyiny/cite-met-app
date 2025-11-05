import { DrizzleD1Database } from "drizzle-orm/d1";
import { createAuth } from "./auth";

export type Variables = {
  auth: ReturnType<typeof createAuth>;
  user?: any;
  db: DrizzleD1Database<any>;
};
