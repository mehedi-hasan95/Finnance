import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import {
  accounts,
  categories,
  insertTransactionsSchema,
  transactions,
} from "@/db/schema";
import { Hono } from "hono";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { parse, subDays } from "date-fns";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorize User" }, 401);
      }
      const { from, to, accountId } = c.req.valid("query");
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);
      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultFrom;

      const data = await db
        .select({
          id: transactions.id,
          category: categories.name,
          categoryId: transactions.categorId,
          payee: transactions.payee,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accounId,
          date: transactions.date,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accounId, accounts.id))
        .leftJoin(categories, eq(transactions.categorId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accounId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
    }
  )
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
        .select({
          id: transactions.id,
          categoryId: transactions.categorId,
          payee: transactions.payee,
          notes: transactions.notes,
          accountId: transactions.accounId,
          date: transactions.date,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accounId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)));
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionsSchema.omit({ id: true })),
    async (c) => {
      const values = c.req.valid("json");
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorize User" }, 401);
      }

      const [data] = await db
        .insert(transactions)
        .values({
          ...values,
        })
        .returning();
      return c.json({ data });
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator("json", z.array(insertTransactionsSchema.omit({ id: true }))),
    async (c) => {
      const values = c.req.valid("json");
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorize User" }, 401);
      }
      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            ...value,
          }))
        )
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

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accounId, accounts.id))
          .where(
            and(
              inArray(transactions.id, values.ids),
              eq(accounts.userId, auth.userId)
            )
          )
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )
        .returning({ id: transactions.id });
      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertTransactionsSchema.omit({ id: true })),
    async (c) => {
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorize User" }, 401);
      }
      if (!id) {
        return c.json({ error: "Id not found" }, 400);
      }

      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accounId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      );
      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToUpdate})`
          )
        )
        .returning();
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
      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accounId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      );
      const [data] = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )
        .returning({ id: transactions.id });
      if (!data) {
        return c.json({ error: "Data not found" }, 404);
      }
      return c.json({ data });
    }
  );

export default app;
