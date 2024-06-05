import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./account";
import categories from "./categories";
import transactions from "./transactions";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions);

// export default app;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export type AppType = typeof routes;
