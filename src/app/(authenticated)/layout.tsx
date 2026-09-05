import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NavbarWrapper } from "@/components/navbar-wrapper";

import { Home, Calendar, FileText, Users, GraduationCap, UserCircle, LogOut, Shield, LayoutDashboard } from "lucide-react";

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
                <Link href="/mentors" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                  Mentors
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
                </Link>
                {(session.user.role === "ALUMNI" || session.user.role === "FACULTY") && (
                  <Link href="/mentorship-dashboard" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                    Dashboard
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
                  </Link>
                )}
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
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg">
        <nav className="flex items-center gap-6 overflow-x-auto px-6 py-4 bg-brand-navy/95 backdrop-blur-md rounded-full border border-white/10 shadow-xl" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `nav::-webkit-scrollbar { display: none; }`}} />
          <Link href="/feed" className="shrink-0 text-[10px] font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <Home className="w-5 h-5" />
            <span>Feed</span>
          </Link>
          <Link href="/events" className="shrink-0 text-[10px] font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <Calendar className="w-5 h-5" />
            <span>Events</span>
          </Link>
          <Link href="/resources" className="shrink-0 text-[10px] font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <FileText className="w-5 h-5" />
            <span>Resources</span>
          </Link>
          <Link href="/members" className="shrink-0 text-[10px] font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <Users className="w-5 h-5" />
            <span>Members</span>
          </Link>
          <Link href="/mentors" className="shrink-0 text-[10px] font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <GraduationCap className="w-5 h-5" />
            <span>Mentors</span>
          </Link>
          {(session.user.role === "ALUMNI" || session.user.role === "FACULTY") && (
            <Link href="/mentorship-dashboard" className="shrink-0 text-[10px] font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          )}
          <Link href="/profile" className="shrink-0 text-[10px] font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <UserCircle className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }} className="shrink-0">
            <button type="submit" className="text-[10px] font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1 bg-transparent border-none p-0 cursor-pointer">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </form>
          {session.user.role === "ADMIN" && (
            <Link href="/admin/users" className="shrink-0 text-[10px] font-semibold text-[#f2a93c]/90 hover:text-[#f2a93c] flex flex-col items-center gap-1">
              <Shield className="w-5 h-5" />
              <span>Admin</span>
            </Link>
          )}
        </nav>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-6 lg:py-12 pb-24 md:pb-12">
        {children}
      </main>
    </div>
  );
}
