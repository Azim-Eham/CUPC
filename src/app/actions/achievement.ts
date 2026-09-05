"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addAchievement(data: {
  title: string;
  description: string;
  date: string;
  type: string;
}) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.achievement.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        type: data.type,
      },
    });

    revalidatePath("/achievements");
    return { success: true };
  } catch (err) {
    console.error("Failed to add achievement:", err);
    return { error: "Failed to add achievement" };
  }
}
