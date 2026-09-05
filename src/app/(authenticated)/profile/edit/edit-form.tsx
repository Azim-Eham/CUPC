/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AcademicCard } from "@/components/ui/academic-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";

import { Plus, X } from "lucide-react";

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
    education: Array.isArray(initialData.education) ? initialData.education : [],
    experience: Array.isArray(initialData.experience) ? initialData.experience : [],
    projects: Array.isArray(initialData.projects) ? initialData.projects : [],
    publications: Array.isArray(initialData.publications) ? initialData.publications : [],
    certificates: Array.isArray(initialData.achievements) ? initialData.achievements : [],
    socialLinks: Array.isArray(initialData.socialLinks) ? initialData.socialLinks : [],
    mentorExpertise: (initialData.mentorExpertise as string[]) || [],
    researchAreas: (initialData.researchAreas as string[]) || [],
  });


  const [rawMentorExpertise, setRawMentorExpertise] = useState(() => ((initialData.mentorExpertise as string[]) || []).join(", "));
  const [rawResearchAreas, setRawResearchAreas] = useState(() => ((initialData.researchAreas as string[]) || []).join(", "));


  // Handlers for dynamic array fields
  const addArrayItem = (field: string, defaultItem: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof formData] as any[]), defaultItem]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const newArray = [...(prev[field as keyof typeof formData] as any[])];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const updateArrayItem = (field: string, index: number, key: string, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[field as keyof typeof formData] as any[])];
      if (typeof newArray[index] === 'object') {
        newArray[index] = { ...newArray[index], [key]: value };
      } else {
        newArray[index] = value;
      }
      return { ...prev, [field]: newArray };
    });
  };

  const updateSimpleArrayItem = (field: string, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[field as keyof typeof formData] as any[])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = { ...formData };

      // Map certificates back to achievements for the backend
      (submissionData as any).achievements = submissionData.certificates;

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
    <AcademicCard className="p-6 md:p-8">
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
          <p className="text-xs text-text-secondary">Upload your profile and cover images.</p>

          <div className="grid gap-2">
            <Label className="text-brand-navy font-semibold">Avatar Image</Label>
            <ImageUpload
              value={formData.profileImage}
              onChange={(url) => setFormData({ ...formData, profileImage: url })}
              folder="avatars"
              label="Avatar Image"
              fallbackIcon="user"
            />
          </div>

          <div className="grid gap-2 pt-2">
            <Label className="text-brand-navy font-semibold">Cover Image</Label>
            <ImageUpload
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
              folder="covers"
              label="Cover Image"
              fallbackIcon="image"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium text-brand-navy border-b border-[#e2e2ea] pb-2">Experience & Achievements</h3>
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-brand-navy font-semibold">Phone</Label>
            <Input 
              id="phone"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="bg-white border-[#e2e2ea] text-brand-navy focus-visible:ring-brand-navy/20"
            />
          </div>
          {/* Education - BD System */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-brand-navy font-semibold">Education</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("education", { degree: "SSC", institution: "", year: "", result: "" })}>
                <Plus className="w-4 h-4 mr-1" /> Add Education
              </Button>
            </div>
            {formData.education.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-start border border-[#e2e2ea] p-3 rounded-md bg-slate-50">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <select
                    aria-label="Degree"
                    className="flex h-10 w-full rounded-md border border-[#e2e2ea] bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/20"
                    value={item.degree || "SSC"}
                    onChange={e => updateArrayItem("education", idx, "degree", e.target.value)}
                  >
                    <option value="JSC">JSC/JDC</option>
                    <option value="SSC">SSC/Dakhil/O-Level</option>
                    <option value="HSC">HSC/Alim/A-Level</option>
                    <option value="BSc">BSc/BA/BBA/Honours</option>
                    <option value="MSc">MSc/MA/MBA/Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                  <Input aria-label="Institution" placeholder="Institution" value={item.institution || ""} onChange={e => updateArrayItem("education", idx, "institution", e.target.value)} />
                  <Input aria-label="Passing Year" placeholder="Passing Year" value={item.year || ""} onChange={e => updateArrayItem("education", idx, "year", e.target.value)} />
                  <Input aria-label="Result" placeholder="Result (GPA/CGPA)" value={item.result || ""} onChange={e => updateArrayItem("education", idx, "result", e.target.value)} />
                </div>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove item" onClick={() => removeArrayItem("education", idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-brand-navy font-semibold">Experience</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("experience", { role: "", company: "", duration: "" })}>
                <Plus className="w-4 h-4 mr-1" /> Add Experience
              </Button>
            </div>
            {formData.experience.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-start border border-[#e2e2ea] p-3 rounded-md bg-slate-50">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <Input aria-label="Role / Position" placeholder="Role / Position" value={item.role || ""} onChange={e => updateArrayItem("experience", idx, "role", e.target.value)} />
                  <Input aria-label="Company / Organization" placeholder="Company / Organization" value={item.company || ""} onChange={e => updateArrayItem("experience", idx, "company", e.target.value)} />
                  <Input aria-label="Duration" className="col-span-2" placeholder="Duration (e.g. Jan 2022 - Present)" value={item.duration || ""} onChange={e => updateArrayItem("experience", idx, "duration", e.target.value)} />
                </div>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove item" onClick={() => removeArrayItem("experience", idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-brand-navy font-semibold">Projects</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("projects", { name: "", description: "", link: "" })}>
                <Plus className="w-4 h-4 mr-1" /> Add Project
              </Button>
            </div>
            {formData.projects.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-start border border-[#e2e2ea] p-3 rounded-md bg-slate-50">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <Input aria-label="Project Name" placeholder="Project Name" value={item.name || ""} onChange={e => updateArrayItem("projects", idx, "name", e.target.value)} />
                  <Input aria-label="Link" placeholder="Link (Optional)" value={item.link || ""} onChange={e => updateArrayItem("projects", idx, "link", e.target.value)} />
                  <textarea
                    aria-label="Description"
                    placeholder="Description"
                    value={item.description || ""}
                    onChange={e => updateArrayItem("projects", idx, "description", e.target.value)}
                    className="col-span-2 flex min-h-[60px] w-full rounded-md border border-[#e2e2ea] bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/20"
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove item" onClick={() => removeArrayItem("projects", idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Publications */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-brand-navy font-semibold">Publications</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("publications", { title: "", publisher: "", link: "" })}>
                <Plus className="w-4 h-4 mr-1" /> Add Publication
              </Button>
            </div>
            {formData.publications.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-start border border-[#e2e2ea] p-3 rounded-md bg-slate-50">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <Input aria-label="Title" className="col-span-2" placeholder="Title" value={item.title || ""} onChange={e => updateArrayItem("publications", idx, "title", e.target.value)} />
                  <Input aria-label="Conference / Journal" placeholder="Conference / Journal" value={item.publisher || ""} onChange={e => updateArrayItem("publications", idx, "publisher", e.target.value)} />
                  <Input aria-label="Link" placeholder="Link (Optional)" value={item.link || ""} onChange={e => updateArrayItem("publications", idx, "link", e.target.value)} />
                </div>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove item" onClick={() => removeArrayItem("publications", idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Certificates */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-brand-navy font-semibold">Certificates</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("certificates", { name: "", issuer: "", year: "" })}>
                <Plus className="w-4 h-4 mr-1" /> Add Certificate
              </Button>
            </div>
            {formData.certificates.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-start border border-[#e2e2ea] p-3 rounded-md bg-slate-50">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <Input aria-label="Certificate Name" className="col-span-2" placeholder="Certificate Name" value={item.name || (typeof item === 'string' ? item : "")} onChange={e => updateArrayItem("certificates", idx, "name", e.target.value)} />
                  <Input aria-label="Issuer" placeholder="Issuer" value={item.issuer || ""} onChange={e => updateArrayItem("certificates", idx, "issuer", e.target.value)} />
                  <Input aria-label="Year" placeholder="Year" value={item.year || ""} onChange={e => updateArrayItem("certificates", idx, "year", e.target.value)} />
                </div>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove item" onClick={() => removeArrayItem("certificates", idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-brand-navy font-semibold">Social Links</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("socialLinks", "")}>
                <Plus className="w-4 h-4 mr-1" /> Add Link
              </Button>
            </div>
            {formData.socialLinks.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input aria-label="Social Link URL" placeholder="https://..." value={typeof item === 'string' ? item : (item.url || "")} onChange={e => updateSimpleArrayItem("socialLinks", idx, e.target.value)} />
                <Button type="button" variant="ghost" size="icon" aria-label="Remove item" onClick={() => removeArrayItem("socialLinks", idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
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
