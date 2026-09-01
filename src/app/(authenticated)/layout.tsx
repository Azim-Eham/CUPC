import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link href="/feed" className="font-bold mr-6">
            CUPC
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/feed" className="transition-colors hover:text-foreground/80">
              Feed
            </Link>
            <Link href="/events" className="transition-colors hover:text-foreground/80">
              Events
            </Link>
            <Link href="/resources" className="transition-colors hover:text-foreground/80">
              Resources
            </Link>
            <Link href="/members" className="transition-colors hover:text-foreground/80">
              Members
            </Link>
            <Link href="/notifications" className="transition-colors hover:text-foreground/80">
              Notifications
            </Link>
            <Link href="/achievements" className="transition-colors hover:text-foreground/80">
              Achievements
            </Link>
            {session.user.role === "ADMIN" && (
              <>
                <Link href="/admin/users" className="text-primary hover:text-primary/80">
                  Users
                </Link>
                <Link href="/admin/reports" className="text-primary hover:text-primary/80">
                  Reports
                </Link>
              </>
            )}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {session.user.name} ({session.user.role})
            </span>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}>
              <Button variant="ghost" size="sm" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}
