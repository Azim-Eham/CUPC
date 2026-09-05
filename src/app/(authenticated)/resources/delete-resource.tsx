"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteResource } from "@/app/actions/resource";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function DeleteResource({
  resourceId,
  fileUrl
}: {
  resourceId: string;
  fileUrl: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    setIsDeleting(true);

    try {
      // 1. If it's a Supabase file, extract the path and delete it from storage
      if (fileUrl.includes("supabase.co/storage/v1/object/public/resources/")) {
        const filePath = fileUrl.split("supabase.co/storage/v1/object/public/resources/")[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from("resources")
            .remove([filePath]);

          if (storageError) {
            console.error("Storage deletion error:", storageError);
            // We continue anyway to make sure DB is clean
          }
        }
      }

      // 2. Delete from DB
      const result = await deleteResource(resourceId);
      if (result.error) throw new Error(result.error);

      toast.success("Resource deleted successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete resource");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-full ml-auto shrink-0"
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete resource"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}