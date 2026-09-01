import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, MapPin } from "lucide-react";

export default async function EventsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: "asc" },
  });

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date());
  const pastEvents = events.filter((e) => new Date(e.date) < new Date());

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Events</h1>

      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-muted-foreground">No upcoming events scheduled.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border-primary/20">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      {event.category}
                    </div>
                    <CardTitle>{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(event.date), "PPP 'at' p")}</span>
                      </div>
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
            <div className="grid gap-6 md:grid-cols-2 opacity-75">
              {pastEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader className="pb-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {event.category}
                    </div>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(event.date), "PPP")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
