import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import dynamic from "next/dynamic";

const CreatePost = dynamic(() => import("@/components/post/create-post").then(mod => mod.CreatePost), {
    loading: () => <div className="h-32 bg-surface-alt animate-pulse rounded-2xl" />
});
import { PostCard } from "@/components/post/post-card";
import { redirect } from "next/navigation";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

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

  // Sanitization happens client-side in PostCard
  const sanitizedPosts = posts;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Community Feed</h1>
        <p className="text-text-secondary">Share your research, ask questions, and connect.</p>
      </div>

      <CreatePost />

      <StaggerReveal className="space-y-8 mt-12">
        {sanitizedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={session.user.id}
            currentUserRole={session.user.role}
          />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-text-secondary py-12">No posts yet. Be the first to share something!</p>
        )}
      </StaggerReveal>
    </div>
  );
}
