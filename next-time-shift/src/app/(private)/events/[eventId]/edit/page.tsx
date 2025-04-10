import { db } from "@/src/drizzle/db";
import { EventForm } from "@/app/components/forms/EventForm";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function EditEventPage({ params } : { params: Promise<{ eventId: string }> }) {

  const { eventId } = await params;

  const {userId, redirectToSignIn } = await auth();

  console.log(userId);

  if (userId == null) return redirectToSignIn();

  const event = await db.query.EventTable.findFirst({
    where: (({ id, clerkUserId }, { and, eq }) => 
      and(eq(clerkUserId, userId), eq(id, eventId)))
  });

  if (event == null) return notFound();

  return (
    <main className="flex flex-col items-center">
      <h1>Edit Event</h1>
      <div className="card w-128">
        <h1>New Event</h1>
        <hr />
        <EventForm event={{ ...event, description: event.description || undefined }} />
      </div>
    </main>
  );
}
