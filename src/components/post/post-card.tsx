"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
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
import { AcademicCard } from "@/components/ui/academic-card";
import { StaggerItem } from "@/components/ui/stagger-reveal";

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
  images: string[];
  createdAt: Date;
  authorId: string;
  author: PostAuthor;
  reactions: Reaction[];
  comments: PostComment[];
}

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
      <AcademicCard className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar className="border border-[#e2e2ea]">
                <AvatarImage src={post.author.profileImage || ""} />
                <AvatarFallback className="bg-surface-alt text-brand-navy">{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base font-semibold text-brand-navy">{post.author.name}</CardTitle>
                <p className="text-sm text-text-secondary">
                  {post.author.role} • {post.author.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-10 w-10 md:h-8 md:w-8 p-0 text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5 rounded-full" />}>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-[#e2e2ea] text-text-secondary">
                  {canDelete && (
                    <DropdownMenuItem className="text-red-500 cursor-pointer focus:bg-red-50 focus:text-red-600" onClick={handleDelete} disabled={isDeleting}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Post
                    </DropdownMenuItem>
                  )}
                  <ReportDialog
                    postId={post.id}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer focus:bg-[#12172e]/5 focus:text-brand-navy">
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
            className="prose prose-brand max-w-none text-base leading-relaxed text-brand-navy mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {post.images.map((url, i) => {
                const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                return (
                  <div key={i} className="rounded-lg overflow-hidden border border-[#e2e2ea] bg-slate-50">
                    {isVideo ? (
                      <video src={url} className="w-full h-auto max-h-[400px] object-contain" controls />
                    ) : (
                      <Image src={url} alt="Post attachment" width={800} height={400} className="w-full h-auto max-h-[400px] object-cover" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col border-t border-[#e2e2ea] p-0">
          <div className="flex items-center justify-between w-full p-2 px-4 border-b border-[#e2e2ea]">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 h-10 px-4 md:h-8 md:px-3 rounded-full transition-colors group ${isLiked ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50" : "text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5"}`}
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 transition-colors ${isLiked ? "fill-current" : "group-hover:text-rose-500"}`} />
                {likeCount > 0 && <span>{likeCount}</span>}
                <span className="sr-only sm:not-sr-only sm:inline">Like</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-10 px-4 md:h-8 md:px-3 rounded-full text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5 transition-colors"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageSquare className="h-4 w-4" />
                {post.comments.length > 0 && <span>{post.comments.length}</span>}
                <span className="sr-only sm:not-sr-only sm:inline">Comment</span>
              </Button>
            </div>
          </div>

          {showComments && (
            <div className="w-full bg-surface-alt p-4 space-y-4 rounded-b-2xl">
              {/* Comment Form */}
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 border border-[#e2e2ea]">
                  <AvatarFallback className="bg-surface-base text-brand-navy font-medium">U</AvatarFallback>
                </Avatar>
                <div className="flex-1 gap-2 flex flex-col">
                  <Textarea
                    placeholder="Write a comment..."
                    className="min-h-[60px] resize-none bg-white border-[#e2e2ea] text-brand-navy placeholder:text-text-secondary focus-visible:ring-brand-navy/20 shadow-sm"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleCommentSubmit} disabled={isSubmitting || !commentContent.trim()} className="bg-brand-navy text-white hover:bg-brand-navy-light rounded-full font-medium shadow-[0_4px_14px_0_rgba(18,23,46,0.39)] hover:-translate-y-0.5 transition-all">
                      {isSubmitting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4 pt-4">
                {post.comments.map((comment: PostComment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 border border-[#e2e2ea]">
                      <AvatarImage src={comment.author.profileImage || ""} />
                      <AvatarFallback className="bg-surface-base text-brand-navy font-medium">{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-white border border-[#e2e2ea] p-4 rounded-2xl rounded-tl-sm text-sm text-brand-navy shadow-sm">
                        <div className="font-semibold text-brand-navy mb-1 flex justify-between items-center">
                          <span>{comment.author.name}</span>
                          <ReportDialog
                            commentId={comment.id}
                            trigger={
                              <Button variant="ghost" size="sm" className="h-10 w-10 md:h-6 md:w-6 p-0 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-full">
                                <Flag className="h-3 w-3" />
                              </Button>
                            }
                          />
                        </div>
                        <p className="leading-relaxed text-text-secondary">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 pl-1 text-xs font-medium text-text-secondary">
                        <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </AcademicCard>
    </StaggerItem>
  );
}
