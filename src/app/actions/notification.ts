"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markAsRead(notificationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id, // ensure they own it
      },
      data: { isRead: true },
    });

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    return { error: "Failed to mark as read." };
  }
}

export async function markAllAsRead() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    return { error: "Failed to mark all as read." };
  }
}
