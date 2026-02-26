import { EventsGrid } from "@/components/events-grid";

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-balance">Upcoming Events</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Discover events happening around you. Like, explore, and leave your feedback.
        </p>
      </div>
      <EventsGrid />
    </div>
  );
}
