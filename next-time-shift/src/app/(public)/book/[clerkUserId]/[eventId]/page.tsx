import { MeetingForm } from "@/src/app/components/forms/MeetingForm";
import { db } from "@/src/drizzle/db";
import { getValidTimesFromSchedule } from "@/src/lib/validTimes";
import { clerkClient } from "@clerk/nextjs/server";
import { addMonths, eachMinuteOfInterval, endOfDay, roundToNearestMinutes } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BookEventPage({ 
  params
} : {
  params: Promise<{
    clerkUserId: string; 
    eventId: string; 
  }> 
}) {

  const { eventId, clerkUserId } = await params;

  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) => 
      and(eq(isActive, true), eq(userIdCol, clerkUserId)),
  });

  if (event == null) return notFound();

  // Get the desired clerk user
  const calendarUser = await (await clerkClient()).users.getUser(clerkUserId);

  // Start date in 15 minute increments
  const startDate = roundToNearestMinutes(new Date(), {
    nearestTo: 15,
    roundingMethod: "ceil",
  })

  // Limit booking to 2 months
  const endDate = endOfDay(addMonths(startDate, 2));

  // Every 15 minute value from start to end date
  const validTimes = await getValidTimesFromSchedule(
    eachMinuteOfInterval(
      { start: startDate, end: endDate }, 
      { step: 15 }
    ), event
  );

  if (validTimes.length === 0) {
    return <NoTimeSlots 
        event={ event }
        calendarUser={ calendarUser }
      />
  }

  return (
    <main>
      <h1>Book {event.name} with {calendarUser.fullName}</h1>
      <MeetingForm 
        validTimes={validTimes}
        eventId={event.id}
        clerkUserId={clerkUserId}
      />
    </main>
  );
}

function NoTimeSlots({
  event,
  calendarUser,
} : {
  event: { name: string; description: string | null },
  calendarUser: { id: string; fullName: string | null },
}) {

  return (
    <main>
      <div className="card">
        <h1>Book {event.name} with {calendarUser.fullName}</h1>
        <h2>{event.description}</h2>
        <div>
          <p>{calendarUser.fullName} is currently booked up.</p>
          <p>Please check back later or choose a shorter event.</p>
        </div>
        <div>
          <button type="button">
            <Link href={`/book/${calendarUser.id}`}>
              Choose Another Event
            </Link>
          </button>
        </div>
      </div>
    </main>
  );
}