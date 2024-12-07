import { integer, pgTable, serial, text, numeric, index, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from "zod";

export const tasks = pgTable('tasks', {
	id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    priority: text("priority").notNull(),
    time: numeric("time", {precision: 12, scale: 2}).notNull(),
    date: date("date").notNull(),
    createdAt: timestamp('created_at').defaultNow()
}, (tasks) => {
    return {
    userIdIndex: index('name_idx').on(tasks.userId)
    }
});

// Schema for inserting a user - can be used to validate API requests
export const insertTasksSchema = createInsertSchema(tasks, {
    title: z.string().min(3, {message: "Title must be at least 3 characters"}),
    description: z.string().min(5, {message: "Description must be at least 5 characters"}),
    time: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Time must be a positive number" }),});
// Schema for selecting a user - can be used to validate API responses
export const selectTasksSchema = createSelectSchema(tasks);