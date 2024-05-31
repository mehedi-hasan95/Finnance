import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { accounts, insertUserSchema } from "@/db/schema";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ error: "Unauthorize User" }, 401);
    }
    const data = await db
      .select({ id: accounts.id, name: accounts.name })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));
    return c.json({ data });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertUserSchema.pick({ name: true })),
    async (c) => {
      const { name } = c.req.valid("json");
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorize User" }, 401);
      }

      const [data] = await db
        .insert(accounts)
        .values({
          // id: createId(),
          name,
          userId: auth.userId,
        })
        .returning();
      return c.json({ data });
    }
  );

export default app;