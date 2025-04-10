"use client"

import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "@/src/schema/events";
import Link from "next/link";
import { createEvent, deleteEvent, updateEvent } from "@/src/server/actions/events";
import { useState, useTransition } from "react";
import { DeleteModal } from "./DeleteModal";

export function EventForm({ event }: { event?: {
  id: string,
  name: string,
  description?: string,
  durationInMinutes: number,
  isActive: boolean,
}}) {
  // Structure Form using RHF
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema) as Resolver<z.infer<typeof eventFormSchema>>,
    defaultValues: event ?? {
      isActive: true,
      durationInMinutes: 30,
    }
  });  

  const [ isPending, startTransition ] = useTransition();
  const [open, setOpen] = useState(false);

  // Handle Form Submission
  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    // Insert / Update the database
    const action = event == null ? createEvent : updateEvent.bind(null, event.id);
    // Await response
    const data = await action(values);
    // Handle errors
    if (data?.error) {
      form.setError("root", {
        message: "There was an error saving your event",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {form.formState.errors.root && (
        <p className="text-destructive text-sm my-2">{form.formState.errors.root.message}</p>
      )}
      {/* Event Name */}
      <div>
        <label htmlFor="name">Event Name</label>
        <input
          id="name"
          type="text"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-destructive text-sm my-2">{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="duration">Duration (In Minutes)</label>
        <input
          id="duration"
          type="number"
          {...form.register("durationInMinutes", { valueAsNumber: true })}
        />
        {form.formState.errors.durationInMinutes && (
          <p className="text-destructive text-sm my-2">{form.formState.errors.durationInMinutes.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description">Event Description</label>
        <textarea
          id="description"
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-destructive text-sm my-2">{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* Active Switch */}
      <div className="flex items-center space-x-2">

        <div className="relative inline-block w-14 h-6">
          <input
            id="isActive"
            type="checkbox"
            {...form.register("isActive")}
            className="peer appearance-none w-12 h-6 bg-background rounded checked:bg-accent cursor-pointer transition-colors duration-300" 
          />
          <label htmlFor="isActive" className="absolute top-[-8] left-0 w-6 h-6 bg-text rounded shadow-sm transition-transform duration-300 peer-checked:translate-x-6 cursor-pointer">
          </label>
        </div>
        <label htmlFor="isActive">Active</label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">

        {event && (
          <>
            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={isPending}
              className="bg-destructive"
              >
              Delete
            </button>
            <DeleteModal 
              isOpen={open} 
              onClose={() => setOpen(false)} 
              onDelete={() =>
                startTransition(() => {
                  deleteEvent(event.id)
                })
              }>
              <h1>Are you sure?</h1>
              <p>Deleting an event cannot be undone.</p>
            </DeleteModal>
          </>
        )}

        <div className="flex w-full justify-end gap-2">
          <button
            type="submit"
            disabled={isPending}
            >
            Submit
          </button>

          <button className="bg-background text-text" disabled={isPending}>
            <Link href="/events">
              Cancel
            </Link>
          </button>
        </div>
      </div>
    </form>

  );
}