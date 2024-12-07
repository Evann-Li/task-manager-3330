import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { api } from "@/lib/api";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Flag } from "lucide-react";

import { createTaskSchema } from "@server/sharedTypes";

export const Route = createFileRoute("/_authenticated/create-task")({
  component: CreateTask,
});

function PriorityDropdown({ field }) {
  const priorities = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            {field.state.value || "Select Priority"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {priorities.map((priority) => (
              <DropdownMenuItem
                key={priority.value}
                onClick={() => field.handleChange(priority.value)}
                className="hover:bg-gray-700"
              >
                <Flag className="mr-2 h-4 w-4" />
                <span>{priority.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className="text-red-500">{field.state.meta.errors.join(", ")}</em>
      ) : null}
    </div>
  );
}

function CreateTask() {
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      time: "0",
      description: "",
      priority: "",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const res = await api.tasks.$post({ json: value });
      if (!res.ok) {
        throw new Error("server error");
      }
      navigate({ to: "/tasks" });
    },
  });

  return (
    <div className="p-2">
      <h2>Create Task</h2>
      <form
        className="flex flex-col gap-y-4 max-w-xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          validators={{
            onChange: createTaskSchema.shape.title,
          }}
          children={(field) => (
            <div>
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
            </div>
          )}
        />
        <form.Field
          name="description"
          validators={{
            onChange: createTaskSchema.shape.description,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Description</Label>
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
            </div>
          )}
        />
        <form.Field
          name="time"
          validators={{
            onChange: createTaskSchema.shape.time,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Time (Hours)</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                type="number"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </div>
          )}
        />
        <form.Field
          name="priority"
          validators={{
            onChange: createTaskSchema.shape.priority,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Priority</Label>
              <PriorityDropdown field={field} />
            </div>
          )}
        />
        <form.Field
          name="date"
          validators={{
            onChange: createTaskSchema.shape.date,
          }}
          children={(field) => (
            <div className="self-center">
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) =>
                  field.handleChange((date ?? new Date()).toISOString())
                }
                className="rounded-md border"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </div>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
