import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NavbarWrapper } from "@/components/navbar-wrapper";

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
      <NavbarWrapper isAbsolute={false}>
        <div className="max-w-7xl mx-auto px-6 pt-4 md:pt-6">
          <header className="flex items-center justify-between py-4">
            <Link href="/feed" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2a93c] rounded-sm group">
              <div className="relative overflow-hidden rounded-md transition-transform group-hover:scale-105 duration-300">
                <Image src="/CUPC_logo.jpg" alt="CUPC Logo" width={40} height={40} className="object-contain bg-white/90 p-0.5" />
              </div>
              <span className="font-display font-bold text-white text-2xl tracking-tight leading-none drop-shadow-md">
                <span className="text-white text-xl">CUPC</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 px-6 py-2">
              <div className="flex items-center gap-8 text-sm font-medium text-white/90">
                <Link href="/feed" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                  Feed
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
                </Link>
                <Link href="/events" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                  Events
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
                </Link>
                <Link href="/resources" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                  Resources
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
                </Link>
                <Link href="/members" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                  Members
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
                </Link>
                <Link href="/achievements" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                  Achievements
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
                </Link>
                <Link href="/profile" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                  Profile
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin/users" className="relative text-[#f2a93c]/90 hover:text-[#f2a93c] transition-all hover:scale-105 active:scale-95 focus:text-white focus-visible:text-white focus:outline-none group">
                    Admin
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
                  </Link>
                )}
              </div>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-medium text-white/70">
                {session.user.name}
              </span>
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <button type="submit" className="text-sm font-semibold text-white px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
                  Log out
                </button>
              </form>
            </div>
          </header>
        </div>
      </NavbarWrapper>

      {/* Mobile Nav (Bottom) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
        <nav className="flex items-center justify-between px-6 py-4 bg-brand-navy/95 backdrop-blur-md rounded-full border border-white/10 shadow-xl">
          <Link href="/feed" className="text-xs font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="hidden sm:inline">Feed</span>
          </Link>
          <Link href="/events" className="text-xs font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span className="hidden sm:inline">Events</span>
          </Link>
          <Link href="/members" className="text-xs font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span className="hidden sm:inline">Members</span>
          </Link>
          <Link href="/profile" className="text-xs font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </nav>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-6 lg:py-12 pb-24 md:pb-12">
        {children}
      </main>
    </div>
  );
}
