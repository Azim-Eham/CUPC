# Mentor Profile and Request Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable students to view mentor profiles, request mentorship, and allow mentors to accept/decline requests from a dashboard.

**Architecture:** We will create a unified profile view for mentors that includes the mentorship request form. We will also create a dashboard for mentors to view and manage their pending requests.

**Tech Stack:** Next.js App Router, React Server Components, Prisma, Tailwind CSS.

**Spec:** Current functionality allows Alumni/Faculty to toggle availability. Students can see mentors on `/mentors` but the profile link redirects to their own profile or public profile without a request option.

## Global Constraints

- Follow existing Next.js App Router patterns.
- Use `lucide-react` for icons.
- Ensure responsive design with Tailwind.
- Use Server Actions for data mutations.

---

### Task 1: Update Mentor Profile Route

**Files:**
- Modify: `src/app/(authenticated)/mentors/[id]/page.tsx`

**Interfaces:**
- Consumes: Prisma `user` model, `requestMentorship` server action.
- Produces: A page displaying mentor details and the request form.

- [ ] **Step 1: Implement the mentor profile page**

```tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { RequestMentorshipForm } from "./request-form";
import { ProfileHero } from "@/components/profile/profile-hero";
import { TimelineSection } from "@/components/profile/timeline-section";
import { Education, Experience } from "@/types/profile";

export default async function MentorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  
  if (!session?.user?.id) redirect("/login");

  const mentor = await prisma.user.findUnique({
    where: { 
      id: id, 
      status: "APPROVED",
      availableForMentorship: true 
    },
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      department: true,
      profileImage: true,
      coverImage: true,
      availableForMentorship: true,
      bio: true,
      designation: true,
      organization: true,
      currentPosition: true,
      graduationYear: true,
      mentorExpertise: true,
      education: true,
      experience: true,
    },
  });

  if (!mentor) notFound();

  // Type assertions for JSON fields
  const education = mentor.education as unknown as Education[];
  const experience = mentor.experience as unknown as Experience[];

  const existingRequest = await prisma.mentorshipRequest.findFirst({
    where: {
      requesterId: session.user.id,
      mentorId: mentor.id,
    }
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-0">
      <ProfileHero user={mentor} isSelf={false} />
      
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-12">
          <TimelineSection education={education} experience={experience} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-surface-card border border-[#e2e2ea] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-brand-navy mb-4">Request Mentorship</h3>
            {existingRequest ? (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-sm font-medium text-amber-800">
                  Status: {existingRequest.status}
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  You have already sent a request to this mentor.
                </p>
              </div>
            ) : (
              <RequestMentorshipForm mentorId={mentor.id} mentorName={mentor.name} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/(authenticated)/mentors/[id]/page.tsx"
git commit -m "feat: implement mentor profile page with request form"
```

### Task 2: Create Mentorship Dashboard Route

**Files:**
- Create: `src/app/(authenticated)/mentorship-dashboard/page.tsx`
- Create: `src/app/(authenticated)/mentorship-dashboard/request-card.tsx`

**Interfaces:**
- Consumes: Prisma `mentorshipRequest` model, `respondToMentorship` server action.
- Produces: A dashboard for mentors to view and manage requests.

- [ ] **Step 1: Create request card component**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { respondToMentorship } from "@/app/actions/mentorship";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type RequestType = {
  id: string;
  message: string;
  status: string;
  createdAt: Date;
  requester: {
    name: string;
    profileImage: string | null;
    department: string;
    studentId: string | null;
  };
};

export function RequestCard({ request }: { request: RequestType }) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleResponse(status: "ACCEPTED" | "DECLINED") {
    setIsUpdating(true);
    const result = await respondToMentorship(request.id, status);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Request ${status.toLowerCase()} successfully.`);
    }
    setIsUpdating(false);
  }

  return (
    <div className="bg-surface-card border border-[#e2e2ea] rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-12 w-12 border border-[#e2e2ea]">
          <AvatarImage src={request.requester.profileImage || ""} />
          <AvatarFallback>{request.requester.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-bold text-brand-navy">{request.requester.name}</h4>
          <p className="text-sm text-text-secondary">{request.requester.department} {request.requester.studentId ? `| ID: ${request.requester.studentId}` : ""}</p>
          <p className="text-xs text-text-muted mt-1">{new Date(request.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
          {request.status}
        </div>
      </div>
      
      <div className="bg-surface-alt p-4 rounded-xl mb-6">
        <p className="text-sm text-text-primary whitespace-pre-wrap">{request.message}</p>
      </div>

      {request.status === "PENDING" && (
        <div className="flex gap-3">
          <Button 
            onClick={() => handleResponse("ACCEPTED")} 
            disabled={isUpdating}
            className="flex-1 bg-brand-navy text-white hover:bg-brand-navy/90"
          >
            Accept
          </Button>
          <Button 
            onClick={() => handleResponse("DECLINED")} 
            disabled={isUpdating}
            variant="outline"
            className="flex-1"
          >
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create dashboard page**

```tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RequestCard } from "./request-card";

export default async function MentorshipDashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ALUMNI" && session.user.role !== "FACULTY") {
    redirect("/feed"); // Only for mentors
  }

  const requests = await prisma.mentorshipRequest.findMany({
    where: {
      mentorId: session.user.id,
    },
    include: {
      requester: {
        select: {
          name: true,
          profileImage: true,
          department: true,
          studentId: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const pendingRequests = requests.filter(r => r.status === "PENDING");
  const pastRequests = requests.filter(r => r.status !== "PENDING");

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8 px-6 lg:px-0">
        <h1 className="font-display text-3xl font-bold text-brand-navy mb-2">Mentorship Dashboard</h1>
        <p className="text-text-secondary">Manage your mentorship requests and mentees.</p>
      </div>

      <div className="space-y-12 px-6 lg:px-0">
        <section>
          <h2 className="text-xl font-bold text-brand-navy mb-6">Pending Requests ({pendingRequests.length})</h2>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 bg-surface-alt rounded-2xl border border-dashed border-[#e2e2ea]">
              <p className="text-text-secondary">No pending requests.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {pendingRequests.map(req => (
                <RequestCard key={req.id} request={req as any} />
              ))}
            </div>
          )}
        </section>

        {pastRequests.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-brand-navy mb-6">Past Requests</h2>
            <div className="grid md:grid-cols-2 gap-6 opacity-75">
              {pastRequests.map(req => (
                <RequestCard key={req.id} request={req as any} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/(authenticated)/mentorship-dashboard"
git commit -m "feat: implement mentor dashboard for managing requests"
```

### Task 3: Update Navigation Links

**Files:**
- Modify: `src/app/(authenticated)/layout.tsx`
- Modify: `src/app/(authenticated)/mentors/page.tsx`

**Interfaces:**
- Consumes: Session context.

- [ ] **Step 1: Add Mentorship Dashboard link to layout**

Edit `src/app/(authenticated)/layout.tsx`.
Find the desktop nav links and add:
```tsx
                {(session.user.role === "ALUMNI" || session.user.role === "FACULTY") && (
                  <Link href="/mentorship-dashboard" className="relative text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 focus:text-[#f2a93c] focus-visible:text-[#f2a93c] focus:outline-none group">
                    Dashboard
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#f2a93c] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300"></span>
                  </Link>
                )}
```
Find the mobile nav links and add:
```tsx
          {(session.user.role === "ALUMNI" || session.user.role === "FACULTY") && (
            <Link href="/mentorship-dashboard" className="text-xs font-semibold text-white/90 hover:text-white flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}
```

- [ ] **Step 2: Update link in mentors directory CTA**

Edit `src/app/(authenticated)/mentors/page.tsx`.
Find the "Want to become a mentor?" box and replace the link to profile with a link to dashboard if they are already a mentor. Wait, they might still need to update their profile. Let's add both.

```tsx
          {(session.user.role === "ALUMNI" || session.user.role === "FACULTY") && (
            <div className="bg-surface-navy-light/50 border border-white/10 rounded-2xl p-6 max-w-sm w-full backdrop-blur">
              <h3 className="text-text-inverse font-bold mb-2">Want to become a mentor?</h3>
              <p className="text-sm text-text-inverse-muted mb-4">Alumni and Faculty can opt-in to mentorship from their profile settings.</p>
              <div className="flex gap-4">
                <Link href="/profile" className="text-sm text-[#f2a93c] font-semibold hover:underline">Update Profile →</Link>
                <Link href="/mentorship-dashboard" className="text-sm text-white font-semibold hover:underline">View Dashboard →</Link>
              </div>
            </div>
          )}
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/(authenticated)/layout.tsx" "src/app/(authenticated)/mentors/page.tsx"
git commit -m "feat: add mentorship dashboard navigation links"
```
