import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        bio: data.bio,
        department: data.department,
        coverImage: data.coverImage,
        profileImage: data.profileImage,
        availableForMentorship: typeof data.availableForMentorship === 'boolean' ? data.availableForMentorship : undefined,
        phone: data.phone,
        socialLinks: data.socialLinks,
        education: data.education,
        experience: data.experience,
        projects: data.projects,
        publications: data.publications,
        achievements: data.achievements,
        mentorExpertise: data.mentorExpertise ? Array.isArray(data.mentorExpertise) ? data.mentorExpertise.map(String) : [] : undefined,
        researchAreas: data.researchAreas ? Array.isArray(data.researchAreas) ? data.researchAreas.map(String) : [] : undefined,
      },
    });

    const { passwordHash, ...safeUser } = updated;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
