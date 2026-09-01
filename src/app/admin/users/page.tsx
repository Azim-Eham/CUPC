import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { approveUser, rejectUser } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

export default async function AdminUsersPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/feed");
  }

  const pendingUsers = await prisma.user.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Pending Approvals</h1>

      {pendingUsers.length === 0 ? (
        <p className="text-muted-foreground">No pending users to approve.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-1">
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Department:</strong> {user.department}</p>
                  {user.studentId && <p><strong>Student ID:</strong> {user.studentId}</p>}
                  {user.batch && <p><strong>Batch:</strong> {user.batch}</p>}
                  {user.session && <p><strong>Session:</strong> {user.session}</p>}
                </div>

                <div className="flex space-x-2 pt-4">
                  <form action={async () => {
                    "use server";
                    await approveUser(user.id);
                  }}>
                    <Button type="submit" variant="default">Approve</Button>
                  </form>
                  <form action={async () => {
                    "use server";
                    await rejectUser(user.id);
                  }}>
                    <Button type="submit" variant="destructive">Reject</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
