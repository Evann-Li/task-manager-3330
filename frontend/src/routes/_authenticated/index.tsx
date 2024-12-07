import { createFileRoute } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

async function getTotalTime() {
  const res = await api.tasks['total-time'].$get()
  if (!res.ok) {
    {
      throw new Error('server error')
    }
  }
  const data = await res.json()
  return data
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-total-time'],
    queryFn: getTotalTime,
  })

  if (error) return 'An error has occured: ' + error.message

  // const totalTime = use(api.tasks["total-time"].$get())
  // const [totalTime, setTotalTime] = useState(0)

  // useEffect(() => {
  //   async function fetchTotal() {
  //     const res = await api.tasks["total-time"].$get()
  //     const data = await res.json()
  //     setTotalTime(data.total)
  //   }
  //   fetchTotal()
  // }, [])

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Time</CardTitle>
        <CardDescription>Total Time Left On Tasks</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? '...' : data.total} Hours</CardContent>
    </Card>
  )
}
