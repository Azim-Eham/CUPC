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
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Community Feed</h1>

      <CreatePost />

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={session.user.id}
            currentUserRole={session.user.role}
          />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No posts yet. Be the first to share something!</p>
        )}
      </div>
    </div>
  );
}
