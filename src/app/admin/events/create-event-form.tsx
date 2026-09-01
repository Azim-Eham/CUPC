"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "@/app/actions/event";
import { toast } from "sonner";

export function CreateEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const venue = formData.get("venue") as string;
    const category = formData.get("category") as string;

    if (!title || !description || !dateStr || !category) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    const result = await createEvent({
      title,
      description,
      date: new Date(dateStr),
      venue,
      category,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Event created successfully");
      (e.target as HTMLFormElement).reset();
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <option value="seminar">Seminar</option>
          <option value="workshop">Workshop</option>
          <option value="competition">Competition</option>
          <option value="outreach">Outreach</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date & Time *</Label>
        <Input id="date" name="date" type="datetime-local" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="venue">Venue (Optional)</Label>
        <Input id="venue" name="venue" placeholder="E.g. Room 402 or Zoom Link" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" rows={4} required />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Event"}
      </Button>
    </form>
  );
}
