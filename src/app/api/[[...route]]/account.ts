import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { accounts, insertUserSchema } from "@/db/schema";
import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

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
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorize User" }, 401);
      }
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing Id" }, 404);
      }
      const [data] = await db
        .select({ id: accounts.id, name: accounts.name })
        .from(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
      return c.json({ data });
    }
  )
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
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const values = c.req.valid("json");
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorize User" }, 401);
      }

      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )
        )
        .returning({ id: accounts.id });
      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertUserSchema.pick({ name: true })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { name } = c.req.valid("json");
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorize User" }, 401);
      }
      if (!id) {
        return c.json({ error: "Id not found" }, 400);
      }
      const [data] = await db
        .update(accounts)
        .set({ name })
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning();
      if (!data) {
        return c.json({ error: "Data not found" }, 400);
      }
      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorize User" }, 401);
      }
      if (!id) {
        return c.json({ error: "Id not found" }, 400);
      }
      const [data] = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning({ id: accounts.id });
      if (!data) {
        return c.json({ error: "Data not found" }, 400);
      }
      return c.json({ data });
    }
  );

export default app;
