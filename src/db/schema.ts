import * as authSchema from "./auth.schema"; // This will be generated in a later step
import * as paymentSchema from "./payment.schema"; // This will be generated in a later step

// Combine all schemas here for migrations
export const schema = {
  ...authSchema,
  ...paymentSchema,
  // ... your other application schemas
} as const;
