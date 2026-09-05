import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/app/actions/event";
import { format } from "date-fns";
import { CreateEventForm } from "./create-event-form";

export default async function AdminEventsPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/feed");
  }

  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <CreateEventForm />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Events</h2>
        {events.length === 0 ? (
          <p className="text-muted-foreground">No events created yet.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {event.category} • {format(new Date(event.date), "PPP")}
                      </p>
                    </div>
                    <form action={async () => {
                      "use server";
                      await deleteEvent(event.id);
                    }}>
                      <Button type="submit" variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
