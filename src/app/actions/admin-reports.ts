"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function dismissReport(reportId: string) {
  try {
    await requireAdmin();

    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: "DISMISSED",
        reviewedAt: new Date(),
      },
    });

    revalidatePath("/admin/reports");
    return { success: true };
  } catch {
    return { error: "Failed to dismiss report." };
  }
}

export async function removeContentAndDismissReport(
  reportId: string,
  contentType: "POST" | "COMMENT" | "RESOURCE",
  contentId: string
) {
  try {
    await requireAdmin();

    // 1. Mark content as removed/deleted
    if (contentType === "POST") {
      await prisma.post.update({
        where: { id: contentId },
        data: { isRemoved: true },
      });
    } else if (contentType === "COMMENT") {
      await prisma.comment.delete({
        where: { id: contentId },
      });
    } else if (contentType === "RESOURCE") {
      await prisma.resource.update({
        where: { id: contentId },
        data: { isRemoved: true },
      });
    }

    // 2. Mark ALL pending reports for this content as reviewed
    const updateData = {
      status: "REVIEWED",
      reviewedAt: new Date(),
    };

    if (contentType === "POST") {
      await prisma.report.updateMany({
        where: { postId: contentId, status: "PENDING" },
        data: updateData,
      });
    } else if (contentType === "COMMENT") {
      await prisma.report.updateMany({
        where: { commentId: contentId, status: "PENDING" },
        data: updateData,
      });
    } else if (contentType === "RESOURCE") {
      await prisma.report.updateMany({
        where: { resourceId: contentId, status: "PENDING" },
        data: updateData,
      });
    }

    // Fallback if the specific report wasn't caught by updateMany
    await prisma.report.updateMany({
      where: { id: reportId, status: "PENDING" },
      data: updateData,
    });

    revalidatePath("/admin/reports");
    revalidatePath("/feed");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to remove content." };
  }
}
