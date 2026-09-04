"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AcademicCard } from "@/components/ui/academic-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function EditProfileForm({ initialData }: { initialData: Record<string, unknown> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: (initialData.name as string) || "",
    bio: (initialData.bio as string) || "",
    department: (initialData.department as string) || "",
    coverImage: (initialData.coverImage as string) || "",
    profileImage: (initialData.profileImage as string) || "",
    availableForMentorship: (initialData.availableForMentorship as boolean) || false,
    phone: (initialData.phone as string) || "",
    education: (initialData.education as unknown[]) || [],
    experience: (initialData.experience as unknown[]) || [],
    projects: (initialData.projects as unknown[]) || [],
    publications: (initialData.publications as unknown[]) || [],
    achievements: (initialData.achievements as unknown[]) || [],
    socialLinks: (initialData.socialLinks as unknown[]) || [],
    mentorExpertise: (initialData.mentorExpertise as string[]) || [],
    researchAreas: (initialData.researchAreas as string[]) || [],
  });


  const [rawJsonInputs, setRawJsonInputs] = useState<Record<string, string>>(() => {
    const inputs: Record<string, string> = {};
    [
      "education", "experience", "projects", "publications", "achievements", "socialLinks"
    ].forEach(key => {
      inputs[key] = JSON.stringify(initialData[key as keyof typeof initialData] || [], null, 2);
    });
    return inputs;
  });
  
  const [rawMentorExpertise, setRawMentorExpertise] = useState(() => ((initialData.mentorExpertise as string[]) || []).join(", "));
  const [rawResearchAreas, setRawResearchAreas] = useState(() => ((initialData.researchAreas as string[]) || []).join(", "));

  const syncJsonToForm = (id: string, value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) setFormData(prev => ({...prev, [id]: parsed}));
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = { ...formData };

      // Merge latest raw JSON state on submit (handles active focus / Enter key)
      Object.entries(rawJsonInputs).forEach(([key, value]) => {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            (submissionData as any)[key] = parsed;
          }
        } catch {}
      });

      // Merge latest expertise
      submissionData.mentorExpertise = rawMentorExpertise
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

    submissionData.researchAreas = rawResearchAreas
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
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
    <AcademicCard className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-brand-navy border-b border-[#e2e2ea] pb-2">Basic Info</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-brand-navy font-semibold">Name</Label>
            <Input 
              id="name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="bg-white border-[#e2e2ea] text-brand-navy focus-visible:ring-brand-navy/20"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department" className="text-brand-navy font-semibold">Department</Label>
            <Input 
              id="department"
              value={formData.department}
              onChange={e => setFormData({...formData, department: e.target.value})}
              className="bg-white border-[#e2e2ea] text-brand-navy focus-visible:ring-brand-navy/20"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio" className="text-brand-navy font-semibold">Bio</Label>
            <Textarea 
              id="bio"
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="bg-white border-[#e2e2ea] text-brand-navy focus-visible:ring-brand-navy/20 min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium text-brand-navy border-b border-[#e2e2ea] pb-2">Images</h3>
          <p className="text-xs text-text-secondary">For now, provide direct image URLs. Full upload system planned.</p>
          
          <div className="grid gap-2">
            <Label htmlFor="profileImage" className="text-brand-navy font-semibold">Avatar URL</Label>
            <Input 
              id="profileImage"
              type="url"
              value={formData.profileImage}
              onChange={e => setFormData({...formData, profileImage: e.target.value})}
              className="bg-white border-[#e2e2ea] text-brand-navy focus-visible:ring-brand-navy/20"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coverImage" className="text-brand-navy font-semibold">Cover Image URL</Label>
            <Input 
              id="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={e => setFormData({...formData, coverImage: e.target.value})}
              className="bg-white border-[#e2e2ea] text-brand-navy focus-visible:ring-brand-navy/20"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium text-brand-navy border-b border-[#e2e2ea] pb-2">Contact & Arrays (Raw JSON Edit)</h3>
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-brand-navy font-semibold">Phone</Label>
            <Input 
              id="phone"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="bg-white border-[#e2e2ea] text-brand-navy focus-visible:ring-brand-navy/20"
            />
          </div>
          {[ 
            { id: "education", label: "Education" }, 
            { id: "experience", label: "Experience" }, 
            { id: "projects", label: "Projects" }, 
            { id: "publications", label: "Publications" }, 
            { id: "achievements", label: "Achievements" }, 
            { id: "socialLinks", label: "Social Links" } 
          ].map(({ id, label }) => (
            <div key={id} className="grid gap-2">
              <Label htmlFor={id} className="text-brand-navy font-semibold">{label} (JSON Array)</Label>
              <Textarea 
                id={id}
                value={rawJsonInputs[id]}
                onChange={e => setRawJsonInputs(prev => ({...prev, [id]: e.target.value}))}
                onBlur={e => syncJsonToForm(id, e.target.value)}
                className="bg-white border-[#e2e2ea] text-brand-navy focus-visible:ring-brand-navy/20 min-h-[100px] font-mono text-sm"
              />
            </div>
          ))}
        </div>

        {(initialData.role === "ALUMNI" || initialData.role === "FACULTY") && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium text-brand-navy border-b border-[#e2e2ea] pb-2">Mentorship Expertise</h3>
            <div className="grid gap-2">
              <Label htmlFor="mentorExpertise" className="text-brand-navy font-semibold">Expertise (Comma-separated)</Label>
              <Input 
                id="mentorExpertise"
                value={rawMentorExpertise}
                onChange={e => setRawMentorExpertise(e.target.value)}
                onBlur={e => setFormData(prev => ({...prev, mentorExpertise: e.target.value.split(",").map(s => s.trim()).filter(Boolean)}))}
                className="bg-white border-[#e2e2ea] text-brand-navy focus-visible:ring-brand-navy/20"
              />
            </div>
          </div>
        )}

        {initialData.role === "FACULTY" && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium text-brand-navy border-b border-[#e2e2ea] pb-2">Research Areas</h3>
            <div className="grid gap-2">
              <Label htmlFor="researchAreas" className="text-brand-navy font-semibold">Areas (Comma-separated)</Label>
              <Input 
                id="researchAreas"
                value={rawResearchAreas}
                onChange={e => setRawResearchAreas(e.target.value)}
                className="bg-white border-[#e2e2ea] text-brand-navy focus-visible:ring-brand-navy/20"
              />
            </div>
          </div>
        )}

        {initialData.role === "ALUMNI" && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium text-brand-navy border-b border-[#e2e2ea] pb-2">Mentorship</h3>
            
            <div className="flex items-start space-x-3 pt-2">
              <div className="flex items-center h-5">
                <input
                  id="availableForMentorship"
                  type="checkbox"
                  checked={formData.availableForMentorship}
                  onChange={e => setFormData({...formData, availableForMentorship: e.target.checked})}
                  className="w-4 h-4 text-amber-500 bg-white border-[#e2e2ea] rounded focus:ring-amber-500 focus:ring-2"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="availableForMentorship" className="text-brand-navy font-semibold cursor-pointer">
                  Available for Mentorship
                </Label>
                <p className="text-xs text-text-secondary mt-1">
                  Allow students to find you in the mentor directory and request mentorship.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 flex gap-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-white font-medium"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
            className="border-[#e2e2ea] text-text-secondary hover:bg-[#12172e]/5"
          >
            Cancel
          </Button>
        </div>

      </form>
    </AcademicCard>
  );
}
