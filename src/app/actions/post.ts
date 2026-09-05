"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, images: string[] = []) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    if (session.user.status !== "APPROVED") throw new Error("Account not approved");

    const post = await prisma.post.create({
      data: {
        content,
        images,
        authorId: session.user.id,
      },
    });

    revalidatePath("/feed");
    return { success: true, post };
  } catch {
    return { error: "Failed to create post." };
  }
}

export async function deletePost(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    // Only author or admin can delete
    if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/feed");
    return { success: true };
  } catch {
    return { error: "Failed to delete post." };
  }
}
