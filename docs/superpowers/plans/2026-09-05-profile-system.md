# Profile System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive profile editing and display for Student, Alumni, and Faculty roles based on the Prisma schema.

**Architecture:** Fetch all relevant role-specific and JSON portfolio fields in the backend. Update the UI to render role-specific fields and allow editing of portfolio arrays (Education, Experience, Projects, Publications, Achievements) and Mentorship options for Alumni/Faculty.

**Tech Stack:** Next.js, Prisma, Tailwind CSS, Lucide Icons

**Spec:** The task requires full support for role-specific profile fields and array-based portfolios as defined in `prisma/schema.prisma`.

## Global Constraints

- No schema changes.
- UI must follow existing design system.
- Ensure type safety when mapping `Json` fields to TypeScript interfaces.

---

### Task 1: Update TypeScript Interfaces

**Files:**
- Modify: `src/types/profile.ts`

**Interfaces:**
- Consumes: Prisma schema Definitions.
- Produces: Complete type definitions.

- [ ] **Step 1: Add missing types**

```typescript
export interface MentorshipExpertise {
  id: string; // Add an ID for easy array manipulation in the UI
  topic: string;
}

// Add these to existing file
```

- [ ] **Step 2: Commit**

```bash
git add src/types/profile.ts
git commit -m "types: add missing profile types"
```

### Task 2: Enhance Profile Fetching (View)

**Files:**
- Modify: `src/app/(authenticated)/profile/[id]/page.tsx`

**Interfaces:**
- Consumes: `prisma.user.findUnique`
- Produces: Complete user object passed to components.

- [ ] **Step 1: Fetch missing fields**
Update the `select` block in `prisma.user.findUnique` to include:
`studentId`, `phone`, `researchAreas`, `mentorExpertise`.

- [ ] **Step 2: Commit**

```bash
git add src/app/\(authenticated\)/profile/\[id\]/page.tsx
git commit -m "feat: fetch all profile fields for view"
```

### Task 3: Enhance Profile Hero Component

**Files:**
- Modify: `src/components/profile/profile-hero.tsx`

**Interfaces:**
- Consumes: Expanded `User` object from Task 2.
- Produces: UI displaying role-specific details.

- [ ] **Step 1: Update ProfileUser type**

```typescript
type ProfileUser = Pick<User, "name" | "role" | "department" | "profileImage" | "bio" | "coverImage" | "email" | "availableForMentorship"> & {
  socialLinks?: unknown;
  organization?: string | null;
  designation?: string | null;
  graduationYear?: number | null;
  batch?: string | null;
  session?: string | null;
  studentId?: string | null;
  phone?: string | null;
};
```

- [ ] **Step 2: Add Student-specific details**
Render `studentId` and `session` if the role is STUDENT and they exist, similar to how `batch` is currently rendered.

- [ ] **Step 3: Add Phone number rendering**
Add phone number to the Details section using the `Phone` icon from lucide-react if `user.phone` is provided.

- [ ] **Step 4: Commit**

```bash
git add src/components/profile/profile-hero.tsx
git commit -m "feat: display role-specific details in hero"
```

### Task 4: Expand API Route for Profile Updates

**Files:**
- Modify: `src/app/api/user/profile/route.ts`

**Interfaces:**
- Consumes: PUT request with JSON payload.
- Produces: Updated user in database.

- [ ] **Step 1: Update API route to handle all editable fields**

Add the following fields to the Prisma update `data` object:
`phone`, `socialLinks`, `education`, `experience`, `projects`, `publications`, `achievements`, `mentorExpertise`.

Note: Since `socialLinks`, `education`, etc. are JSON in Prisma, pass them directly from the request data if they exist. For `mentorExpertise` (String[]), ensure it's passed as an array of strings.

- [ ] **Step 2: Commit**

```bash
git add src/app/api/user/profile/route.ts
git commit -m "feat: support full profile update in API"
```

### Task 5: Enhance Profile Fetching (Edit)

**Files:**
- Modify: `src/app/(authenticated)/profile/edit/page.tsx`

**Interfaces:**
- Consumes: `prisma.user.findUnique`
- Produces: Full initial data passed to `EditProfileForm`.

- [ ] **Step 1: Update select block**
Update the `select` block to fetch all editable fields:
`phone`, `socialLinks`, `education`, `experience`, `projects`, `publications`, `achievements`, `mentorExpertise`.

- [ ] **Step 2: Commit**

```bash
git add src/app/\(authenticated\)/profile/edit/page.tsx
git commit -m "feat: fetch all editable fields"
```

### Task 6: Refactor EditProfileForm for Basic Array Editing

**Files:**
- Modify: `src/app/(authenticated)/profile/edit/edit-form.tsx`

**Interfaces:**
- Consumes: Expanded `initialData`.
- Produces: Form state submitted to API.

- [ ] **Step 1: Update formData state**
Initialize `formData` with empty arrays `[]` or the existing data for the JSON array fields (education, experience, etc.) and phone number.

- [ ] **Step 2: Add JSON Field String Editor (Ponytail approach)**
Since building 5 separate complex dynamic array builders (with inputs for institution, degree, year, etc.) is a massive UI task, use a simplified "Advanced Raw Edit" `Textarea` for the JSON arrays (education, experience, projects, publications, achievements, socialLinks) for now, which parses/stringifies JSON.
Add a standard Input for `phone`.

```tsx
// ponytail: raw JSON edit for arrays, full form builder if user demands UI.
```

- [ ] **Step 3: Add `mentorExpertise` (Array of Strings) Editor**
If role is ALUMNI or FACULTY, add a comma-separated text input that parses into a string array on change for `mentorExpertise`.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(authenticated\)/profile/edit/edit-form.tsx
git commit -m "feat: support array and phone editing in form"
```

### Task 7: Render Mentorship & Research Areas on Profile

**Files:**
- Modify: `src/app/(authenticated)/profile/[id]/page.tsx`

**Interfaces:**
- Consumes: Expanded `User` data.
- Produces: View blocks for Mentorship Expertise and Research Areas.

- [ ] **Step 1: Render Research Areas (Faculty)**
If the user is FACULTY and has `researchAreas`, render a tag list similar to a generic skills list.

- [ ] **Step 2: Render Mentor Expertise (Alumni/Faculty)**
If the user is ALUMNI or FACULTY and `availableForMentorship` is true, and they have `mentorExpertise`, render a tag list showing their expertise.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(authenticated\)/profile/\[id\]/page.tsx
git commit -m "feat: render research areas and mentorship expertise"
```