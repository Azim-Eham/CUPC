# Email Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement zero-cost email notifications for registration, admin approval, and new events.

**Architecture:** Use `nodemailer` with a Gmail App Password. This is completely free and requires no domain verification. Hook into existing Server Actions (`auth.ts`, `admin.ts`, `event.ts`) to trigger emails.

**Tech Stack:** Next.js (Server Actions), Node.js (Nodemailer), Prisma (for fetching bulk users).

**Spec:** User registration alerts admins. Admin approval alerts user. Event creation alerts all approved users. Must be 100% free.

## Global Constraints

- Must use free services only (Gmail SMTP via `nodemailer`).
- Note: Gmail limits 500 emails/day. Ponytail: scalable enough for club startup, swap for external provider (Resend) when limit hit.

---

### Task 1: Setup Nodemailer Utility

**Files:**
- Create: `src/lib/email.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: `sendAdminNotification`, `sendApprovalEmail`, `sendBulkEventEmail`

- [ ] **Step 1: Install dependencies**

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

- [ ] **Step 2: Add env vars to `.env.example`**

```env
# Email Configuration (Requires Gmail App Password)
GMAIL_USER=your-club-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

- [ ] **Step 3: Create the email utility**

```typescript
// src/lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ponytail: basic wrappers, add templates when these get too complex
export async function sendAdminNotification(userName: string, userEmail: string) {
  // admin email target: process.env.GMAIL_USER
  await transporter.sendMail({
    to: process.env.GMAIL_USER, 
    subject: "New Registration on CUPC",
    html: `<p>New user registered: ${userName} (${userEmail}). Please review in admin dashboard.</p>`,
  });
}

export async function sendApprovalEmail(toEmail: string, userName: string) {
  await transporter.sendMail({
    to: toEmail,
    subject: "Your CUPC Account is Approved",
    html: `<p>Hi ${userName}, your account has been approved. You can now log in.</p>`,
  });
}

export async function sendBulkEventEmail(bccEmails: string[], eventTitle: string) {
  await transporter.sendMail({
    to: process.env.GMAIL_USER, // Self
    bcc: bccEmails,
    subject: `New Event: ${eventTitle}`,
    html: `<p>A new event "<strong>${eventTitle}</strong>" has been posted. Check the website for details!</p>`,
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/email.ts .env.example package.json package-lock.json
git commit -m "feat: setup nodemailer for free email automation"
```

### Task 2: Hook Registration Email

**Files:**
- Modify: `src/app/actions/auth.ts`

**Interfaces:**
- Consumes: `sendAdminNotification` from `src/lib/email.ts`

- [ ] **Step 1: Modify `registerUser` to send email**

```typescript
import { sendAdminNotification } from "@/lib/email";

// ... inside registerUser, after prisma.user.create ...
try {
  await sendAdminNotification(validatedData.name, validatedData.email);
} catch (error) {
  console.error("Failed to send admin notification", error);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/actions/auth.ts
git commit -m "feat: trigger admin email on new registration"
```

### Task 3: Hook Approval Email

**Files:**
- Modify: `src/app/actions/admin.ts`

**Interfaces:**
- Consumes: `sendApprovalEmail` from `src/lib/email.ts`

- [ ] **Step 1: Modify `approveUser` to send email**

```typescript
import { sendApprovalEmail } from "@/lib/email";

// ... inside approveUser, replace prisma.user.update with:
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { status: "APPROVED" },
  select: { email: true, name: true }
});

try {
  await sendApprovalEmail(updatedUser.email, updatedUser.name);
} catch (error) {
  console.error("Failed to send approval email", error);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/actions/admin.ts
git commit -m "feat: trigger user email on account approval"
```

### Task 4: Hook Event Bulk Email

**Files:**
- Modify: `src/app/actions/event.ts`

**Interfaces:**
- Consumes: `sendBulkEventEmail` from `src/lib/email.ts`

- [ ] **Step 1: Modify `createEvent` to send bulk email**

```typescript
import { sendBulkEventEmail } from "@/lib/email";

// ... inside createEvent, after prisma.event.create ...
try {
  // Fetch all APPROVED users
  const users = await prisma.user.findMany({
    where: { status: "APPROVED" },
    select: { email: true },
  });
  
  const emails = users.map(u => u.email);
  
  if (emails.length > 0) {
    // ponytail: BCC chunking needed if > 500 users for Gmail limits.
    await sendBulkEventEmail(emails, data.title);
  }
} catch (error) {
  console.error("Failed to send bulk event email", error);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/actions/event.ts
git commit -m "feat: trigger bulk email on new event creation"
```