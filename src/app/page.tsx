import Link from "next/link";
import { ChevronRight, Play, Calendar, Users, Mail, Globe, MapPin, Network, GraduationCap, Microscope } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getFeaturedMentors() {
  try {
    // Fetch up to 4 approved alumni/mentors
    const mentors = await prisma.user.findMany({
      where: {
        role: "ALUMNI",
        status: "APPROVED",
        availableForMentorship: true
      },
      take: 4,
      select: {
        id: true,
        name: true,
        department: true,
        organization: true,
        currentPosition: true,
        graduationYear: true,
        profileImage: true,
      }
    });
    return mentors;
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return [];
  }
}

const faculty = [
  {
    "name": "Dr. Md. Rafiqul Islam",
    "role": "Professor & Chairman",
    "initials": "MI",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/390_8LLYLCZB3D.jpg"
  },
  {
    "name": "Dr. Kazi Shamim Sultana",
    "role": "Professor",
    "initials": "KS",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/391_FJZ0YIL8YO.jpg"
  },
  {
    "name": "Dr AKM Moinul Haque Meaze",
    "role": "Professor",
    "initials": "DM",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/51_1H6DNZ4YDL.jpg"
  },
  {
    "name": "Professor Dr. Mohammed Nasim Hasan",
    "role": "Professor",
    "initials": "MH",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/392_YPGWUGVVZY.jpg"
  },
  {
    "name": "Dr. Shyamal Ranjan Chakraborty",
    "role": "Professor",
    "initials": "SC",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/393_18J9UMOXD5.jpg"
  }
];

async function getUpcomingEvents() {
  try {
    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: "asc",
      },
      take: 3,
    });
    return upcomingEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

import { PublicNavbar } from "@/components/public-navbar";
import { HeroBackground } from "@/components/hero-background";
import { ScrollAnimations } from "@/components/scroll-animations";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CUPC - Chittagong University Physics Club",
  description: "Join the Chittagong University Physics Club. Discovering the universe through physics, research, mentorship, and community events.",
};

export default async function LandingPage() {
  const mentors = await getFeaturedMentors();
  const dbEvents = await getUpcomingEvents();
  return (
    <div className="min-h-dvh bg-surface-base flex flex-col font-sans">
      <ScrollAnimations />
      <PublicNavbar isAbsolute={true} />

      {/* 1. Header (sits on dark hero) */}
      <main id="top" className="flex-1 flex flex-col w-full">

        {/* 2. Hero */}
        <section className="w-full relative flex flex-col min-h-[90vh] pb-32 pt-32 overflow-hidden justify-center items-center">
          {/* Background Image */}
          <HeroBackground />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-start justify-center pt-20">
            <h1 className="font-display text-[64px] md:text-[88px] leading-[1.05] font-bold mb-4 max-w-5xl tracking-tight text-left drop-shadow-2xl w-full">
              <span data-hero-line className="text-white block">Chittagong</span>
              <span data-hero-line className="text-white block">University</span>
              <span data-hero-line className="text-[#f2a93c] block">Physics Club</span>
            </h1>

            <p data-hero-sub className="text-white text-xl md:text-2xl leading-relaxed w-full text-left mb-12 drop-shadow-md font-medium">
              Exploring the Universe Through Physics
            </p>

            <div data-hero-cta className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-6 w-full">
              <Link href="/register" className="inline-flex items-center justify-center bg-[#f2a93c] text-brand-navy text-base font-bold px-8 py-3.5 rounded-full transition-all hover:bg-[#12172e] hover:text-white hover:shadow-lg hover:-translate-y-1 group">
                Join the Community <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="inline-flex items-center justify-center text-white/90 text-base font-bold transition-all hover:text-white group">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mr-3 group-hover:border-white/40 transition-colors">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
                Watch Intro
              </button>
            </div>
          </div>
        </section>

        {/* 4. About section */}
        <section id="about" className="w-full max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div data-anim="about-heading">
              <span className="inline-block bg-[#f2a93c]/10 text-[#f2a93c] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 shadow-sm">About Us</span>
              <h2 className="font-display text-[44px] md:text-[52px] leading-[1.1] font-bold text-brand-navy tracking-tight">
                Uniting the brilliant minds of CU Physics
              </h2>
            </div>

            <div data-anim="about-text" className="space-y-6 text-text-secondary text-lg leading-relaxed md:text-xl">
              <p>
                The Chittagong University Physics Club (CUPC) is the premier platform dedicated to bridging the gap between current physics students, esteemed faculty, and our accomplished alumni network spread across the globe.
              </p>
              <p>
                We believe in the power of shared knowledge. Whether you are seeking career guidance, looking for research collaborators, or simply wanting to connect with fellow physics enthusiasts, CUPC is your home.
              </p>
            </div>

            <ul className="space-y-5 pt-4">
              {[
                "Global network of alumni",
                "Exclusive mentorship programs",
                "Access to research opportunities",
                "Academic and career resources"
              ].map((item, i) => (
                <li key={i} data-anim="about-bullet" className="flex items-center gap-3 text-brand-navy font-bold text-sm md:text-base group">
                  <div className="w-6 h-6 rounded-full bg-transparent border border-[#12172e]/20 flex items-center justify-center text-brand-navy group-hover:border-[#f2a93c] group-hover:text-[#f2a93c] transition-colors duration-300 shadow-sm">
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div data-anim="about-card" className="flex-1 w-full max-w-md">
            <div className="bg-[#12172e] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-[0_20px_40px_-10px_rgba(18,23,46,0.3)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.02] duration-300 transition-transform duration-500 border border-white/5">
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#f2a93c]/20 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
               <Image src="/CUPC_logo.jpg" alt="CUPC" width={112} height={112} priority className="mb-8 rounded-2xl object-contain bg-white p-2 relative z-10" />
               <div className="font-display text-2xl font-bold text-white mb-2 tracking-tight">Established 2026</div>
               <div className="text-white/60 text-base">University of Chittagong</div>
            </div>
          </div>
        </section>

        {/* 5. Empowering Feature Section */}
        <section className="w-full relative py-32 mt-12 overflow-hidden">
          <div className="absolute inset-0 bg-surface-alt -skew-y-3 origin-top-left z-0"></div>

          <div data-anim="features-heading" className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <span className="inline-block border border-[#e2e2ea] text-text-secondary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow-sm bg-white">Features</span>
            <h2 className="font-display text-[44px] md:text-[52px] leading-[1.1] font-bold text-brand-navy mb-6 max-w-3xl mx-auto tracking-tight">
              Empowering your physics journey
            </h2>
            <p className="text-text-secondary text-xl mb-20 max-w-2xl mx-auto leading-relaxed">
              We provide the tools, network, and resources you need to excel in your academic pursuits and professional career.
            </p>

            <div data-anim="features-grid" className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              {/* Feature 1 */}
              <div data-anim="feature-card" className="flex flex-col items-center bg-white p-10 rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#12172e]/5 to-transparent rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-20 h-20 rounded-2xl bg-[#12172e]/5 group-hover:bg-[#12172e]/10 flex items-center justify-center mb-8 transition-colors duration-300 relative z-10">
                  <Network className="w-10 h-10 text-[#12172e]" />
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-4 relative z-10">Vast Alumni Network</h3>
                <p className="text-text-secondary leading-relaxed text-lg relative z-10">
                  Connect with physics graduates thriving in academia, research, and industry worldwide.
                </p>
              </div>

              {/* Feature 2 */}
              <div data-anim="feature-card" className="flex flex-col items-center bg-white p-10 rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#f2a93c]/10 to-transparent rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-20 h-20 rounded-2xl bg-[#f2a93c]/10 group-hover:bg-[#f2a93c]/20 flex items-center justify-center mb-8 transition-colors duration-300 relative z-10">
                  <GraduationCap className="w-10 h-10 text-[#f2a93c]" />
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-4 relative z-10">Mentorship & Guidance</h3>
                <p className="text-text-secondary leading-relaxed text-lg relative z-10">
                  Receive personalized career and academic advice from experienced professionals and seniors.
                </p>
              </div>

              {/* Feature 3 */}
              <div data-anim="feature-card" className="flex flex-col items-center bg-white p-10 rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-20 h-20 rounded-2xl bg-teal-500/10 group-hover:bg-teal-500/20 flex items-center justify-center mb-8 transition-colors duration-300 relative z-10">
                  <Microscope className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-4 relative z-10">Research Collaboration</h3>
                <p className="text-text-secondary leading-relaxed text-lg relative z-10">
                  Collaborate on cutting-edge research, share ideas, and access academic resources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Mentors Section */}
        <section id="mentors" className="w-full max-w-7xl mx-auto px-6 py-32 relative">
          {/* Decorative background element */}
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#f2a93c]/5 rounded-full blur-3xl -z-10"></div>

          <div data-anim="mentors-heading" className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="inline-block border border-[#e2e2ea] text-[#f2a93c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow-sm bg-[#f2a93c]/5">Mentorship</span>
              <h2 className="font-display text-[44px] md:text-[52px] leading-[1.1] font-bold text-brand-navy max-w-xl mb-6 tracking-tight">
                Learn from those who paved the way
              </h2>
              <p className="text-text-secondary text-xl max-w-xl leading-relaxed">
                Connect with distinguished alumni who are ready to offer their expertise and guidance.
              </p>
            </div>
            <Link data-anim="mentors-cta" href="/mentors" className="hidden md:inline-flex items-center justify-center bg-white border border-[#e2e2ea] text-brand-navy text-sm font-bold px-8 py-4 rounded-full hover:bg-brand-navy hover:text-white hover:border-brand-navy hover:shadow-[0_8px_20px_-4px_rgba(18,23,46,0.2)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy transition-all duration-300 group shrink-0">
              View All Mentors <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {mentors.length > 0 ? (
            <div data-anim="mentors-content" className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mentors.map((mentor) => {
                const initials = mentor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                return (
                  <Link
                    key={mentor.id}
                    href={`/profile/${mentor.id}`}
                    className="bg-white border border-[#e2e2ea] rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center gap-8 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-brand-navy/20 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#12172e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {mentor.profileImage ? (
                      <Image src={mentor.profileImage} alt={mentor.name} width={80} height={80} className="w-20 h-20 shrink-0 rounded-full object-cover ring-4 ring-white shadow-md relative z-10" />
                    ) : (
                      <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-br from-[#12172e] to-[#2a3668] flex items-center justify-center text-2xl font-bold text-white ring-4 ring-white shadow-md relative z-10">
                        {initials}
                      </div>
                    )}

                    <div className="flex-1 relative z-10">
                      <h3 className="text-xl font-bold text-brand-navy mb-1 group-hover:text-[#f2a93c] transition-colors">{mentor.name}</h3>
                      <p className="text-sm font-medium text-text-secondary mb-4">{mentor.currentPosition || "Alumni Mentor"}</p>

                      <div className="flex flex-wrap items-center gap-2">
                        {mentor.organization && (
                          <span className="px-3 py-1.5 rounded-full bg-[#12172e]/5 text-[#12172e] text-xs font-semibold capitalize border border-[#12172e]/10">{mentor.organization}</span>
                        )}
                        {mentor.graduationYear && (
                          <span className="px-3 py-1.5 rounded-full bg-surface-alt text-text-secondary text-xs font-semibold border border-neutral-200">Class of {mentor.graduationYear}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div data-anim="mentors-content" className="w-full py-20 text-center bg-surface-alt rounded-[2rem] border border-dashed border-neutral-300">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Users className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-brand-navy text-lg font-bold mb-2">No mentors available yet</p>
              <p className="text-text-secondary">Check back soon as alumni join the platform.</p>
            </div>
          )}

          <div className="mt-10 md:hidden flex justify-center">
            <Link href="/mentors" className="inline-flex items-center justify-center bg-white border border-[#e2e2ea] text-brand-navy text-sm font-bold px-8 py-4 rounded-full hover:bg-brand-navy hover:text-white hover:border-brand-navy hover:shadow-[0_8px_20px_-4px_rgba(18,23,46,0.2)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy transition-all duration-300 group">
              View All Mentors <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* 6.5 Faculty Section */}
        <section id="faculty" className="w-full bg-surface-navy py-32 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div data-anim="faculty-heading" className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
              <div>
                <span className="inline-block border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm bg-white/5">Department</span>
                <h2 className="font-display text-[44px] md:text-[52px] leading-[1.1] font-bold text-white max-w-xl mb-6 tracking-tight">
                  Distinguished Faculty
                </h2>
                <p className="text-white/70 text-xl max-w-xl leading-relaxed mx-auto md:mx-0">
                  Learn from the minds shaping the future of physics at the University of Chittagong.
                </p>
              </div>
              <Link href="/faculty" className="hidden md:inline-flex items-center justify-center bg-[#f2a93c] text-brand-navy text-sm font-bold px-6 py-2.5 rounded-full hover:bg-brand-navy hover:text-white hover:shadow-[0_8px_20px_-4px_rgba(18,23,46,0.3)] hover:-translate-y-1 transition-all duration-300 group shrink-0">
                View All Faculty <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {faculty.length > 0 ? (
              <div className="flex flex-row overflow-x-auto snap-x snap-mandatory lg:grid after:content-[''] after:w-6 after:shrink-0 lg:after:hidden lg:grid-cols-5 gap-4 pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 scrollbar-hide">
                {faculty.map((member, i) => {
                  const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  return (
                    <div key={i} data-anim="faculty-card" className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col items-center text-center gap-5 group hover:-translate-y-1.5 relative overflow-hidden min-w-[240px] md:min-w-0 shrink-0 snap-center lg:snap-align-none">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f2a93c]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {member.imageUrl ? (
                        <Image src={member.imageUrl} alt={member.name} width={96} height={96} className="w-24 h-24 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-[#f2a93c]/50 transition-all duration-300 shadow-xl relative z-10" />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-3xl font-bold text-white ring-2 ring-white/20 group-hover:ring-[#f2a93c]/50 transition-all duration-300 shadow-xl relative z-10">
                          {initials}
                        </div>
                      )}

                      <div className="relative z-10">
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-[#f2a93c] transition-colors">{member.name}</h3>
                        <p className="text-sm font-medium text-white/60">{member.role}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full py-20 text-center bg-white/5 backdrop-blur-sm rounded-[2rem] border border-dashed border-white/20">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-white/60 text-lg font-medium">No faculty members listed yet.</p>
              </div>
            )}

            <div className="mt-12 md:hidden flex justify-center">
              <Link href="/faculty" className="inline-flex items-center justify-center bg-[#f2a93c] text-brand-navy text-sm font-bold px-6 py-2.5 rounded-full hover:bg-brand-navy hover:text-white hover:shadow-[0_8px_20px_-4px_rgba(18,23,46,0.3)] hover:-translate-y-1 transition-all duration-300 group">
                View All Faculty <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* 7. Events Section */}
        <section id="events" className="w-full bg-surface-alt py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#12172e]/5 to-transparent skew-x-12 transform origin-bottom"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div data-anim="events-heading" className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <span className="inline-block border border-[#f2a93c]/20 text-[#f2a93c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow-sm bg-[#f2a93c]/5">Happenings</span>
                <h2 className="font-display text-[44px] md:text-[52px] leading-[1.1] font-bold text-brand-navy tracking-tight">
                  Upcoming Events
                </h2>
                <p className="text-text-secondary text-xl mt-6 max-w-xl mx-auto md:mx-0 leading-relaxed">
                  Participate in seminars, workshops, and meetups organized by CUPC.
                </p>
              </div>
              <Link href="/events" className="hidden md:inline-flex items-center justify-center bg-white border border-[#e2e2ea] text-brand-navy text-sm font-bold px-8 py-4 rounded-full hover:bg-brand-navy hover:text-white hover:border-brand-navy hover:shadow-[0_8px_20px_-4px_rgba(18,23,46,0.2)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy transition-all duration-300 group shrink-0">
                View All Events <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dbEvents.map((event, i) => (
                <div key={i} data-anim="event-card" className="bg-white border border-[#e2e2ea] rounded-[2rem] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#12172e]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-surface-alt flex items-center justify-center text-brand-navy group-hover:bg-[#12172e] group-hover:text-white transition-colors duration-300 shadow-sm">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#f2a93c]">Event</span>
                  </div>

                  <h3 className="text-2xl font-bold text-brand-navy mb-3 group-hover:text-[#f2a93c] transition-colors">{event.title}</h3>
                  <p className="text-sm font-bold text-[#12172e]/60 mb-6 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#f2a93c] mr-2"></span>{new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  <p className="text-text-secondary text-lg leading-relaxed mt-auto">{event.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 md:hidden flex justify-center">
              <Link href="/events" className="inline-flex items-center justify-center bg-white border border-[#e2e2ea] text-brand-navy text-sm font-bold px-8 py-4 rounded-full hover:bg-brand-navy hover:text-white hover:border-brand-navy hover:shadow-[0_8px_20px_-4px_rgba(18,23,46,0.2)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy transition-all duration-300 group">
                View All Events <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* 8. Footer */}
      <footer data-anim="footer" className="w-full bg-[#0a0f1d] py-20 pb-[calc(112px+env(safe-area-inset-bottom))] md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a2149] rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f2a93c] rounded-full blur-[120px] opacity-5"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">

          <div className="relative group mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#f2a93c]/20 to-teal-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Image src="/CUPC_logo.jpg" alt="CUPC Logo" width={80} height={80} className="rounded-2xl object-contain bg-white p-1.5 mix-blend-screen opacity-90 relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:scale-105 transition-transform duration-500" />
          </div>

          <h2 className="font-display text-3xl font-bold text-white mb-3 tracking-tight">Chittagong University Physics Club</h2>
          <p className="text-white/60 text-lg mb-10 tracking-wide">Discovering the universe through physics</p>

          <div className="inline-block border border-white/10 px-6 py-2 rounded-full mb-16 bg-white/5 backdrop-blur-sm">
            <p className="text-white font-bold tracking-widest text-sm">EST. 2026</p>
          </div>

          <div className="flex items-center gap-10 mb-16">
            <a href="https://www.facebook.com/cuphysicsclub/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#f2a93c] transition-colors hover:-translate-y-1 hover:scale-105 duration-300 transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="mailto:pr.cupc@gmail.com" className="text-white/50 hover:text-[#f2a93c] transition-colors hover:-translate-y-1 hover:scale-105 duration-300 transform">
              <Mail className="w-7 h-7" />
              <span className="sr-only">Contact</span>
            </a>
            <a href="#" className="text-white/50 hover:text-[#f2a93c] transition-colors hover:-translate-y-1 hover:scale-105 duration-300 transform">
              <MapPin className="w-7 h-7" />
              <span className="sr-only">Location</span>
            </a>
          </div>

          <div className="w-full border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/50">
            <p>© {new Date().getFullYear()} CUPC. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/terms" className="hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 pb-1">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 pb-1">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}