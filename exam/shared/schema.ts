import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Payment schemas
export const createPaymentOrderSchema = z.object({
  amount: z.number().positive(),
  order_id: z.string().min(1),
  package_name: z.string(),
  semester: z.string(),
  branch: z.string(),
});

export const checkPaymentStatusSchema = z.object({
  order_id: z.string().min(1),
});

export type CreatePaymentOrder = z.infer<typeof createPaymentOrderSchema>;
export type CheckPaymentStatus = z.infer<typeof checkPaymentStatusSchema>;

// ZapUPI API response types
export type ZapUPIOrderResponse = {
  status: 'success' | 'error';
  message: string;
  payment_url?: string;
  order_id?: string;
};

export type ZapUPIStatusResponse = {
  status: 'success' | 'error';
  message?: string;
  data?: {
    custumer_mobile: string;
    utr: string;
    remark: string;
    txn_id: string;
    create_at: string;
    order_id: string;
    status: string;
    amount: string;
  };
};
