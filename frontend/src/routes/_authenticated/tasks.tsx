import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
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

export const Route = createFileRoute('/_authenticated/tasks')({
  component: Tasks,
})

async function getAllExpenses() {
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
    queryFn: getAllExpenses,
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
            <TableHead>Time</TableHead>
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
                  </TableRow>
                ))
            : data?.tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.time}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <pre></pre>
    </div>
  )
}
