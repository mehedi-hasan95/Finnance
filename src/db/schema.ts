import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const accounts = pgTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});
export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertUserSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);

export const transactions = pgTable("transactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accounId: text("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),
  categorId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  accounts: one(accounts, {
    fields: [transactions.accounId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categorId],
    references: [categories.id],
  }),
}));

export const insertTransactionsSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});
