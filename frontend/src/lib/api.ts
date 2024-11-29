import { hc } from 'hono/client'
import { type ApiRoutes } from "../../../server/app" 
import { queryOptions } from '@tanstack/react-query'

const client = hc<ApiRoutes>('/')

export const api = client.api

async function getCurrentUser() {
    const res = await api.me.$get()
    if(!res.ok) {{
      throw new Error("server error")
    }}
    const data = await res.json()
    return data
  }

export const userQueryOptions = queryOptions({ queryKey: ['get-current-user'], queryFn: getCurrentUser, staleTime: Infinity });

export async function deleteTask({id}: {id: number}){
  const res = await api.tasks[":id{[0-9]+}"].$delete({param: {id: id.toString()}})
  if (!res.ok) {
    throw new Error("server error")
  }
}


export async function getAllTasks() {
  const res = await api.tasks.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}
export const getAllTasksQueryOptions = queryOptions({
  queryKey: ["get-all-tasks"],
  queryFn: getAllTasks,
  staleTime: 1000 * 60 * 5,
});