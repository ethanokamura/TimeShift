import { addMinutes, areIntervalsOverlapping, isFriday, isMonday, isSaturday, isSunday, isThursday, isTuesday, isWednesday, isWithinInterval, setHours, setMinutes } from "date-fns";
import { DAYS_OF_WEEK } from "../data/constants";
import { db } from "../drizzle/db";
import { ScheduleAvailabilityTable } from "../drizzle/schema";
import { getCalendarEventTimes } from "../server/googleCalendar";
import { fromZonedTime } from "date-fns-tz";

export async function getValidTimesFromSchedule(
  timesInOrder: Date[], 
  event: { clerkUserId: string, durationInMinutes: number }
) {

  // Times we want to check
  const start = timesInOrder[0];
  const end = timesInOrder.at(-1);

  // No valid timeslots
  if (start == null || end == null) return [];

  // Get schedule from database
  const schedule = await db.query.ScheduleTable.findFirst({
    where: (({ clerkUserId: userIdCol }, { eq }) => eq(userIdCol, event.clerkUserId)),
    with: { availabilities: true },
  });

  // No valid timeslots
  if (schedule == null) return [];

  // All available time slots
  const groupedAvailabilities = Object.groupBy(
    schedule.availabilities,
    a => a.dayOfWeek,
  );

  // Get previously filled time slots
  const eventTimes = await getCalendarEventTimes(event.clerkUserId, { start, end });

  // Return only the timeslots that are open
  return timesInOrder.filter(
    intervalDate => {
      // All availabilites for a given day
      const availabilities = getAvailabilites(
        groupedAvailabilities,
        intervalDate,
        schedule.timezone
      );
      // How long is my event
      const eventInterval = {
        start: intervalDate,
        end: addMinutes(intervalDate, event.durationInMinutes)
      };


      // For each current calendar events
      // Ensure the event does not overlap and is within the valid availability times
      return eventTimes.every((eventTime) => {
        // Does the current event overlap
        // Returns true if the events are overlapping
        return !areIntervalsOverlapping(eventTime, eventInterval);
      }) && availabilities.some((availability) => {
        return (
          // Ensures start and end of event are within my availability
          // (Is the slot available)
          isWithinInterval(eventInterval.start, availability) && 
          isWithinInterval(eventInterval.end, availability)
        );
      })
    }
  );
}

function getAvailabilites(
  groupedAvailabilities: Partial<
    Record<
      (typeof DAYS_OF_WEEK)[number],
      (typeof ScheduleAvailabilityTable.$inferSelect)[]
    >
  >,
  date: Date,
  timezone: string,
) {
  let availabilities:
    | (typeof ScheduleAvailabilityTable.$inferSelect)[]
    | undefined;

  if (isMonday(date)) {
    availabilities = groupedAvailabilities.monday;
  }
  if (isTuesday(date)) {
    availabilities = groupedAvailabilities.tuesday;
  }
  if (isWednesday(date)) {
    availabilities = groupedAvailabilities.wednesday;
  }
  if (isThursday(date)) {
    availabilities = groupedAvailabilities.thursday;
  }
  if (isFriday(date)) {
    availabilities = groupedAvailabilities.friday;
  }
  if (isSaturday(date)) {
    availabilities = groupedAvailabilities.saturday;
  }
  if (isSunday(date)) {
    availabilities = groupedAvailabilities.sunday;
  }

  // No timeslots available
  if (availabilities == null) return [];

  return availabilities.map(({ startTime, endTime }) => {
    const start = fromZonedTime(
      setMinutes(
        setHours(date, parseInt(startTime.split(":")[0])),
        parseInt(startTime.split(":")[1]),
      ),
      timezone
    );
    const end = fromZonedTime(
      setMinutes(
        setHours(date, parseInt(endTime.split(":")[0])),
        parseInt(endTime.split(":")[1]),
      ),
      timezone
    );

    return { start, end };
  })
}