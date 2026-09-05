"use client";

import { useState, useRef } from "react";
import { Upload, X, User, Image as ImageIcon } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Uses public env vars for client-side storage upload
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: "avatars" | "covers";
  label: string;
  fallbackIcon: "user" | "image";
}

export function ImageUpload({ value, onChange, folder, label, fallbackIcon }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (15MB = 15 * 1024 * 1024 bytes)
    if (file.size > 15 * 1024 * 1024) {
      alert("File size exceeds 15MB limit.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // 2. Upload to Supabase Storage bucket named 'profiles'
      const { error: uploadError, data } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 3. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const Icon = fallbackIcon === "user" ? User : ImageIcon;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label}
              className={`object-cover border border-[#e2e2ea] bg-slate-50 ${fallbackIcon === 'user' ? 'w-24 h-24 rounded-full' : 'w-48 h-24 rounded-md'}`}
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-2 -right-2 bg-white border border-[#e2e2ea] rounded-full p-1 shadow-sm text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className={`flex items-center justify-center border-2 border-dashed border-[#e2e2ea] bg-slate-50 text-slate-500 ${fallbackIcon === 'user' ? 'w-24 h-24 rounded-full' : 'w-48 h-24 rounded-md'}`}>
            <Icon className="w-8 h-8 opacity-50" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-[#e2e2ea] rounded-md text-brand-navy hover:bg-slate-50 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
          </button>
          <p className="text-xs text-text-secondary">
            JPG, PNG or GIF.
          </p>
        </div>
      </div>
    </div>
  );
}