"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createResource } from "@/app/actions/resource";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function UploadResource() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "link">("file");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const category = formData.get("category") as string;

      let fileUrl = "";
      let fileType: string = uploadType;

      if (uploadType === "link") {
        fileUrl = formData.get("linkUrl") as string;
        if (!fileUrl) throw new Error("Link URL is required");
      } else {
        const file = fileInputRef.current?.files?.[0];
        if (!file) throw new Error("Please select a file to upload");

        // Basic validation (limit to 50MB)
        if (file.size > 50 * 1024 * 1024) throw new Error("File must be less than 50MB");

        const fileExt = file.name.split('.').pop();
        fileType = fileExt || "unknown";
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `resources/${fileName}`;

        // Upload to Supabase Storage (requires a bucket named "resources" configured to be public)
        const { error: uploadError, data } = await supabase.storage
          .from("resources")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          throw new Error(`Failed to upload file: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("resources")
          .getPublicUrl(filePath);

        fileUrl = publicUrlData.publicUrl;
      }

      const result = await createResource({
        title,
        description,
        category,
        fileUrl,
        fileType,
      });

      if (result.error) throw new Error(result.error);

      toast.success("Resource added successfully");
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add resource");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="h-4 w-4" />
        Add Resource
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>
              Share notes, books, or useful links with the community.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={uploadType === "file"}
                    onChange={() => setUploadType("file")}
                  />
                  File Upload
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={uploadType === "link"}
                    onChange={() => setUploadType("link")}
                  />
                  External Link
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="course-notes">Course Notes</option>
                <option value="books">Books</option>
                <option value="papers">Research Papers</option>
                <option value="tutorials">Tutorials</option>
                <option value="tools">Tools & Software</option>
                <option value="other">Other</option>
              </select>
            </div>

            {uploadType === "link" ? (
              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL *</Label>
                <Input id="linkUrl" name="linkUrl" type="url" placeholder="https://..." required />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="file">File (Max 50MB) *</Label>
                <Input id="file" name="file" type="file" ref={fileInputRef} required />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Resource"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
