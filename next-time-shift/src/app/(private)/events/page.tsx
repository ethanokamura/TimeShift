import { db } from "@/src/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { EventProps } from "@/src/interfaces/event";
import { formatEventDescription } from "@/src/lib/formatters";
import CopyEventButton from "@/app/components/buttons/CopyEventButton";

export default async function EventsPage() {

  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn;

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, {eq}) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });

  return(
    <main>
      <div className="flex flex-wrap justify-between">
        <div>
          <h1>Events Page</h1>
          <h3 className="text-text2">All of your events, in one place!</h3>
        </div>
        <Link href="/events/new">
          <button>+</button>
        </Link>
      </div>
      <hr/>
      {events.length > 0 ? (
        <div  className="flex flex-wrap justify-center gap-10 w-full">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div>
          <h2>No Events Found.</h2>
          <p>You do not have any events yet. Create your first event to get started!</p>
          <Link href="/events/new">
            <button>
              Create New Event
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}

function EventCard({
  id,
  isActive,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: EventProps) {

  return (
    <div className={`card w-96 ${!isActive && "opacity-50"}`}>
      <div>
        <h1>{name}</h1>
        <p>{formatEventDescription(durationInMinutes)}</p>
      </div>
      {description != null && <p>{description}</p>}
      <footer className="flex justify-end gap-2">
        {isActive && (
          <CopyEventButton eventId={id} clerkUserId={clerkUserId} />
        )}
        <button>
          <Link href={`/events/${id}/edit`}>Edit</Link>
        </button>
      </footer>
    </div>
  );
}