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

export async function approveUser(userId: string) {
  try {
    await requireAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: { status: "APPROVED" },
    });

    // TODO: Send approval email notification

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
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
  } catch (error) {
    return { error: "Failed to reject user." };
  }
}
