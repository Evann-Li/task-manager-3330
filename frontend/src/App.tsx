import { useEffect, useState } from 'react'
import './App.css'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { api } from "@/lib/api"

function App() {
  const [totalTime, setTotalTime] = useState(0)

  useEffect(() => {
    async function fetchTotal() {
      const res = await api.tasks["total-time"].$get()
      const data = await res.json()
      setTotalTime(data.total)
    }
    fetchTotal()
  }, [])

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Time</CardTitle>
        <CardDescription>Total Time Spent</CardDescription>
      </CardHeader>
      <CardContent>{totalTime}</CardContent>
    </Card>
  )
}

export default App
