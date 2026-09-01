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
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.profileImage || ""} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-semibold">{post.author.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {post.author.role} • {post.author.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canDelete && (
                  <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Post
                  </DropdownMenuItem>
                )}
                <ReportDialog
                  postId={post.id}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
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
          className="prose dark:prose-invert max-w-none text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {/* Images would render here */}
      </CardContent>

      <CardFooter className="flex flex-col border-t p-0">
        <div className="flex items-center justify-between w-full p-2 px-4 border-b">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 h-8 px-2 ${isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground"}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              {likeCount > 0 && <span>{likeCount}</span>}
              <span className="sr-only sm:not-sr-only sm:inline">Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-8 px-2 text-muted-foreground"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4" />
              {post.comments.length > 0 && <span>{post.comments.length}</span>}
              <span className="sr-only sm:not-sr-only sm:inline">Comment</span>
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="w-full bg-muted/20 p-4 space-y-4">
            {/* Comment Form */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 gap-2 flex flex-col">
                <Textarea
                  placeholder="Write a comment..."
                  className="min-h-[60px] resize-none"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleCommentSubmit} disabled={isSubmitting || !commentContent.trim()}>
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 pt-4">
              {post.comments.map((comment: PostComment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.profileImage || ""} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      <div className="font-semibold mb-1 flex justify-between items-center">
                        <span>{comment.author.name}</span>
                        <ReportDialog
                          commentId={comment.id}
                          trigger={
                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive">
                              <Flag className="h-3 w-3" />
                            </Button>
                          }
                        />
                      </div>
                      <p>{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 pl-1 text-xs text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
