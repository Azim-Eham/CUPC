import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ProfileHero } from "@/components/profile/profile-hero";
import { TimelineSection } from "@/components/profile/timeline-section";
import { ProjectsSection } from "@/components/profile/projects-section";
import { PublicationsSection } from "@/components/profile/publications-section";
import { AchievementsSection } from "@/components/profile/achievements-section";
import { Education, Experience, Project, Publication, Achievement } from "@/types/profile";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: id, status: "APPROVED" },
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      department: true,
      profileImage: true,
      coverImage: true,
      availableForMentorship: true,
      bio: true,
      designation: true,
      organization: true,
      currentPosition: true,
      graduationYear: true,
      batch: true,
      socialLinks: true,
      studentId: true,
      phone: true,
      researchAreas: true,
      mentorExpertise: true,
      education: true,
      experience: true,
      projects: true,
      publications: true,
      achievements: true,
    },
  });

  if (!user) notFound();

  const isSelf = session.user.id === user.id;

  // Type assertions for JSON fields
  const education = user.education as unknown as Education[];
  const experience = user.experience as unknown as Experience[];
  const projects = user.projects as unknown as Project[];
  const publications = user.publications as unknown as Publication[];
  const achievements = user.achievements as unknown as Achievement[];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <ProfileHero user={user} isSelf={isSelf} />
      
      <div className="space-y-12">
        
        {user.role === 'FACULTY' && user.researchAreas && user.researchAreas.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-6 pl-2">Research Areas</h3>
            <div className="flex flex-wrap gap-2 px-2">
              {user.researchAreas.map((area: string, i: number) => (
                <Badge key={i} variant="secondary">{area}</Badge>
              ))}
            </div>
          </div>
        )}

        {(user.role === 'ALUMNI' || user.role === 'FACULTY') && user.availableForMentorship && user.mentorExpertise && user.mentorExpertise.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-6 pl-2">Mentorship Expertise</h3>
            <div className="flex flex-wrap gap-2 px-2">
              {user.mentorExpertise.map((expertise: string, i: number) => (
                <Badge key={i} variant="secondary">{expertise}</Badge>
              ))}
            </div>
          </div>
        )}

        <TimelineSection education={education} experience={experience} />
        <ProjectsSection projects={projects} />
        <PublicationsSection publications={publications} />
        <AchievementsSection achievements={achievements} />
      </div>
    </div>
  );
}
