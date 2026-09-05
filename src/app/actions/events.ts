"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const venue = formData.get("venue") as string;
    const category = formData.get("category") as string;
    const coverImage = formData.get("coverImage") as string;

    if (!title || !description || !dateStr || !category) {
      throw new Error("Missing required fields");
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(dateStr),
        venue: venue || null,
        category,
        coverImage: coverImage || null,
        createdById: session.user.id,
        isPublished: true,
      },
    });

    revalidatePath("/events");
    return { success: true, event };
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: "Failed to create event" };
  }
}