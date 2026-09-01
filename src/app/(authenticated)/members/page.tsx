import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Role, UserStatus } from "@prisma/client";

export default async function MembersDirectoryPage({
  searchParams,
}: {
  searchParams: { role?: string; q?: string };
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { role, q } = searchParams;

  const whereClause: {
    status: UserStatus;
    role?: Role;
    OR?: Array<{ name: { contains: string; mode: "insensitive" } } | { department: { contains: string; mode: "insensitive" } }>;
  } = {
    status: "APPROVED",
  };

  if (role && role !== "all") {
    whereClause.role = role as Role;
  }

  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { department: { contains: q, mode: "insensitive" } },
    ];
  }

  const members = await prisma.user.findMany({
    where: whereClause,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      role: true,
      department: true,
      profileImage: true,
      batch: true,
      designation: true,
      organization: true,
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Member Directory</h1>
        <p className="text-muted-foreground mt-2">Connect with students, alumni, and faculty.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form className="flex-1 flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q || ""}
            placeholder="Search by name or department..."
            className="flex h-9 w-full sm:max-w-[300px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <select
            name="role"
            defaultValue={role || "all"}
            className="flex h-9 w-[150px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="ALUMNI">Alumni</option>
            <option value="FACULTY">Faculty</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            Filter
          </button>
        </form>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          <p className="text-muted-foreground">No members found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-0 items-center text-center">
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarImage src={member.profileImage || ""} />
                  <AvatarFallback className="text-lg">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-base truncate w-full" title={member.name}>
                  {member.name}
                </CardTitle>
                <Badge variant={member.role === "FACULTY" ? "default" : "secondary"} className="mt-1">
                  {member.role}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-4 text-center text-sm text-muted-foreground">
                <p className="truncate" title={member.department}>{member.department}</p>
                {member.role === "STUDENT" && member.batch && (
                  <p>Batch: {member.batch}</p>
                )}
                {member.role === "FACULTY" && member.designation && (
                  <p className="truncate">{member.designation}</p>
                )}
                {member.role === "ALUMNI" && member.organization && (
                  <p className="truncate">{member.organization}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
