import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthenticatedNavbar } from "@/components/authenticated-navbar";
import { CreateAchievementForm } from "./create-achievement-form";

export default async function NewAchievementPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/achievements");
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <AuthenticatedNavbar session={session} />
      <main className="flex-1 w-full max-w-3xl mx-auto py-8 px-6 lg:py-12 pb-24 md:pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-navy mb-2">Add New Achievement</h1>
          <p className="text-text-secondary">Record a new milestone or award for the club.</p>
        </div>
        <CreateAchievementForm />
      </main>
    </div>
  );
}
