
import { insertTasksSchema } from "./db/schema/tasks"

export const createTaskSchema = insertTasksSchema.omit({
    userId: true,
    createdAt: true
})

