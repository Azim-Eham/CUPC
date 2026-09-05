import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { ArrowLeft, Mail, BookOpen, GraduationCap, Link as LinkIcon, Building2 } from "lucide-react";
import { PublicNavbar } from "@/components/public-navbar";
import { AuthenticatedNavbar } from "@/components/authenticated-navbar";
import facultyData from "../../../../../faculty/cu_physics_faculty.json";

export default async function FacultyProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  const isAuthenticated = !!session?.user?.id;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        {isAuthenticated ? <AuthenticatedNavbar session={session} /> : <PublicNavbar />}
        <main className="flex-1 min-h-screen bg-surface-base font-sans pt-32 pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center bg-white p-12 rounded-2xl shadow-sm border border-[#e2e2ea]">
            <h1 className="text-2xl font-bold text-brand-navy mb-4">Authentication Required</h1>
            <p className="text-text-secondary mb-8">Please log in to view detailed faculty profiles.</p>
            <Link href={`/login?from=/faculty/${params.id}`} className="bg-brand-navy hover:bg-brand-navy/90 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Log In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Parse ID (fac-1 -> index 0)
  const idParts = params.id.split('-');
  const index = parseInt(idParts[1]) - 1;
  const member = facultyData.faculty_members[index];

  if (!member) {
    notFound();
  }

  const getInitials = (name: string) => {
    const cleanName = name.replace(/^(Dr\.|Mr\.|Miss\.|Professor\s*Dr\.|Professor)\s*/, '');
    const parts = cleanName.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const role = member.designation + (member.notes === "Chairman" ? " & Chairman" : "");

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated ? <AuthenticatedNavbar session={session} /> : <PublicNavbar />}
      <main className="flex-1 pb-16 md:pb-0 min-h-screen bg-surface-base font-sans">
        {/* Header */}
        <div className="bg-surface-navy w-full py-12 px-6 pt-24">
          <div className="max-w-4xl mx-auto">
            <Link href="/faculty" className="inline-flex items-center text-text-inverse-muted hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Link>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {member.image_url ? (
                <img src={member.image_url} alt={member.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-xl bg-white border-4 border-white/10" />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#12172e] border-4 border-white/10 flex items-center justify-center text-5xl font-bold text-white shadow-xl">
                  {getInitials(member.name)}
                </div>
              )}
              
              <div className="text-center md:text-left flex-1">
                <div className="inline-block px-3 py-1 rounded-full bg-[#f2a93c]/20 text-[#f2a93c] text-sm font-semibold mb-4">
                  {facultyData.department}
                </div>
                <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2">{member.name}</h1>
                <p className="text-[#f2a93c] text-xl font-medium mb-4">{role}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-text-inverse-muted">
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2 opacity-70" />
                    <span>{facultyData.institution}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto py-12 px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#e2e2ea]">
                <h2 className="text-xl font-bold text-brand-navy mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-3 text-[#f2a93c]" />
                  About
                </h2>
                <div className="prose prose-neutral max-w-none text-text-secondary">
                  <p>
                    {member.name} is a {member.designation.toLowerCase()} in the Department of {facultyData.department} at {facultyData.institution}.
                    {member.notes ? ` Special notes: ${member.notes}.` : ''}
                  </p>
                </div>
              </section>

              <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#e2e2ea]">
                <h2 className="text-xl font-bold text-brand-navy mb-6 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-3 text-[#f2a93c]" />
                  Academic Profile
                </h2>
                <div className="space-y-4 text-text-secondary">
                  <p>Detailed academic background and research publications are available on the official university profile portal.</p>
                  
                  {member.profile_url && (
                    <a 
                      href={member.profile_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-brand-navy font-semibold hover:text-[#f2a93c] transition-colors"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      View Official CU Profile (EIN: {member.ein})
                    </a>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e2e2ea]">
                <h3 className="font-bold text-brand-navy mb-4">Contact Info</h3>
                <div className="space-y-4">
                  {member.email ? (
                    <div>
                      <p className="text-sm font-medium text-text-secondary mb-1 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </p>
                      {member.email.split(';').map((email, i) => {
                        const cleanEmail = email.trim().replace(',', '');
                        return (
                          <a key={i} href={`mailto:${cleanEmail}`} className="block text-brand-navy hover:text-[#f2a93c] font-medium break-all">
                            {cleanEmail}
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-text-secondary mb-1 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </p>
                      <p className="text-text-primary italic text-sm">Not publicly listed</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
