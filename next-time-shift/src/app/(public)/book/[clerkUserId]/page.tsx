import { db } from "@/src/drizzle/db";
import { PublicEventProps } from "@/src/interfaces/event";
import { formatEventDescription } from "@/src/lib/formatters";
import { clerkClient } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ clerkUserId: string }>;

// Get dynamic params!
export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const params = await props.params;
  const { clerkUserId } = params;

  return {
    title: `Booking Page for ${clerkUserId}`,
    description: `This is the booking page for user with id: ${clerkUserId}`,
  };
}

export default async function BookingPage({
  params
} : {
  params: Promise<{ clerkUserId: string }> 
}) {

  const { clerkUserId } = await params;

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userdIdCol, isActive }, { eq, and }) => 
      and(eq(userdIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });

  if (events.length === 0) {
    return notFound();
  }

  const { fullName } = await (await clerkClient()).users.getUser(clerkUserId);

  return (
    <main>
      <h1>{fullName}</h1>
      <p>Welcome to my scheduling page. Please follow the instructions to add an event to my calendar</p>
      <div  className="flex flex-wrap justify-center gap-10 w-full">
        {events.map(event => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </main>
  );
}


function EventCard({
  id,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: PublicEventProps) {

  return (
    <div className={`card w-96`}>
      <div>
        <h1>{name}</h1>
        <p>{formatEventDescription(durationInMinutes)}</p>
      </div>
      {description != null && <p>{description}</p>}
      <footer className="flex justify-end gap-2">
        <button>
          <Link href={`/book/${clerkUserId}/${id}`}>Select</Link>
        </button>
      </footer>
    </div>
  );
}