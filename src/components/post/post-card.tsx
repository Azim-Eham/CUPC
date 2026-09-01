"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, MoreHorizontal, Trash2, Flag } from "lucide-react";
import { addComment, toggleReaction } from "@/app/actions/interact";
import { deletePost } from "@/app/actions/post";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ReportDialog } from "./report-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostAuthor {
  id: string;
  name: string;
  role: string;
  department: string;
  profileImage: string | null;
}

interface Reaction {
  id: string;
  userId: string;
  type: string;
}

interface CommentAuthor {
  id: string;
  name: string;
  profileImage: string | null;
}

interface PostComment {
  id: string;
  content: string;
  createdAt: Date;
  author: CommentAuthor;
}

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  author: PostAuthor;
  reactions: Reaction[];
  comments: PostComment[];
}

import { GlassCard } from "@/components/ui/glass-card";
import { StaggerItem } from "@/components/ui/stagger-reveal";

interface PostCardProps {
  post: Post;
  currentUserId: string;
  currentUserRole: string;
}

export function PostCard({ post, currentUserId, currentUserRole }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Optimistic UI state for likes (simplification of reactions to just "like" for now)
  const userLike = post.reactions.find((r: Reaction) => r.userId === currentUserId && r.type === "like");
  const [isLiked, setIsLiked] = useState(!!userLike);
  const [likeCount, setLikeCount] = useState(
    post.reactions.filter((r: Reaction) => r.type === "like").length
  );

  const canDelete = post.authorId === currentUserId || currentUserRole === "ADMIN";

  const handleLike = async () => {
    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    const result = await toggleReaction(post.id, "like");
    if (result.error) {
      toast.error(result.error);
      // Revert optimistic update
      setIsLiked(isLiked);
      setLikeCount(isLiked ? likeCount : likeCount - 1);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    const result = await addComment(post.id, commentContent);

    if (result.error) {
      toast.error(result.error);
    } else {
      setCommentContent("");
      toast.success("Comment added");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    const result = await deletePost(post.id);

    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Post deleted");
    }
  };

  return (
    <StaggerItem>
      <GlassCard className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar className="border border-white/10">
                <AvatarImage src={post.author.profileImage || ""} />
                <AvatarFallback className="bg-zinc-800 text-zinc-300">{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base font-semibold text-zinc-50">{post.author.name}</CardTitle>
                <p className="text-sm text-zinc-500">
                  {post.author.role} • {post.author.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-50 hover:bg-white/5 rounded-full" />}>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-zinc-300">
                  {canDelete && (
                    <DropdownMenuItem className="text-red-400 cursor-pointer focus:bg-white/5 focus:text-red-400" onClick={handleDelete} disabled={isDeleting}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Post
                    </DropdownMenuItem>
                  )}
                  <ReportDialog
                    postId={post.id}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer focus:bg-white/5 focus:text-zinc-50">
                        <Flag className="mr-2 h-4 w-4" />
                        Report Post
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div
            className="prose prose-invert max-w-none text-base leading-relaxed text-zinc-300 mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>

        <CardFooter className="flex flex-col border-t border-white/5 p-0">
          <div className="flex items-center justify-between w-full p-2 px-4 border-b border-white/5">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 h-8 px-3 rounded-full transition-colors group ${isLiked ? "text-rose-400 hover:text-rose-300 hover:bg-rose-400/10" : "text-zinc-400 hover:text-zinc-50 hover:bg-white/5"}`}
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 transition-colors ${isLiked ? "fill-current" : "group-hover:text-rose-400"}`} />
                {likeCount > 0 && <span>{likeCount}</span>}
                <span className="sr-only sm:not-sr-only sm:inline">Like</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-8 px-3 rounded-full text-zinc-400 hover:text-zinc-50 hover:bg-white/5 transition-colors"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageSquare className="h-4 w-4" />
                {post.comments.length > 0 && <span>{post.comments.length}</span>}
                <span className="sr-only sm:not-sr-only sm:inline">Comment</span>
              </Button>
            </div>
          </div>

          {showComments && (
            <div className="w-full bg-black/20 p-4 space-y-4 rounded-b-2xl">
              {/* Comment Form */}
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarFallback className="bg-zinc-800 text-zinc-300">U</AvatarFallback>
                </Avatar>
                <div className="flex-1 gap-2 flex flex-col">
                  <Textarea
                    placeholder="Write a comment..."
                    className="min-h-[60px] resize-none bg-zinc-900/50 border-white/10 text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleCommentSubmit} disabled={isSubmitting || !commentContent.trim()} className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 rounded-full font-medium">
                      {isSubmitting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4 pt-4">
                {post.comments.map((comment: PostComment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 border border-white/10">
                      <AvatarImage src={comment.author.profileImage || ""} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-300">{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-zinc-900/50 border border-white/5 p-3 rounded-2xl rounded-tl-sm text-sm text-zinc-300">
                        <div className="font-medium text-zinc-100 mb-1 flex justify-between items-center">
                          <span>{comment.author.name}</span>
                          <ReportDialog
                            commentId={comment.id}
                            trigger={
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-full">
                                <Flag className="h-3 w-3" />
                              </Button>
                            }
                          />
                        </div>
                        <p className="leading-relaxed">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 pl-1 text-xs text-zinc-500">
                        <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </GlassCard>
    </StaggerItem>
  );
}
