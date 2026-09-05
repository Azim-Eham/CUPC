# Admin Event Creation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow ADMIN users to create events directly from the events page with an image and text description.

**Architecture:** We will add a "Create Event" button to the `/events` page, visible only to ADMINs. Clicking it will open a form (either a modal or a separate page). We will create a server action for creating events, utilizing the existing Supabase storage setup for image uploads.

**Tech Stack:** Next.js App Router, React Server Components, Prisma, Tailwind CSS, Server Actions, Supabase Storage.

**Spec:** The `Event` model exists in Prisma:
`id, title, description, date, endDate?, venue?, link?, coverImage?, category, createdById, isPublished, createdAt, updatedAt`
We need an interface to populate these.

## Global Constraints

- Follow existing Next.js App Router patterns.
- Use `lucide-react` for icons.
- Ensure responsive design with Tailwind.
- Use Server Actions for data mutations.
- Use the existing Supabase image upload logic (similar to `create-post.tsx` or `upload-resource.tsx` or profile edit).

---

### Task 1: Create the Event Action and Form Component

**Files:**
- Create: `src/app/actions/events.ts`
- Create: `src/app/(authenticated)/events/create-event-dialog.tsx`

**Interfaces:**
- Consumes: Prisma `Event` model, Supabase storage bucket `cupc-images` (or whichever is used, we need to check how posts upload images).
- Produces: A dialog/modal for creating events.

- [ ] **Step 1: Write the server action for creating events**

```typescript
// src/app/actions/events.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const venue = formData.get("venue") as string;
    const category = formData.get("category") as string;
    const coverImage = formData.get("coverImage") as string;

    if (!title || !description || !dateStr || !category) {
      throw new Error("Missing required fields");
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(dateStr),
        venue: venue || null,
        category,
        coverImage: coverImage || null,
        createdById: session.user.id,
        isPublished: true,
      },
    });

    revalidatePath("/events");
    return { success: true, event };
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: "Failed to create event" };
  }
}
```

- [ ] **Step 2: Create the Event Form Dialog Component**

```tsx
// src/app/(authenticated)/events/create-event-dialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "@/app/actions/events";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { MediaUpload } from "@/components/ui/media-upload";

export function CreateEventDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    const result = await createEvent(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Event created successfully");
      setIsOpen(false);
      setCoverImage(null);
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
            <div className="border-2 border-dashed border-[#e2e2ea] rounded-xl p-4">
              <MediaUpload 
                onUploadComplete={(urls) => setCoverImage(urls[0] || null)}
                maxFiles={1}
                bucket="cupc-images"
              />
              {coverImage && (
                <div className="mt-4 relative h-40 w-full rounded-lg overflow-hidden border">
                  <img src={coverImage} alt="Cover preview" className="object-cover w-full h-full" />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => setCoverImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}
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
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/actions/events.ts" "src/app/(authenticated)/events/create-event-dialog.tsx"
git commit -m "feat: add create event action and form dialog"
```

### Task 2: Add Create Button to Events Page

**Files:**
- Modify: `src/app/(authenticated)/events/page.tsx`

**Interfaces:**
- Consumes: `CreateEventDialog` component, Auth session.

- [ ] **Step 1: Update the events page**

Modify `src/app/(authenticated)/events/page.tsx`. Import `CreateEventDialog` and render it near the header if the user is an ADMIN.

Example snippet from page.tsx:
```tsx
import { CreateEventDialog } from "./create-event-dialog";
// ... inside component ...
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-navy mb-4">Upcoming Events</h1>
      <p className="text-text-secondary text-lg max-w-xl">
        Join workshops, seminars, and networking sessions.
      </p>
    </div>
    {session.user.role === "ADMIN" && <CreateEventDialog />}
  </div>
```
*(Exact insertion point depends on the page's current layout).*

- [ ] **Step 2: Commit**

```bash
git add "src/app/(authenticated)/events/page.tsx"
git commit -m "feat: add event creation button for admins to events page"
```
