"use server"

import { db } from "@/src/drizzle/db";
import { EventTable } from "@/src/drizzle/schema";
import { eventFormSchema } from "@/src/schema/events"
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import "server-only"
import { z } from "zod"

export async function createEvent(
  unsafeData: z.infer<typeof eventFormSchema>
) : Promise<{ error: boolean } | undefined> {
  // Get clerk user
  const { userId } = await auth();

  // Ensure safe data
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  // Error message is handled in the client-side form
  // Return if there is bad data or the user is not signed in
  if (!success || userId == null) {
    return { error: true };
  }

  // Insert new event into Postgres
  await db.insert(EventTable).values({ ...data, clerkUserId: userId });

  // Redirect us back to the main events dashboard
  redirect("/events");
}

export async function updateEvent(
  id: string,
  unsafeData: z.infer<typeof eventFormSchema>
) : Promise<{ error: boolean } | undefined> {
  // Get clerk user
  const { userId } = await auth();

  // Ensure safe data
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  // Error message is handled in the client-side form
  // Return if there is bad data or the user is not signed in
  if (!success || userId == null) {
    return { error: true };
  }

  // Attempt to update the database
  const { rowCount } = await db.update(EventTable)
    .set({...data})
    .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

  // No data found
  if (rowCount === 0) {
    return { error: true }
  }

  // Redirect us back to the main events dashboard
  redirect("/events");
}


export async function deleteEvent(
  id: string,
) : Promise<{ error: boolean } | undefined> {
  // Get clerk user
  const { userId } = await auth();

  // Validate user
  if (userId == null) {
    return { error: true };
  }

  // Attempt to delete the data
  const { rowCount } = await db.delete(EventTable).where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

  // No data found
  if (rowCount === 0) {
    return { error: true }
  }

  // Redirect us back to the main events dashboard
  redirect("/events");
}