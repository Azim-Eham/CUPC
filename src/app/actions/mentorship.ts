"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleMentorAvailability(available: boolean, expertise: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Only ALUMNI and FACULTY can be mentors
    if (session.user.role !== "ALUMNI" && session.user.role !== "FACULTY") {
      throw new Error("Only Alumni and Faculty can offer mentorship.");
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        availableForMentorship: available,
        mentorExpertise: [expertise], // simple string representation
      },
    });

    revalidatePath("/profile");
    revalidatePath("/mentors");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update availability." };
  }
}

export async function requestMentorship(mentorId: string, message: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Check if request already exists
    const existingReq = await prisma.mentorshipRequest.findFirst({
      where: {
        requesterId: session.user.id,
        mentorId: mentorId,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });

    if (existingReq) {
      return { error: "You already have an active or pending request with this mentor." };
    }

    const request = await prisma.mentorshipRequest.create({
      data: {
        requesterId: session.user.id,
        mentorId,
        message,
      },
    });

    // TODO: Send email/notification to mentor

    revalidatePath(`/mentors/${mentorId}`);
    return { success: true, request };
  } catch (error) {
    return { error: "Failed to send mentorship request." };
  }
}

export async function respondToMentorship(requestId: string, status: "ACCEPTED" | "DECLINED") {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const request = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.mentorId !== session.user.id) {
      throw new Error("Unauthorized or request not found");
    }

    await prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: { status },
    });

    // TODO: Send notification to requester

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { error: "Failed to respond to request." };
  }
}
