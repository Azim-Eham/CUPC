import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function MentorsDirectoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const isAuthenticated = true;

  const mentors = await prisma.user.findMany({
    where: {
      status: "APPROVED",
      availableForMentorship: true,
      role: { in: ["ALUMNI", "FACULTY"] },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      role: true,
      department: true,
      profileImage: true,
      designation: true,
      organization: true,
      currentPosition: true,
      graduationYear: true,
      mentorExpertise: true,
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16 md:pb-0 min-h-screen bg-surface-base font-sans">
      <div className="bg-surface-navy w-full py-16 px-6 rounded-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="w-1.5 h-1.5 rounded-full bg-[#f2a93c]"></div>
               <span className="text-text-inverse-muted text-xs font-medium uppercase tracking-wider">CUPC Network</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-text-inverse mb-4">Mentorship Directory</h1>
            <p className="text-text-inverse-muted text-lg max-w-xl">
              Connect with Alumni who have volunteered to guide current students.
            </p>
          </div>
          {(session.user.role === "ALUMNI" || session.user.role === "FACULTY") && (
            <div className="bg-surface-navy-light/50 border border-white/10 rounded-2xl p-6 max-w-sm w-full backdrop-blur">
              <h3 className="text-text-inverse font-bold mb-2">Want to become a mentor?</h3>
              <p className="text-sm text-text-inverse-muted mb-4">Alumni and Faculty can opt-in to mentorship from their profile settings.</p>
              <div className="flex gap-4">
                <Link href="/profile" className="text-sm text-[#f2a93c] font-semibold hover:underline">Update Profile →</Link>
                <Link href="/mentorship-dashboard" className="text-sm text-white font-semibold hover:underline">View Dashboard →</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
        {mentors.length === 0 ? (
          <div className="text-center py-24 bg-surface-alt rounded-2xl border border-dashed border-[#e2e2ea]">
            <Search className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-text-primary font-bold text-lg">No mentors found</p>
            <p className="text-text-secondary mt-1">Check back soon as alumni join the platform.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => {
               const initials = mentor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
               return (
                <div key={mentor.id} className="bg-surface-card border border-[#e2e2ea] rounded-2xl p-6 flex flex-col h-full hover:shadow-[0_4px_20px_-2px_rgba(18,23,46,0.05)] transition-shadow">
                  <div className="flex items-center gap-4 mb-4 border-b border-[#e2e2ea] pb-4">
                    {mentor.profileImage ? (
                       <img src={mentor.profileImage} alt={mentor.name} className="w-16 h-16 rounded-full object-cover shrink-0 bg-surface-alt" />
                    ) : (
                      <div className="w-16 h-16 shrink-0 rounded-full bg-[#12172e] flex items-center justify-center text-xl font-bold text-text-inverse">
                        {initials}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-brand-navy">{mentor.name}</h3>
                      <p className="text-sm text-text-secondary">{mentor.currentPosition || "Alumni Mentor"}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {mentor.organization && (
                        <span className="px-2.5 py-1 rounded-full bg-[#12172e]/5 text-[#12172e] text-xs font-semibold capitalize">{mentor.organization}</span>
                      )}
                      {mentor.graduationYear && (
                        <span className="px-2.5 py-1 rounded-full bg-[#f7f7fb] text-text-secondary text-xs font-medium">Class of {mentor.graduationYear}</span>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#f2a93c] uppercase tracking-wider mb-2">Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.mentorExpertise && mentor.mentorExpertise.length > 0 ? (
                          mentor.mentorExpertise.map((exp, i) => (
                            <span key={i} className="bg-surface-alt text-text-secondary px-2 py-1 rounded-md text-xs">{exp}</span>
                          ))
                        ) : (
                          <span className="text-sm text-text-secondary">General Guidance</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#e2e2ea]">
                    <Link href={`/mentors/${mentor.id}`} className="w-full flex items-center justify-center bg-surface-alt hover:bg-neutral-200 text-brand-navy font-semibold py-3 rounded-full transition-colors">
                      View Profile & Request
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
