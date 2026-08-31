import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { LayoutDashboard, LogIn } from "lucide-react";

export async function PublicNavbar({ isAbsolute = false }: { isAbsolute?: boolean }) {
  const session = await auth();

  return (
    <>
      <div className={`w-full z-50 ${isAbsolute ? 'absolute top-0 left-0 right-0 bg-transparent' : 'relative bg-transparent md:bg-[#12172e]'}`}>
        <div className="max-w-7xl mx-auto px-6 pt-4 md:pt-6">
          <header className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2a93c] rounded-sm group">
            <div className="relative overflow-hidden rounded-md transition-transform group-hover:scale-105 duration-300">
              <Image src="/CUPC_logo.jpg" alt="CUPC Logo" width={40} height={40} className="object-contain bg-white/90 p-0.5" />
            </div>
            <span className="font-display font-bold text-white text-2xl tracking-tight leading-none drop-shadow-md">
              <span>CUPC</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
            
            {session ? (
              <Link href="/feed" className="bg-[#f2a93c] text-brand-navy text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#f5b942] transition-all hover:shadow-[0_0_15px_rgba(242,169,60,0.5)] hover:-translate-y-0.5 duration-300">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-white/80 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#f2a93c] after:transition-all after:duration-300 pb-1">
                  Log In
                </Link>
                <Link href="/register" className="bg-[#f2a93c] text-brand-navy text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#f5b942] transition-all hover:shadow-[0_0_15px_rgba(242,169,60,0.5)] hover:-translate-y-0.5 duration-300">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          </header>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#12172e]/95 backdrop-blur-md border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <nav className="flex items-center justify-around px-2 py-2">
          
          {session ? (
            <Link href="/feed" className="text-xs font-semibold text-[#f2a93c] hover:text-[#f5b942] flex flex-col items-center gap-1 p-2 transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link href="/login" className="text-xs font-semibold text-[#f2a93c] hover:text-[#f5b942] flex flex-col items-center gap-1 p-2 transition-colors">
              <LogIn className="w-5 h-5" />
              <span>Log In</span>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
