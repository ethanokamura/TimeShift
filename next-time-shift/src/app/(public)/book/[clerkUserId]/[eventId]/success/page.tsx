import { db } from "@/src/drizzle/db";
import { formatDateTime } from "@/src/lib/formatters";
import { clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function SuccessPage({
  params,
  searchParams
} : {
  params: Promise<{
    clerkUserId: string;
    eventId: string; 
  }>,
  searchParams: Promise<{
    startTime: string;
  }>
}) {

  const { clerkUserId, eventId } = await params;
  const { startTime } = await searchParams;

  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) => 
      and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId)),
  });

  if (event == null) return notFound();

  const caledarUser = (await clerkClient()).users.getUser(clerkUserId);
  const startTimeDate = new Date(startTime);
  
  return (
    <main>
      <div className="card">
        <h1>Successfully Booked {event.name} with {(await caledarUser).fullName}</h1>
        <h2>{formatDateTime(startTimeDate)}</h2>
        <p>You should recieve an email with confirmation shortly. You can safely close this page now.</p>
      </div>
    </main>
  );

}

// export default async function SuccessPage({ params } : { params: Params }) {
//   const { eventId, clerkUserId } = await params;
//   const searchParams = useSearchParams();

// }