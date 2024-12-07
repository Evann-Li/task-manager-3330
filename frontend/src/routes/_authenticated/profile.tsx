import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { userQueryOptions, getAllTasksQueryOptions } from '@/lib/api'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})

function Profile() {
  const { isPending: isUserPending, error: userError, data: userData } = useQuery(userQueryOptions)
  const { isPending: isTasksPending, error: tasksError, data: tasksData } = useQuery(getAllTasksQueryOptions)

  if (isUserPending || isTasksPending) return 'loading'
  if (userError || tasksError) return 'error loading data'

  return (
    <div className="p-2">
      <div className='flex flex-col items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Avatar>
            {userData.user.picture && (
              <AvatarImage src="https://github.com/shadcn.png" alt={userData.user.given_name} />
            )}
            <AvatarFallback>{userData.user.given_name}</AvatarFallback>
          </Avatar>
          <p className="text-lg">Hello {userData.user.given_name} {userData.user.family_name}</p>
        </div>
        <p className="mt-2 text-white-600">Total Tasks Left: {tasksData.tasks.length}</p>
        <Button asChild className='my-5'>
          <a href="/api/logout">Logout!</a>
        </Button>
      </div>
    </div>
  )
}
