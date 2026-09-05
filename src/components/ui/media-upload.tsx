"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Film } from "lucide-react";
import { Button } from "./button";

interface MediaUploadProps {
  onUpload?: (url: string) => void;
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  bucket?: string;
  folder?: string; // Kept for compatibility but unused
}

export function MediaUpload({ onUpload, onUploadComplete }: MediaUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Keep size reasonable for Base64 DB storage (e.g., 5MB limit to avoid 413 Payload Too Large)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit for direct storage.");
      return;
    }

    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        if (onUpload) {
          onUpload(base64String);
        }
        if (onUploadComplete) {
          onUploadComplete([base64String]);
        }
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.onerror = () => {
        alert("Failed to read file.");
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Processing error:", error);
      alert("Failed to process media.");
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,video/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isProcessing}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-text-secondary hover:text-brand-navy hover:bg-[#12172e]/5 disabled:opacity-50"
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="text-xs">Processing...</span>
        ) : (
          <div className="flex gap-1 items-center">
            <ImageIcon className="h-4 w-4" />
            <Film className="h-4 w-4 ml-1" />
          </div>
        )}
      </Button>
    </div>
  );
}
