"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function EditProfileForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    bio: initialData.bio || "",
    department: initialData.department || "",
    coverImage: initialData.coverImage || "",
    profileImage: initialData.profileImage || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/profile");
        router.refresh();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-zinc-100 border-b border-white/5 pb-2">Basic Info</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-zinc-400">Name</Label>
            <Input 
              id="name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="bg-black/20 border-white/10 text-zinc-100"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department" className="text-zinc-400">Department</Label>
            <Input 
              id="department"
              value={formData.department}
              onChange={e => setFormData({...formData, department: e.target.value})}
              className="bg-black/20 border-white/10 text-zinc-100"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio" className="text-zinc-400">Bio</Label>
            <Textarea 
              id="bio"
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="bg-black/20 border-white/10 text-zinc-100 min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium text-zinc-100 border-b border-white/5 pb-2">Images</h3>
          <p className="text-xs text-zinc-500">For now, provide direct image URLs. Full upload system planned.</p>
          
          <div className="grid gap-2">
            <Label htmlFor="profileImage" className="text-zinc-400">Avatar URL</Label>
            <Input 
              id="profileImage"
              type="url"
              value={formData.profileImage}
              onChange={e => setFormData({...formData, profileImage: e.target.value})}
              className="bg-black/20 border-white/10 text-zinc-100"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coverImage" className="text-zinc-400">Cover Image URL</Label>
            <Input 
              id="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={e => setFormData({...formData, coverImage: e.target.value})}
              className="bg-black/20 border-white/10 text-zinc-100"
            />
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
            className="border-white/10 text-zinc-300 hover:bg-white/5"
          >
            Cancel
          </Button>
        </div>

      </form>
    </GlassCard>
  );
}
