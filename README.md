# Chittagong University Physics Club (CUPC) Platform

The digital home for CUPC members to Learn, Research, Develop, Connect, and Grow. Built with Next.js 14, Supabase, Prisma, and NextAuth.

## Features

- **Role-Based Authentication**: Secure login and registration for Students, Alumni, and Faculty.
- **Admin Approval Workflow**: All new accounts require admin approval to access the community features.
- **Community Feed**: Rich-text post creation (using Tiptap), comments, and reactions.
- **Content Moderation**: Users can flag inappropriate content, which admins can review and soft-delete from the dashboard.
- **Event Listings**: Admin-curated event listings (Upcoming and Past).
- **Resource Library**: Community-contributed resources and links with Supabase Storage integration for file uploads.
- **Member Directory**: Searchable directory of all approved members.
- **Mentorship System**: Students can request mentorship from Alumni and Faculty.
- **Notifications**: In-app notification center for key events (approvals, mentorship requests).
- **Achievements Showcase**: A static showcase of club and individual achievements.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Database**: [Supabase PostgreSQL](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) (Credentials Provider)
- **File Storage**: Supabase Storage
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **Validation**: [Zod](https://zod.dev/)

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ and `pnpm` (or `npm`)
- A [Supabase](https://supabase.com) account and project

### 2. Environment Variables
Create a `.env.local` file in the root directory based on `.env.example` (or configure these in your deployment platform).

```env
# Database URLs (from Supabase Database settings)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Authentication
# Run `npx auth secret` to generate a secure random string
AUTH_SECRET="your-secure-random-string"

# Supabase Storage Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 3. Database Setup

Once your `.env.local` is configured, push the Prisma schema to your database and generate the Prisma Client:

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 4. Supabase Storage Setup

For the Resource Library file uploads to work, you must:
1. Go to your Supabase Dashboard -> Storage.
2. Create a new bucket named **`resources`**.
3. Make the bucket **Public**.
4. (Optional) Set up Storage policies to restrict uploads to authenticated users.

### 5. Running the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Admin Initialization (Local Testing)

By default, new users have a `PENDING` status and `STUDENT` role. To test admin features locally:

1. Register an account via the UI (`/register`).
2. Open your Supabase Dashboard -> Table Editor -> `User` table.
3. Find your registered user and change the `status` to `APPROVED` and `role` to `ADMIN`.
4. Log in via the UI (`/login`). You will now have access to the Admin Dashboard and can approve other users.

---

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the Environment Variables (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Vercel will automatically detect the Prisma setup, run the build script, and deploy your application.

> **Note**: Ensure that the database connection pooler (`DATABASE_URL`) has `pgbouncer=true` appended to the connection string for serverless environments.

---

## Future Enhancements

- Integrate **Resend** or a similar service to send real email notifications for account approvals and mentorship requests.
- Move the Achievements showcase to a dynamic, database-driven CMS.
- Enhance post interactions with image galleries and link previews.
