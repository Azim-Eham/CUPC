"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { createPost } from "@/app/actions/post";
import { toast } from "sonner";
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, List, ListOrdered, Quote } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { AcademicCard } from "@/components/ui/academic-card";

export function CreatePost() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[120px] w-full bg-transparent px-2 py-2 text-base text-brand-navy placeholder:text-text-secondary focus-visible:outline-none prose prose-brand max-w-none border-0",
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
    <AcademicCard className="mb-8">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center gap-1 border-b border-[#e2e2ea] bg-surface-alt p-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5" onClick={toggleAction(() => editor.chain().focus().toggleBold().run())} data-active={editor.isActive("bold") ? "" : undefined}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5" onClick={toggleAction(() => editor.chain().focus().toggleItalic().run())} data-active={editor.isActive("italic") ? "" : undefined}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5" onClick={toggleAction(() => editor.chain().focus().toggleStrike().run())} data-active={editor.isActive("strike") ? "" : undefined}>
            <Strikethrough className="h-4 w-4" />
          </Button>
          <div className="mx-2 h-4 w-[1px] bg-[#e2e2ea]" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5" onClick={toggleAction(() => editor.chain().focus().toggleHeading({ level: 1 }).run())} data-active={editor.isActive("heading", { level: 1 }) ? "" : undefined}>
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5" onClick={toggleAction(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} data-active={editor.isActive("heading", { level: 2 }) ? "" : undefined}>
            <Heading2 className="h-4 w-4" />
          </Button>
          <div className="mx-2 h-4 w-[1px] bg-[#e2e2ea]" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5" onClick={toggleAction(() => editor.chain().focus().toggleBulletList().run())} data-active={editor.isActive("bulletList") ? "" : undefined}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5" onClick={toggleAction(() => editor.chain().focus().toggleOrderedList().run())} data-active={editor.isActive("orderedList") ? "" : undefined}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5" onClick={toggleAction(() => editor.chain().focus().toggleBlockquote().run())} data-active={editor.isActive("blockquote") ? "" : undefined}>
            <Quote className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
        <div className="flex items-center justify-end border-t border-[#e2e2ea] bg-surface-alt p-3">
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-brand-navy text-white hover:bg-brand-navy-light rounded-full font-medium shadow-[0_8px_20px_-4px_rgba(18,23,46,0.3)] hover:-translate-y-0.5 transition-all">
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </AcademicCard>
  );
}
