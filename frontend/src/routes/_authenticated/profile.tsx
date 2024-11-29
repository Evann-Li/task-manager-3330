import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { userQueryOptions } from '@/lib/api'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
 

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions)

  if (isPending) return 'loading'
  if (error) return 'not logged in'

  return (
    <div className="p-2">
      <div className='flex items-center gap-2'>
      <Avatar>
        {data.user.picture && (<AvatarImage src="https://github.com/shadcn.png" alt={data.user.given_name} />)}
      
      <AvatarFallback>{data.user.given_name}</AvatarFallback>
    </Avatar>
      <p>Hello {data.user.given_name} {data.user.family_name}</p>
      </div>
      <Button asChild className='my-5'>
      <a href="/api/logout">Logout!</a>
      </Button>
    </div>
  )
}
