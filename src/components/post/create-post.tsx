"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { createPost } from "@/app/actions/post";
import { toast } from "sonner";
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, List, ListOrdered, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function CreatePost() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert max-w-none",
      },
    },
  });

  if (!editor) return null;

  async function handleSubmit() {
    if (editor?.isEmpty) {
      toast.error("Post content cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const content = editor?.getHTML() || "";
      const result = await createPost(content, []);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Post created successfully!");
      editor?.commands.setContent("");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const toggleAction = (action: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    action();
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleAction(() => editor.chain().focus().toggleBold().run())} data-active={editor.isActive("bold") ? "" : undefined}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleAction(() => editor.chain().focus().toggleItalic().run())} data-active={editor.isActive("italic") ? "" : undefined}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleAction(() => editor.chain().focus().toggleStrike().run())} data-active={editor.isActive("strike") ? "" : undefined}>
            <Strikethrough className="h-4 w-4" />
          </Button>
          <div className="mx-1 h-4 w-[1px] bg-border" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleAction(() => editor.chain().focus().toggleHeading({ level: 1 }).run())} data-active={editor.isActive("heading", { level: 1 }) ? "" : undefined}>
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleAction(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} data-active={editor.isActive("heading", { level: 2 }) ? "" : undefined}>
            <Heading2 className="h-4 w-4" />
          </Button>
          <div className="mx-1 h-4 w-[1px] bg-border" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleAction(() => editor.chain().focus().toggleBulletList().run())} data-active={editor.isActive("bulletList") ? "" : undefined}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleAction(() => editor.chain().focus().toggleOrderedList().run())} data-active={editor.isActive("orderedList") ? "" : undefined}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleAction(() => editor.chain().focus().toggleBlockquote().run())} data-active={editor.isActive("blockquote") ? "" : undefined}>
            <Quote className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
        <div className="flex items-center justify-end border-t bg-muted/20 p-3">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
