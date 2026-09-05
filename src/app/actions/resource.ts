"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createResource(data: {
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  category: string;
  tags?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    if (session.user.status !== "APPROVED") throw new Error("Account not approved");

    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        category: data.category,
        tags: data.tags ? [data.tags] : [],
        authorId: session.user.id,
      },
    });

    revalidatePath("/resources");
    return { success: true, resource };
  } catch {
    return { error: "Failed to create resource." };
  }
}

export async function deleteResource(resourceId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { authorId: true },
    });

    if (!resource) throw new Error("Resource not found");

    if (resource.authorId !== session.user.id && session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    revalidatePath("/resources");
    return { success: true };
  } catch {
    return { error: "Failed to delete resource." };
  }
}
