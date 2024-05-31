import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { createId } from "@paralleldrive/cuid2";

export const accounts = pgTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const insertUserSchema = createInsertSchema(accounts);
