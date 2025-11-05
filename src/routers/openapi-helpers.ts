import { z } from "zod";


export const requestBody = (schema: z.ZodType) => ({
  request: {
    body: {
      content: {
        "application/json": {
          schema,
        },
      },
    },
  },
});

export const json200Response = (schema: z.ZodType, description: string) => ({
  200: {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  },
});


export const json401Response = {
  401: {
    content: {
      "application/json": {
        schema: z.object({
          error: z.string(),
        }),
      },
    },
    description: "Unauthorized",
  },
};

export const json400Response = {
  400: {
    content: {
      "application/json": {
        schema: z.object({
          error: z.string(),
        }),
      },
    },
    description: "Invalid Request",
  },
};

export const json500Response = {
  500: {
    content: {
      "application/json": {
        schema: z.object({
          error: z.string(),
        }),
      },
    },
    description: "Internal Error",
  },
};


/**
 * This function returns a middleware to check if the request body
 * contains the required params. If not, return a 422 with the missing param.
 */
export const requireBodyParams = (params: string[]) => {
  function present(obj: Record<string, any>, keys: string) {
    const keyList = keys.split(".");
    let currentObj: any = obj;
    for (const key of keyList) {
      if (currentObj && Object.prototype.hasOwnProperty.call(currentObj, key)) {
        currentObj = currentObj[key];
      } else {
        return false;
      }
    }
    return true;
  }

  return async (c: any, next: () => Promise<void>) => {
    const requestBody = await c.req.json();
    for (const param of params) {
      if (!present(requestBody, param)) {
        return c.json({ error: `Missing required param: ${param}` }, 422);
      }
    }
    return await next();
  };
};