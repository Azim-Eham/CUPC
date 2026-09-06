import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { LayoutDashboard, LogIn } from "lucide-react";

import { NavbarWrapper } from "./navbar-wrapper";
export async function PublicNavbar({ isAbsolute = false, hideLinks = false }: { isAbsolute?: boolean, hideLinks?: boolean }) {
  const session = await auth();

  return (
    <>
      <NavbarWrapper isAbsolute={isAbsolute}>

        <div className="max-w-7xl mx-auto px-6 pt-4 md:pt-6">
          <header className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2a93c] rounded-sm group">
            <div className="relative overflow-hidden rounded-md transition-transform group-hover:scale-105 duration-300">
              <Image src="/CUPC_logo.jpg" alt="CUPC Logo" width={40} height={40} priority className="object-contain bg-white/90 p-0.5" />
            </div>
            <span className="font-display font-bold text-white text-2xl tracking-tight leading-none drop-shadow-md">
              <span className="text-white text-xl">CUPC</span>
            </span>
          </Link>

          
          {/* Desktop Nav */}
          {!hideLinks && (
          <nav className="hidden md:flex items-center gap-8 px-6 py-2">
            <div className="flex items-center gap-8 text-sm font-medium text-white/90">
              <Link href="/#top" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                Home
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
              </Link>
              <Link href="/#about" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                About Us
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
              </Link>
              <Link href="/#mentors" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                Mentors
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
              </Link>
              <Link href="/#faculty" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                Faculty
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
              </Link>
              <Link href="/#events" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                Events
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
              </Link>
            </div>
          </nav>
          )}
          
                    <div className="flex items-center gap-2 md:gap-4">
            {session ? (
              <Link href="/feed" className="bg-[#f2a93c] text-brand-navy text-xs md:text-sm font-semibold px-4 py-2 md:px-6 md:py-2.5 rounded-full hover:bg-[#f5b942] transition-all flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 md:hidden" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            ) : (
              !hideLinks && (<>
                <Link href="/login" className="text-xs md:text-sm font-semibold text-white px-3 py-2 md:px-5 md:py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5 md:hidden" />
                  <span>Log in</span>
                </Link>
                <Link href="/register" className="hidden sm:flex bg-[#f2a93c] text-brand-navy text-sm font-bold px-6 py-2 rounded-full hover:bg-[#f5b942] transition-all">
                  Join Us
                </Link>
              </>)
            )}
          </div>
          </header>
        </div>
      </NavbarWrapper>

      {/* Mobile Nav (Bottom) */}
      {!hideLinks && (
      <div className="md:hidden fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
        <nav className="flex items-center justify-between px-6 py-4 bg-brand-navy/95 backdrop-blur-md rounded-full border border-white/10 shadow-xl">
          <Link href="/#top" className="text-xs font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link href="/#about" className="text-xs font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span className="hidden sm:inline">About</span>
          </Link>
          <Link href="/#mentors" className="text-xs font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span className="hidden sm:inline">Mentors</span>
          </Link>
          <Link href="/#faculty" className="text-xs font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            <span className="hidden sm:inline">Faculty</span>
          </Link>
          <Link href="/#events" className="text-xs font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span className="hidden sm:inline">Events</span>
          </Link>
        </nav>
      </div>
      )}

    </>
  );
}
