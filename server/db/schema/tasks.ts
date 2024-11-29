import { integer, pgTable, serial, text, numeric, index, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable('tasks', {
	id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    time: numeric("time", {precision: 12, scale: 2}).notNull(),
    createdAt: timestamp('created_at').defaultNow()
}, (tasks) => {
    return {
    userIdIndex: index('name_idx').on(tasks.userId)
    }
});

