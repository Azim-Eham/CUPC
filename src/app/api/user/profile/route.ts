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
        // Extend here to update json arrays for portfolio
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
