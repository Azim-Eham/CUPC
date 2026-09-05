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
