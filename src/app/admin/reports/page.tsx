import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { dismissReport, removeContentAndDismissReport } from "@/app/actions/admin-reports";

export default async function AdminReportsPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/feed");
  }

  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      reporter: { select: { name: true } },
      post: { select: { id: true, content: true, author: { select: { name: true } } } },
      comment: { select: { id: true, content: true, author: { select: { name: true } } } },
      resource: { select: { id: true, title: true, author: { select: { name: true } } } },
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Flagged Content</h1>

      {reports.length === 0 ? (
        <p className="text-muted-foreground">No pending reports.</p>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => {
            const isPost = !!report.post;
            const isComment = !!report.comment;
            const isResource = !!report.resource;

            let contentType = "UNKNOWN";
            let contentSnippet = "";
            let authorName = "";
            let contentId = "";

            if (isPost) {
              contentType = "POST";
              contentSnippet = report.post!.content.replace(/<[^>]*>?/gm, "").substring(0, 150) + "...";
              authorName = report.post!.author.name;
              contentId = report.post!.id;
            } else if (isComment) {
              contentType = "COMMENT";
              contentSnippet = report.comment!.content;
              authorName = report.comment!.author.name;
              contentId = report.comment!.id;
            } else if (isResource) {
              contentType = "RESOURCE";
              contentSnippet = report.resource!.title;
              authorName = report.resource!.author.name;
              contentId = report.resource!.id;
            }

            return (
              <Card key={report.id} className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Reported {contentType}</CardTitle>
                      <CardDescription>
                        Reported by {report.reporter.name} • {formatDistanceToNow(new Date(report.createdAt))} ago
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm font-medium">
                    Reason: {report.reason}
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-xs text-muted-foreground mb-2">Content by {authorName}:</p>
                    <p className="text-sm">{contentSnippet}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <form action={async () => {
                    "use server";
                    await dismissReport(report.id);
                  }}>
                    <Button type="submit" variant="outline">Dismiss Report</Button>
                  </form>
                  <form action={async () => {
                    "use server";
                    await removeContentAndDismissReport(report.id, contentType as "POST" | "COMMENT" | "RESOURCE", contentId);
                  }}>
                    <Button type="submit" variant="destructive">Remove Content</Button>
                  </form>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
