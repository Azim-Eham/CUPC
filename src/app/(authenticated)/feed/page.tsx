import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CreatePost } from "@/components/post/create-post";
import { PostCard } from "@/components/post/post-card";
import { redirect } from "next/navigation";

export default async function FeedPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    where: { isRemoved: false },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, role: true, department: true, profileImage: true },
      },
      reactions: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { id: true, name: true, profileImage: true },
          },
        },
      },
    },
    take: 20,
  });

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Community Feed</h1>
        <p className="text-zinc-400">Share your research, ask questions, and connect.</p>
      </div>

      <CreatePost />

      <div className="space-y-8 mt-12">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={session.user.id}
            currentUserRole={session.user.role}
          />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-zinc-500 py-12">No posts yet. Be the first to share something!</p>
        )}
      </div>
    </div>
  );
}
