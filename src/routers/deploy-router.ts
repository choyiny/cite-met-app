import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { json200Response, json400Response, json401Response } from "./openapi-helpers";
import { Variables } from "../variables";
import { getSandbox } from "@cloudflare/sandbox";

// Input schema for deployment request (allow optional PAT before github.com e.g. https://TOKEN@github.com/owner/repo)
const DeployRequestSchema = z.object({
  repoUrl: z.string().url().refine(
    (u) => /^(https:\/\/(?:[^@\n\/]+@)?github\.com\/[^\s/]+\/[^\s/]+)(\.git)?$/.test(u),
    "Must be a valid GitHub repository URL (optionally with PAT before host)"
  ),
});

// Output schema
const DeployResponseSchema = z.object({
  sandboxId: z.string(),
  repo: z.object({ url: z.string() }),
  steps: z.array(z.object({ name: z.string(), status: z.enum(["ok", "error"]) })),
  exposed: z.object({ port: z.number(), exposedAt: z.string() }).optional(),
  error: z.string().optional(),
});

export const deployRoutes = new OpenAPIHono<{
  Bindings: CloudflareBindings;
  Variables: Variables;
}>();

deployRoutes.use("*", async (c, next) => {
  const user = c.get("user");
  // if (!user) {
  //   return c.json({ error: "Unauthorized" }, 401);
  // }
  await next();
});

const postDeploy = createRoute({
  method: "post",
  path: "/",
  tags: ["Deploy"],
  description:
    "Deploy a public GitHub repository into a Cloudflare Sandbox and expose its dev server.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: DeployRequestSchema,
        },
      },
    },
  },
  responses: {
    ...json200Response(DeployResponseSchema, "Deployment result"),
    ...json400Response,
    ...json401Response,
  },
});

deployRoutes.openapi(postDeploy, async (c): Promise<any> => {
  const body = await c.req.json();
  const parse = DeployRequestSchema.safeParse(body);
  if (!parse.success) {
    const msg = parse.error.issues.map((iss) => iss.message).join("; ");
    return c.json({ error: msg }, 400);
  }
  const { repoUrl } = parse.data;

  // Parse possible credential (PAT) provided before host
  const parsed = new URL(repoUrl);
  const credential = parsed.username || ""; // PAT or username
  const pathParts = parsed.pathname.replace(/^\//, "").split("/");
  const owner = pathParts[0];
  const repoNameRaw = pathParts[1];
  const repoName = repoNameRaw.replace(/\.git$/, "");
  const sanitizedRepoUrl = `https://github.com/${owner}/${repoName}`;

  // Derive sandbox id
  // const sandboxId = `${owner}-${repoName}`;
  const sandbox = getSandbox(c.env.Sandbox, owner);
  let exposed = {};
  try {
    const cloneUrl = credential
      ? `https://${credential}@github.com/${owner}/${repoName}.git`
      : `https://github.com/${owner}/${repoName}.git`;
    await sandbox.exec(`rm -rf /app/workspace/repo`);
    await sandbox.gitCheckout(cloneUrl, { targetDir: "/app/workspace/repo" });
    const session = await sandbox.createSession();
    console.log("Cloned repo");
    const installCommand = await session.exec(`cd /app/workspace/repo && npm install --legacy-peer-deps`);
    console.log(installCommand.stdout);
    console.log(installCommand.stderr);
    const buildCommand = await session.exec(`npm run build`);
    console.log(buildCommand.stdout);
    console.log(buildCommand.stderr);
    await session.startProcess(`python -m http.server 8000 --bind 0.0.0.0`, { cwd: `/app/workspace/repo/dist` });
    console.log("Started dev server");
    const ports = await sandbox.getExposedPorts("cite-met.com");
    if (!ports.some(p => p.port === 8000)) {
      exposed = await sandbox.exposePort(8000, { hostname: `cite-met.com` });
    }
  } catch (_) {
    await sandbox.destroy();
    return c.json({ repo: { url: sanitizedRepoUrl }, error: "Failed to deploy repository." });
  }

  return c.json({ repo: { url: sanitizedRepoUrl }, exposed });
});
