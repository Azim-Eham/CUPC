import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RequestMentorshipForm } from "./request-form";

export default async function MentorProfilePage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const mentor = await prisma.user.findUnique({
    where: { id: params.id, availableForMentorship: true, status: "APPROVED" },
    select: {
      id: true,
      name: true,
      role: true,
      department: true,
      profileImage: true,
      bio: true,
      designation: true,
      organization: true,
      mentorExpertise: true,
      graduationYear: true,
      email: true,
    },
  });

  if (!mentor) {
    notFound();
  }

  // Check existing requests
  const existingRequest = await prisma.mentorshipRequest.findFirst({
    where: {
      requesterId: session.user.id,
      mentorId: mentor.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const isSelf = session.user.id === mentor.id;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="overflow-hidden">
        <div className="h-32 bg-primary/10"></div>
        <CardHeader className="relative pb-0 pt-0">
          <Avatar className="h-24 w-24 border-4 border-background absolute -top-12">
            <AvatarImage src={mentor.profileImage || ""} />
            <AvatarFallback className="text-2xl">{mentor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="pt-14 pb-4">
            <CardTitle className="text-2xl">{mentor.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={mentor.role === "FACULTY" ? "default" : "secondary"}>{mentor.role}</Badge>
              <span className="text-sm text-muted-foreground">{mentor.department}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {mentor.bio || "No bio provided."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {mentor.role === "FACULTY" && mentor.designation && (
              <div>
                <h3 className="font-semibold text-sm">Designation</h3>
                <p className="text-sm text-muted-foreground">{mentor.designation}</p>
              </div>
            )}
            {mentor.role === "ALUMNI" && (
              <>
                {mentor.organization && (
                  <div>
                    <h3 className="font-semibold text-sm">Current Organization</h3>
                    <p className="text-sm text-muted-foreground">{mentor.organization}</p>
                  </div>
                )}
                {mentor.graduationYear && (
                  <div>
                    <h3 className="font-semibold text-sm">Graduation Year</h3>
                    <p className="text-sm text-muted-foreground">{mentor.graduationYear}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Mentorship Expertise</h3>
            <p className="text-sm bg-muted p-3 rounded-md">
              {mentor.mentorExpertise || "General academic and career guidance."}
            </p>
          </div>

          {/* Mentorship Request Section */}
          <div className="pt-6 border-t mt-8">
            <h3 className="font-bold text-lg mb-4">Request Mentorship</h3>

            {isSelf ? (
              <p className="text-sm text-muted-foreground">This is your own profile.</p>
            ) : existingRequest?.status === "PENDING" ? (
              <div className="bg-yellow-500/10 text-yellow-600 p-4 rounded-md text-sm font-medium border border-yellow-500/20">
                You have a pending mentorship request with this mentor.
              </div>
            ) : existingRequest?.status === "ACCEPTED" ? (
              <div className="bg-green-500/10 text-green-600 p-4 rounded-md text-sm font-medium border border-green-500/20">
                You are connected with this mentor!
                <div className="mt-2 text-foreground font-normal">
                  Contact them at: <a href={`mailto:${mentor.email}`} className="underline">{mentor.email}</a>
                </div>
              </div>
            ) : (
              <RequestMentorshipForm mentorId={mentor.id} mentorName={mentor.name} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
