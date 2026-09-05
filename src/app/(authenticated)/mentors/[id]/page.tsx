import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { RequestMentorshipForm } from "./request-form";
import { ProfileHero } from "@/components/profile/profile-hero";
import { TimelineSection } from "@/components/profile/timeline-section";
import { Education, Experience } from "@/types/profile";

export default async function MentorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) redirect("/login");

  const mentor = await prisma.user.findUnique({
    where: {
      id: id,
      status: "APPROVED",
      availableForMentorship: true
    },
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
      mentorExpertise: true,
      education: true,
      experience: true,
    },
  });

  if (!mentor) notFound();

  // Type assertions for JSON fields
  const education = mentor.education as unknown as Education[];
  const experience = mentor.experience as unknown as Experience[];

  const existingRequest = await prisma.mentorshipRequest.findFirst({
    where: {
      requesterId: session.user.id,
      mentorId: mentor.id,
    }
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-0">
      <ProfileHero user={mentor} isSelf={false} />

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-12">
          <TimelineSection education={education} experience={experience} />
        </div>

        <div className="space-y-6">
          <div className="bg-surface-card border border-[#e2e2ea] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-brand-navy mb-4">Request Mentorship</h3>
            {existingRequest ? (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-sm font-medium text-amber-800">
                  Status: {existingRequest.status}
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  You have already sent a request to this mentor.
                </p>
              </div>
            ) : (
              <RequestMentorshipForm mentorId={mentor.id} mentorName={mentor.name} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
