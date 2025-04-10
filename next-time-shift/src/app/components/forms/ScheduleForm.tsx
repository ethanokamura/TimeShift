"use client"

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleFormSchema } from "@/src/schema/schedule";
import { DAYS_OF_WEEK } from "@/src/data/constants";
import { formatTimezoneOffset, timeToInt } from "@/src/lib/formatters";
import { saveSchedule } from "@/src/server/actions/schedule";
import { Fragment, useState } from "react";


type Availability = {
  startTime: string,
  endTime: string,
  dayOfWeek: (typeof DAYS_OF_WEEK)[number]
}

export function ScheduleForm({ schedule }: { schedule?: {
  timezone: string,
  availabilities: Availability[]
}}) {

  const [successMessage, setSuccessMessage] = useState<string>()
 
  // Structure Form using RHF
  const form = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      timezone: schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      availabilities: schedule?.availabilities.toSorted((a, b) => {
        return timeToInt(a.startTime) - timeToInt(b.startTime);
      }),
    },
  });

  const { 
    append: addAvailability,
    remove: removeAvailability, 
    fields: availabilityFields,
  } = useFieldArray({ name: "availabilities", control: form.control });

  // Orders availability fields and creates a field id for manipulation
  const groupedAvailabilityFields = Object.groupBy(
    availabilityFields.map((field, index) => ({...field, index})), 
    availability => availability.dayOfWeek,
  );

  // Handle Form Submission
  async function onSubmit(values: z.infer<typeof scheduleFormSchema>) {
    const data = await saveSchedule(values);

    if (data?.error) {
      form.setError("root", {
        message: "There was an error saving your schedule",
      });
    } else {
      setSuccessMessage("Schedule Saved!");
    }
  }

  console.log(form.formState.errors.availabilities);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* User Timezone */}
      <div>
        {form.formState.errors.root && (
          <p className="text-destructive text-base my-2">{form.formState.errors.root.message}</p>
        )}
        {successMessage && (
          <p className="text-accent text-base my-2">{successMessage}</p>
        )}
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

      {/* Availabilities */}
      <div className="flex flex-col">
        {DAYS_OF_WEEK.map((dayOfWeek) => (
          <Fragment key={dayOfWeek}>
            <div className="flex gap-10 items-center justify-between">
              <h3 className="capitalize">{dayOfWeek.substring(0, 3)}</h3>
              <button type="button"
                onClick={() => {
                  addAvailability({
                    dayOfWeek,
                    startTime: "09:00",
                    endTime: "17:00",
                  });
                }}>
                +
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {groupedAvailabilityFields[dayOfWeek]?.map((field, labelIndex) =>(
                <div className="flex flex-col gap-4" key={field.id}>
                  <div className="flex gap-5 items-center">
                    <input
                      type="text"
                      aria-label={`${dayOfWeek} Start Time ${labelIndex + 1}`}
                      {...form.register(`availabilities.${field.index}.startTime`, {
                        required: "Start time is required",
                      })}
                    />

                    <span>-</span>

                    {/* End Time Input */}
                    <input
                      type="text"
                      aria-label={`${dayOfWeek} End Time ${labelIndex + 1}`}
                      {...form.register(`availabilities.${field.index}.endTime`, {
                        required: "End time is required",
                      })}
                    />

                    <button 
                      type="button"
                      className="bg-destructive my-1"
                      onClick={() => removeAvailability(field.index)}
                      >
                      X
                    </button>
                  </div>
                  {form.formState.errors.availabilities?.[field.index]?.message && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.availabilities[field.index]?.message}
                    </p>
                  )}
                  {form.formState.errors.availabilities?.[field.index]?.startTime && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.availabilities[field.index]?.startTime?.message}
                    </p>
                  )}
                  {form.formState.errors.availabilities?.[field.index]?.endTime && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.availabilities[field.index]?.endTime?.message}
                    </p>
                  )}
                  {form.formState.errors.availabilities?.[field.index]?.root && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.availabilities[field.index]?.root?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Fragment>
        ))}
      </div>

      {/* Actions */}
      <div className="flex w-full justify-end gap-2">
        <button disabled={form.formState.isSubmitting} type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}