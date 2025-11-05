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


/**
 * This function returns a middleware to check if the request body
 * contains the required params. If not, return a 422 with the missing param.
 */
export const requireBodyParams = (params: string[]) => {
  function present(obj: object, keys: string) {
    const keyList = keys.split("."); // Split the keys string by dot (.) separator
    let currentObj = obj;
    for (let i = 0; i < keyList.length; i++) {
      const key = keyList[i];
      if (currentObj.hasOwnProperty(key)) {
        currentObj = currentObj[key];
      } else {
        return false;
      }
    }
    return true;
  }

  return async (c, next) => {
    const requestBody = await c.req.json();
    for (const param of params) {
      if (!present(requestBody, param)) {
        return c.json({ error: `Missing required param: ${param}` }, 422);
      }
    }
    return await next();
  };
};