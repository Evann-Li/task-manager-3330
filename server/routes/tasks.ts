import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

import { getUser } from "../kinde"


const taskSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string(),
    description: z.string(),
    time: z.number().int().min(1)
})

type Task = z.infer<typeof taskSchema>

const createPostSchema = taskSchema.omit({id: true})

const fakeTasks : Task[] = [
    { id: 1, title: "Groceries", description: "Buy Groceries", time: 1},
    { id: 2, title: "Sports", description: "Hockey", time: 2}
]

export const tasksRoute = new Hono()
.get("/", getUser, async (c) => {
    const user = c.var.user
    return c.json({ tasks: fakeTasks})
})
.post("/", getUser, zValidator("json", createPostSchema), async (c) => {
    const task = await c.req.valid("json")
    
    fakeTasks.push({...task, id: fakeTasks.length+1})
    c.status(201)
    return c.json(task)
})
.get("total-time", getUser, (c) => {
    const total = fakeTasks.reduce((acc, task) => acc + task.time, 0);
    return c.json({total});
})
.get("/:id{[0-9]+}", getUser, (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const task = fakeTasks.find(task => task.id === id)
    if (!task) {
        return c.notFound()
    }
    return c.json({task})
})
.delete("/:id{[0-9]+}", getUser, (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeTasks.findIndex(task => task.id === id)
    if (index === -1) {
        return c.notFound()
    }
    const deletedTask = fakeTasks.splice(index, 1)[0];
    return c.json ({ task: deletedTask });
})
