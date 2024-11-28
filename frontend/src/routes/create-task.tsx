import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm } from '@tanstack/react-form'
import { api } from '@/lib/api'

export const Route = createFileRoute('/create-task')({
  component: CreateTask,
})

function CreateTask() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      time: 0,
      description: ''
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      await new Promise(r => setTimeout(r, 3000))

     const res = await api.tasks.$post({json: value });
      if (!res.ok) {
        throw new Error("server error")
      }
      navigate({to: "/tasks"})
    },
  })

  return <div><h2>Create Task</h2>
  <form className='=" max-w-xl m-auto'
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
  <form.Field
              name="title"
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                  <Label htmlFor={field.name}>Title</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length ? (
                      <em>{field.state.meta.errors.join(", ")}</em>
                    ) : null}
                  </>
                )
              }}
            />
    <form.Field
              name="time"
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                  <Label htmlFor={field.name}>Time</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      type="number"
                      onChange={(e) => field.handleChange(+e.target.value)}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length ? (
                      <em>{field.state.meta.errors.join(", ")}</em>
                    ) : null}
                  </>
                )
              }}
            />
             <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button className="mt-4" type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </Button>
            )}
          />
    </form>
  </div>
}
