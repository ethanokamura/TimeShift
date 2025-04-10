import { EventForm } from "@/app/components/forms/EventForm";

export default function CreateNewEventPage() {

  return (
    <main className="flex flex-col items-center">
      <h1>Create a New Event</h1>
      <div className="card w-128">
        <h1>New Event</h1>
        <hr />
        <EventForm />
      </div>
    </main>
  );
}