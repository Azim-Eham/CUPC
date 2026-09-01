"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function reportContent(data: {
  reason: string;
  postId?: string;
  commentId?: string;
  resourceId?: string;
  reportedUserId?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.report.create({
      data: {
        reason: data.reason,
        reporterId: session.user.id,
        postId: data.postId,
        commentId: data.commentId,
        resourceId: data.resourceId,
        reportedUserId: data.reportedUserId,
      },
    });

    // TODO: Send email to admin

    return { success: true };
  } catch (error) {
    return { error: "Failed to submit report." };
  }
}
