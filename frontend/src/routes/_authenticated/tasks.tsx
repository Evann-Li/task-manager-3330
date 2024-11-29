import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { api, deleteTask, getAllTasksQueryOptions } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { toast } from "sonner";

export const Route = createFileRoute('/_authenticated/tasks')({
  component: Tasks,
})

async function getAllTasks() {
  const res = await api.tasks.$get()
  if (!res.ok) {
    {
      throw new Error('server error')
    }
  }
  const data = await res.json()
  return data
}

function Tasks() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-tasks'],
    queryFn: getAllTasks,
  })

  if (error) return 'An error has occured: ' + error.message

  return (
    <div className="p-2 max-w-3xl m-auto">
      <Table>
        <TableCaption>A list of your Tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                ))
            : data?.tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.time}</TableCell>
                  <TableCell>{task.date}</TableCell>
                  <TableCell>
                    <TaskDeleteButton id={task.id}/>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <pre></pre>
    </div>
  )
}

function TaskDeleteButton({id}: {id: number}){
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteTask,
    onError: () => {
      toast("Error", {
        description: `Failed to delete task: ${id}`,
      });
    },
    onSuccess: () => {
      toast("Task Deleted", {
        description: `Successfully deleted task: ${id}`,
      });

      queryClient.setQueryData(
        getAllTasksQueryOptions.queryKey,
        (existingTasks) => ({
          ...existingTasks,
          tasks: existingTasks!.tasks.filter((e) => e.id !== id),
        })
      );
    },
  })

  return (
    <Button disabled={mutation.isPending} onClick={() => mutation.mutate({ id })} variant="outline" size="icon">
        {mutation.isPending ? "...": 
        <Trash />}
    </Button>
  );
}