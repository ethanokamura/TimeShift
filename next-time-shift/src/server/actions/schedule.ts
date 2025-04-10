"use server"

import { db } from "@/src/drizzle/db";
import { ScheduleAvailabilityTable, ScheduleTable } from "@/src/drizzle/schema";
import { scheduleFormSchema } from "@/src/schema/schedule"
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { BatchItem } from "drizzle-orm/batch";
import "server-only"
import { z } from "zod"

export async function saveSchedule(unsafeData: z.infer<typeof scheduleFormSchema>) {
  // Get clerk user
  const { userId } = await auth();

  // Ensure safe data
  const { success, data } = scheduleFormSchema.safeParse(unsafeData);

  // Error message is handled in the client-side form
  // Return if there is bad data or the user is not signed in
  if (!success || userId == null) {
    return { error: true };
  }

  // scheduleData is out timezone
  const { availabilities, ...scheduleData } = data;

  // Insert new or update schedule for user and get the id
  const [{ id: scheduleId }] = await db.insert(ScheduleTable)
    .values({ ...scheduleData, clerkUserId: userId })
    .onConflictDoUpdate({
      target: ScheduleTable.clerkUserId,
      set: scheduleData,
    })
    .returning({ id: ScheduleTable.id });

  // Batch delete
  // Easier to remove all current availabilites than parsing through each
  const statements: [BatchItem<"pg">] = [
    db
      .delete(ScheduleAvailabilityTable)
      .where(eq(ScheduleAvailabilityTable.scheduleId, scheduleId)),
  ];

  // Batch insert
  // Insert all new availabilities to the database
  if (availabilities.length > 0) {
    statements.push(db.insert(ScheduleAvailabilityTable).values(
      availabilities.map((availability) => ({
        ...availability,
        scheduleId,
      })),
    ));
  }

  // Batch write
  await db.batch(statements);
}