"use server"

import { db } from "@/src/drizzle/db";
import { getValidTimesFromSchedule } from "@/src/lib/validTimes";
import { meetingActionSchema } from "@/src/schema/meetings";
import { auth } from "@clerk/nextjs/server";
import "server-only"
import { z } from "zod";
import { createCalendarEvent } from "../googleCalendar";
import { redirect } from "next/navigation";
import { fromZonedTime } from "date-fns-tz";

export async function createMeeting(
  unsafeData: z.infer<typeof meetingActionSchema>
) {

  // Ensure safe data
  const { success, data } = meetingActionSchema.safeParse(unsafeData);

  // Error message is handled in the client-side form
  // Return if there is bad data or the user is not signed in
  if (!success) return { error: true };

  // Insert new meeting into Postgres
  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId, isActive, id }, { eq, and }) =>
      and(
        eq(isActive, true),
        eq(clerkUserId, data.clerkUserId),
        eq(id, data.eventId),
      ),
  });

  if (event == null) return { error: true }

  const startInTimezone = fromZonedTime(data.startTime, data.timezone);

  // Is this specifc date and event valid
  const validTimes = await getValidTimesFromSchedule([startInTimezone], event);

  if (validTimes.length === 0) return { error: true }

  await createCalendarEvent({
    ...data,
    startTime: startInTimezone,
    durationInMinutes: event.durationInMinutes,
    eventName: event.name,
    guestNotes: data.guestNotes !== undefined ? data.guestNotes : undefined,
  });
  // Redirect us back to the main events dashboard
  redirect(`/book/${data.clerkUserId}/${data.eventId}/success?startTime=${data.startTime.toISOString()}`);
}