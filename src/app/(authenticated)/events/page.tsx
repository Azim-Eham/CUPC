import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, MapPin } from "lucide-react";
import { AcademicCard } from "@/components/ui/academic-card";
import { StaggerReveal, StaggerItem } from "@/components/ui/stagger-reveal";
import { CreateEventForm } from "@/app/admin/events/create-event-form";
import { DeleteEventButton } from "./delete-event";

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
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight mb-2">Events</h1>
          <p className="text-text-secondary">Discover and register for upcoming physics seminars, workshops, and competitions.</p>
        </div>
        {session.user.role === "ADMIN" && (
          <CreateEventForm />
        )}
      </div>

      <div className="space-y-16">
        <div>
          <h2 className="text-xl font-medium text-text-secondary mb-8 border-b border-[#e2e2ea] pb-2">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-text-secondary text-center py-12">No upcoming events scheduled.</p>
          ) : (
            <StaggerReveal className="grid gap-6 md:grid-cols-2">
              {upcomingEvents.map((event) => (
                <StaggerItem key={event.id}>
                  <AcademicCard className="h-full flex flex-col hover:-translate-y-1 hover:border-[#e2e2ea] transition-all duration-300 group">
                    <CardHeader className="bg-surface-alt pb-4 border-b border-[#e2e2ea] relative">
                      <div className="flex justify-between items-start">
                        <div className="text-[11px] font-mono text-text-secondary uppercase tracking-widest mb-3">
                          {event.category}
                        </div>
                        {session.user.role === "ADMIN" && <DeleteEventButton eventId={event.id} />}
                      </div>
                      <CardTitle className="text-xl leading-tight text-brand-navy group-hover:text-amber-500 transition-colors">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 flex-1">
                        {event.description}
                      </p>
                      <div className="space-y-3 text-sm pt-4 border-t border-[#e2e2ea]">
                        <div className="flex items-center gap-3 text-text-secondary">
                          <CalendarIcon className="h-4 w-4 text-amber-500/70" />
                          <span>{format(new Date(event.date), "PPP 'at' p")}</span>
                        </div>
                        {event.venue && (
                          <div className="flex items-center gap-3 text-text-secondary">
                            <MapPin className="h-4 w-4 text-amber-500/70" />
                            <span>{event.venue}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </AcademicCard>
                </StaggerItem>
              ))}
            </StaggerReveal>
          )}
        </div>

        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-xl font-medium text-text-secondary mb-8 border-b border-[#e2e2ea] pb-2">Past Events</h2>
            <StaggerReveal className="grid gap-6 md:grid-cols-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
              {pastEvents.map((event) => (
                <StaggerItem key={event.id}>
                  <AcademicCard className="h-full bg-surface-base">
                    <CardHeader className="pb-4 relative">
                      <div className="flex justify-between items-start">
                        <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-2">
                          {event.category}
                        </div>
                        {session.user.role === "ADMIN" && <DeleteEventButton eventId={event.id} />}
                      </div>
                      <CardTitle className="text-base text-text-secondary">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(new Date(event.date), "PPP")}</span>
                      </div>
                    </CardContent>
                  </AcademicCard>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        )}
      </div>
    </div>
  );
}
