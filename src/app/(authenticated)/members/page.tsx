import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Role, UserStatus } from "@prisma/client";
import { GlassCard } from "@/components/ui/glass-card";
import { StaggerReveal, StaggerItem } from "@/components/ui/stagger-reveal";

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
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Member Directory</h1>
        <p className="text-zinc-400">Connect with students, alumni, and faculty.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
        <form className="flex-1 flex flex-col sm:flex-row gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q || ""}
            placeholder="Search by name or department..."
            className="flex h-10 w-full rounded-full border border-white/10 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-50 shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700"
          />
          <div className="flex gap-2">
            <select
              name="role"
              defaultValue={role || "all"}
              className="flex h-10 w-full sm:w-[150px] rounded-full border border-white/10 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-50 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 appearance-none"
            >
              <option value="all" className="bg-zinc-900 text-zinc-50">All Roles</option>
              <option value="STUDENT" className="bg-zinc-900 text-zinc-50">Students</option>
              <option value="ALUMNI" className="bg-zinc-900 text-zinc-50">Alumni</option>
              <option value="FACULTY" className="bg-zinc-900 text-zinc-50">Faculty</option>
            </select>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 px-6 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-16 bg-black/20 rounded-2xl border border-white/5">
          <p className="text-zinc-500">No members found matching your criteria.</p>
        </div>
      ) : (
        <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <StaggerItem key={member.id}>
              <Link href={`/profile/${member.id}`} className="block h-full">
              <GlassCard className="overflow-hidden hover:border-amber-500/30 transition-colors group h-full">
                <CardHeader className="p-6 pb-0 items-center text-center border-none">
                  <Avatar className="h-24 w-24 mb-4 border border-white/10 bg-black/20 group-hover:border-amber-500/30 transition-colors">
                    <AvatarImage src={member.profileImage || ""} />
                    <AvatarFallback className="text-xl bg-transparent text-zinc-400">{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-medium text-zinc-50 truncate w-full" title={member.name}>
                    {member.name}
                  </CardTitle>
                  <Badge variant="outline" className={`mt-2 border-white/10 ${member.role === "FACULTY" ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-zinc-400"}`}>
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent className="p-6 pt-4 text-center text-sm text-zinc-400">
                  <p className="truncate" title={member.department}>{member.department}</p>
                  {member.role === "STUDENT" && member.batch && (
                    <p className="text-zinc-500 mt-1">Batch {member.batch}</p>
                  )}
                  {member.role === "FACULTY" && member.designation && (
                    <p className="truncate text-zinc-500 mt-1">{member.designation}</p>
                  )}
                  {member.role === "ALUMNI" && member.organization && (
                    <p className="truncate text-zinc-500 mt-1">{member.organization}</p>
                  )}
                </CardContent>
              </GlassCard>
              </Link>
            </StaggerItem>
          ))}
        </StaggerReveal>
      )}
    </div>
  );
}
