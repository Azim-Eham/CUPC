"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendApprovalEmail } from "@/lib/email";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function approveUser(userId: string) {
  try {
    await requireAdmin();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: "APPROVED" },
      select: { email: true, name: true }
    });

    try {
      await sendApprovalEmail(updatedUser.email, updatedUser.name);
    } catch (error) {
      console.error("Failed to send approval email", error);
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { error: "Failed to approve user." };
  }
}

export async function rejectUser(userId: string) {
  try {
    await requireAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: { status: "REJECTED" },
    });

    // TODO: Send rejection email notification

    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { error: "Failed to reject user." };
  }
}
