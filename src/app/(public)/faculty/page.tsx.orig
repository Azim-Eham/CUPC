import Link from "next/link";
import { auth } from "@/lib/auth";
import { GraduationCap } from "lucide-react";


// Hardcoded faculty list matching the homepage section
const faculty = [
  { id: "fac-1", name: "Dr. A. K. M. Rezaur Rahman", role: "Chairman & Professor", designation: "Chairman & Professor", initials: "RR", imageUrl: "" },
  { id: "fac-2", name: "Dr. Mohammed Idris Miah", role: "Professor", designation: "Professor", initials: "IM", imageUrl: "" },
  { id: "fac-3", name: "Dr. Md. Maqbul Hossain", role: "Professor", designation: "Professor", initials: "MH", imageUrl: "" },
  { id: "fac-4", name: "Dr. Mohammad Omar Faruk", role: "Professor", designation: "Professor", initials: "OF", imageUrl: "" },
  { id: "fac-5", name: "Dr. Shyamal Ranjan Chakraborty", role: "Professor", designation: "Professor", initials: "SC", imageUrl: "" },
];

export default async function FacultyDirectoryPage() {
  const session = await auth();
  const isAuthenticated = !!session?.user?.id;

  return (
    <div className="min-h-screen bg-surface-base font-sans">
      <div className="bg-surface-navy w-full py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-[#f2a93c]"></div>
             <span className="text-text-inverse-muted text-xs font-medium uppercase tracking-wider">Department of Physics</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-inverse mb-4">Faculty Members</h1>
          <p className="text-text-inverse-muted text-lg max-w-xl">
            Learn from the brilliant minds shaping the future of physics at the University of Chittagong.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
        {faculty.length === 0 ? (
          <div className="text-center py-24 bg-surface-alt rounded-2xl border border-dashed border-[#e2e2ea]">
            <GraduationCap className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-text-primary font-bold text-lg">No faculty members found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {faculty.map((member) => {
               return (
                <div key={member.id} className="bg-surface-card border border-[#e2e2ea] rounded-2xl p-6 flex flex-col h-full hover:shadow-[0_4px_20px_-2px_rgba(18,23,46,0.05)] transition-shadow text-center items-center">
                  
                  {member.imageUrl ? (
                     <img src={member.imageUrl} alt={member.name} className="w-24 h-24 rounded-full object-cover shadow-sm mb-4 bg-surface-alt" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#12172e] flex items-center justify-center text-3xl font-bold text-text-inverse mb-4 shadow-sm">
                      {member.initials}
                    </div>
                  )}
                  
                  <h3 className="text-lg font-bold text-brand-navy mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-[#f2a93c]">{member.designation}</p>

                  <div className="pt-6 mt-auto w-full">
                    {!isAuthenticated ? (
                      <Link href={`/login`} className="w-full flex items-center justify-center bg-surface-alt hover:bg-neutral-200 text-brand-navy font-semibold py-3 rounded-full transition-colors">
                        Log in to connect
                      </Link>
                    ) : (
                      <Link href={`/faculty/${member.id}`} className="w-full flex items-center justify-center bg-surface-alt hover:bg-neutral-200 text-brand-navy font-semibold py-3 rounded-full transition-colors">
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
