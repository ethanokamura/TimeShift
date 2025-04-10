"use client"

import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { meetingFormSchema } from "@/src/schema/meetings";
import { formatTimeString, formatTimezoneOffset } from "@/src/lib/formatters";
import { toZonedTime } from "date-fns-tz";
import CalendarModal from "./CalendarModal";
import { isSameDay } from "date-fns";
import { createMeeting } from "@/src/server/actions/meetings";

export function MeetingForm({ 
  validTimes,
  eventId,
  clerkUserId,
 }: {
  validTimes: Date[],
  eventId: string,
  clerkUserId: string,
}) {

  // React Hooks
  const [isPending, startTransition ] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string>()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Structure Form using RHF
  const form = useForm<z.infer<typeof meetingFormSchema>>({
    resolver: zodResolver(meetingFormSchema) as Resolver<z.infer<typeof meetingFormSchema>>,
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      date: undefined,
    }
  });  

  // Listen to changes in timzeone
  const timezone = form.watch("timezone");
  const startTime = form.watch("startTime");
  const date = form.watch("date")

  
  // Get a list of vaid times in a given timezone
  const validTimesInTimezone = useMemo(() => {
    return validTimes.map(date => toZonedTime(date, timezone))
  }, [validTimes, timezone])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    form.setValue("date", date, { shouldValidate: true });
  };

  // Handle Form Submission
  async function onSubmit(values: z.infer<typeof meetingFormSchema>) {

    console.log(`selected start time: ${values.startTime}`)
    // Await response
    const data = await createMeeting({
      ...values,
      eventId,
      clerkUserId,
    });
    // Handle errors
    if (data?.error) {
      form.setError("root", {
        message: "There was an error scheduling this meeting",
      });
    } else {
      setSuccessMessage("Meeting scheduled successfully!");
      form.reset();
      setSelectedDate(null);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {form.formState.errors.root && (
        <p className="text-destructive text-base my-2">{form.formState.errors.root.message}</p>
      )}
      {successMessage && (
        <p className="text-accent text-base my-2">{successMessage}</p>
      )}
      {/* User Timezone */}
      <div>
        <label htmlFor="timezone">
          Timezone
        </label>
        <select
          id="timezone"
          {...form.register("timezone", { required: true })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {Intl.supportedValuesOf("timeZone").map((timezone) => (
            <option key={timezone} value={timezone}>
              {`${timezone} (${formatTimezoneOffset(timezone)})`}
            </option>
          ))}
        </select>
        {form.formState.errors.timezone && (
          <p className="text-destructive text-sm my-2">This field is required.</p>
        )}
      </div>

      {/* Meeting Date */}
      <div>
        <label htmlFor="date">Meeting Date</label>
        <div>
          <CalendarModal onDateSelect={handleDateSelect} disabledDates={[new Date(2024, 5, 20)]} />
          {selectedDate && <p>Selected Date: {selectedDate.toDateString()}</p>}
        </div>
        {form.formState.errors.date && (
          <p className="text-destructive text-sm my-2">{form.formState.errors.date.message}</p>
        )}
      </div>

      {/* Start Time */}
      <div>
        <label htmlFor="startTime">Start Time</label>
        <select
          disabled={date == null || timezone == null}
          id="startTime"
          value={startTime instanceof Date ? startTime.toISOString() : ''}
          onChange={(e) => {
            form.setValue('startTime', new Date(e.target.value), {
              shouldValidate: true,
            });
          }}
          // {...form.register('startTime', { required: true })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {validTimesInTimezone
            .filter(time => isSameDay(time, date))
            .map((time) => (
              <option key={time.toISOString()} value={time.toISOString()}>
                {formatTimeString(time)}
              </option>
            ))}
        </select>
        {form.formState.errors.startTime && (
          <p className="text-destructive text-sm my-2">This field is required.</p>
        )}
      </div>

      {/* User Name */}
      <div>
        <label htmlFor="guestName">Your Name</label>
        <input
          id="guestName"
          type="text"
          {...form.register("guestName")}
        />
        {form.formState.errors.guestName && (
          <p className="text-destructive text-sm my-2">{form.formState.errors.guestName.message}</p>
        )}
      </div>

      {/* User Email */}
      <div>
        <label htmlFor="guestEmail">Your Email</label>
        <input
          id="guestEmail"
          type="text"
          {...form.register("guestEmail")}
        />
        {form.formState.errors.guestEmail && (
          <p className="text-destructive text-sm my-2">{form.formState.errors.guestEmail.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="flex w-full justify-end gap-2">
          <button
            type="submit"
            disabled={isPending}
            >
            Schedule
          </button>

          <button className="bg-background text-text" disabled={isPending}>
            <Link href={`/book/${clerkUserId}`}>
              Cancel
            </Link>
          </button>
        </div>
      </div>
    </form>
  );
}