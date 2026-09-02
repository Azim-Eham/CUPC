import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AcademicCard } from "@/components/ui/academic-card";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { markAllAsRead, markAsRead } from "@/app/actions/notification";
import { Bell, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium tracking-tight text-brand-navy flex items-center gap-2">
          <Bell className="h-6 w-6" /> Notifications
          {unreadCount > 0 && (
            <span className="bg-[#f2a93c] text-white text-sm py-1 px-2 rounded-full ml-2">
              {unreadCount} new
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <form action={async () => {
            "use server";
            await markAllAsRead();
          }}>
            <Button type="submit" variant="outline" size="sm">Mark all as read</Button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-surface-alt rounded-lg border border-dashed border-[#e2e2ea]">
          <p className="text-text-secondary">You don&apos;t have any notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <AcademicCard key={notification.id} className={`transition-colors ${!notification.isRead ? 'bg-[#f2a93c]/5 border-[#f2a93c]/20' : ''}`}>
              <CardContent className="p-4 flex gap-4 items-start">
                <div className={`p-2 rounded-full ${!notification.isRead ? 'bg-[#f2a93c]/10 text-[#f2a93c]' : 'bg-[#12172e]/5 text-text-secondary'}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className={`text-sm ${!notification.isRead ? 'font-semibold text-brand-navy' : 'text-text-secondary'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                  {notification.link && (
                    <Button variant="ghost" className="p-0 h-auto text-xs">
                      <Link href={notification.link}>View Details</Link>
                    </Button>
                  )}
                </div>
                {!notification.isRead && (
                  <form action={async () => {
                    "use server";
                    await markAsRead(notification.id);
                  }}>
                    <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-[#f2a93c]">
                      <CheckCircle className="h-4 w-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  </form>
                )}
              </CardContent>
            </AcademicCard>
          ))}
        </div>
      )}
    </div>
  );
}
