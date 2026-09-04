import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EditProfileForm } from "./edit-form";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      role: true,
      availableForMentorship: true,
      bio: true,
      department: true,
      profileImage: true,
      coverImage: true,
      socialLinks: true,
      phone: true,
      education: true,
      experience: true,
      projects: true,
      publications: true,
      achievements: true,
      mentorExpertise: true,
    }
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-navy mb-2">Edit Profile</h1>
        <p className="text-text-secondary">Update your basic information and links.</p>
      </div>

      {/* Passing data to a client component for the form */}
      <EditProfileForm initialData={user} />
    </div>
  );
}
