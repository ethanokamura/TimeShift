import { db } from "@/src/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { ScheduleForm } from "../../components/forms/ScheduleForm";

export const revalidate = 0

export default async function SchedulePage() {

  const { userId, redirectToSignIn } = await auth();

  if (userId == null) redirectToSignIn();

  const schedule = await db.query.ScheduleTable.findFirst({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId!),
    with: { availabilities: true },
  })

  return (
    <main className="flex flex-col items-center">
      <h1>Create a New Event</h1>
      <div className="card w-128">
        <h1>New Event</h1>
        <hr />
        <ScheduleForm schedule={schedule} />
      </div>
    </main>
  );
}