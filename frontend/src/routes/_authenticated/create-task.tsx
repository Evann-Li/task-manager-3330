import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import { api } from '@/lib/api'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { Calendar } from "@/components/ui/calendar"

import { createTaskSchema } from '@server/sharedTypes'

export const Route = createFileRoute('/_authenticated/create-task')({
  component: CreateTask,
})

function CreateTask() {
  const navigate = useNavigate()
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: '',
      time: "0",
      description: '',
      date: new Date().toISOString()
    },
    onSubmit: async ({ value }) => {
      // Do something with form data

      const res = await api.tasks.$post({ json: value })
      if (!res.ok) {
        throw new Error('server error')
      }
      navigate({ to: '/tasks' })
    },
  })

  return (
    <div className='p-2'>
      <h2>Create Task</h2>
      <form
        className='flex flex-col gap-y-4 max-w-xl m-auto'
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="title"
          validators={{
            onChange: createTaskSchema.shape.title, 
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div>
                <Label htmlFor={field.name}>Title</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em>{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )
          }}
        />
        <form.Field
          name="description"
          validators={{
            onChange: createTaskSchema.shape.description
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div>
                <Label htmlFor={field.name}>Description</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em>{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )
          }}
        />
        <form.Field
          name="time"
          validators={{
            onChange: createTaskSchema.shape.time
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div>
                <Label htmlFor={field.name}>Time(Hours)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  type="number"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em>{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )
          }}
        />
        <form.Field
          name="date"
          validators={{
            onChange: createTaskSchema.shape.date
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div className='self-center'>
                <Calendar
                    mode="single"
                    selected={new Date(field.state.value)}
                    onSelect={(date) => field.handleChange(
                      (date ?? new Date()).toISOString())}
                    className="rounded-md border"
                  />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em>{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
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
  )
}
