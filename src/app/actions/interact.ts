"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addComment(postId: string, content: string, parentId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    if (session.user.status !== "APPROVED") throw new Error("Account not approved");

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        parentId,
        authorId: session.user.id,
      },
    });

    revalidatePath("/feed");
    return { success: true, comment };
  } catch (error) {
    return { error: "Failed to add comment." };
  }
}

export async function toggleReaction(postId: string, type: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    if (session.user.status !== "APPROVED") throw new Error("Account not approved");

    const existingReaction = await prisma.reaction.findUnique({
      where: {
        userId_postId_type: {
          userId: session.user.id,
          postId,
          type,
        },
      },
    });

    if (existingReaction) {
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      });
    } else {
      await prisma.reaction.create({
        data: {
          type,
          postId,
          userId: session.user.id,
        },
      });
    }

    revalidatePath("/feed");
    return { success: true };
  } catch (error) {
    return { error: "Failed to toggle reaction." };
  }
}
