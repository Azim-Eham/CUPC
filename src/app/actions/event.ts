"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendBulkEventEmail } from "@/lib/email";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createEvent(data: {
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  venue?: string;
  link?: string;
  coverImage?: string;
  category: string;
}) {
  try {
    const session = await requireAdmin();

    const event = await prisma.event.create({
      data: {
        ...data,
        createdById: session.user.id,
      },
    });

    try {
      const users = await prisma.user.findMany({
        where: { status: "APPROVED" },
        select: { email: true },
      });
      
      const emails = users.map(u => u.email).filter((e): e is string => Boolean(e));
      
      if (emails.length > 0) {
        // ponytail: BCC chunking needed if > 500 users for Gmail limits.
        await sendBulkEventEmail(emails, data.title);
      }
    } catch (error) {
      console.error("Failed to send bulk event email", error);
    }

    revalidatePath("/events");
    return { success: true, event };
  } catch {
    return { error: "Failed to create event." };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await requireAdmin();

    await prisma.event.delete({
      where: { id: eventId },
    });

    revalidatePath("/events");
    return { success: true };
  } catch {
    return { error: "Failed to delete event." };
  }
}
