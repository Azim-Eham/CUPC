"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "@/app/actions/event";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export function CreateEventDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: new Date(formData.get("date") as string),
      venue: formData.get("venue") as string,
      category: formData.get("category") as string,
      coverImage: coverImage || undefined,
    };

    const result = await createEvent(data);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Event created successfully");
      (e.target as HTMLFormElement).reset();
      setCoverImage(null);
      setIsOpen(false);
    }

    setIsSubmitting(false);
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="bg-brand-navy hover:bg-brand-navy/90">
        <Plus className="w-4 h-4 mr-2" />
        Create Event
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-navy">Create New Event</h2>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input id="title" name="title" required placeholder="e.g. Annual Tech Symposium" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time *</Label>
              <Input id="date" name="date" type="datetime-local" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select id="category" name="category" required className="w-full h-10 px-3 py-2 rounded-md border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20">
                <option value="WORKSHOP">Workshop</option>
                <option value="SEMINAR">Seminar</option>
                <option value="COMPETITION">Competition</option>
                <option value="SOCIAL">Social</option>
                <option value="MEETING">Meeting</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" placeholder="e.g. Main Auditorium" />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="border border-[#e2e2ea] rounded-xl p-4">
              <ImageUpload
                value={coverImage || ""}
                onChange={(url) => setCoverImage(url)}
                folder="covers"
                label="Event Cover"
                fallbackIcon="image"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" required rows={5} placeholder="Describe the event details..." />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-navy hover:bg-brand-navy/90">
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}