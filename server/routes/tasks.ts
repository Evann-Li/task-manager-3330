import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { getUser } from "../kinde"

import { db } from "../db"
import { tasks as taskTable, insertTasksSchema } from "../db/schema/tasks"
import { eq, desc, sum, and } from "drizzle-orm"

import { createTaskSchema } from "../sharedTypes"


export const tasksRoute = new Hono()
.get("/", getUser, async (c) => {
    const user = c.var.user;

    const tasks = await db.select().from(taskTable).where(eq(taskTable.userId, user.id)).orderBy(desc(taskTable.createdAt)).limit(100)
;    return c.json({ tasks: tasks})
})
.post("/", getUser, zValidator("json", createTaskSchema), async (c) => {
    const task = await c.req.valid("json")
    const user = c.var.user
        
    const validatedTask = insertTasksSchema.parse({
        ...task,
        userId: user.id
    })

    const result = await db.insert(taskTable).values(validatedTask).returning()
    
    
    c.status(201)
    return c.json(result)
})
.get("total-time", getUser, async(c) => {
    var user = c.var.user
    const result = await db.select({total: sum(taskTable.time)}).from(taskTable).where(eq(taskTable.userId, user.id)).limit(1).then(res => res[0]);
    return c.json(result);
})
.get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user
    const task = await db.select().from(taskTable).where(and(eq(taskTable.userId, user.id), eq(taskTable.id, id))).then(res => res[0]);

    if (!task) {
        return c.notFound()
    }
    return c.json({task})
})
.delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user
    const task = await db.delete(taskTable).where(and(eq(taskTable.userId, user.id), eq(taskTable.id, id))).returning().then(res => res[0]);
    if (!task) {
        return c.notFound()
    }
    
    return c.json ({ task: task });
})
