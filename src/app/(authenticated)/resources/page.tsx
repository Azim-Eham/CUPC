import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { FileIcon, ExternalLink, Download } from "lucide-react";
import { UploadResource } from "./upload-resource";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { category, q } = searchParams;

  const whereClause: {
    isRemoved: boolean;
    category?: string;
    OR?: Array<{ title: { contains: string; mode: "insensitive" } } | { description: { contains: string; mode: "insensitive" } }>;
  } = {
    isRemoved: false,
  };

  if (category && category !== "all") {
    whereClause.category = category;
  }

  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const resources = await prisma.resource.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold">Resource Library</h1>
          <p className="text-muted-foreground mt-2">Study materials, notes, and useful links.</p>
        </div>
        <UploadResource />
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          <p className="text-muted-foreground">No resources found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-base line-clamp-2" title={resource.title}>
                    {resource.title}
                  </CardTitle>
                  <FileIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-2">
                  {resource.category}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {resource.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {resource.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  Added by {resource.author.name} • {formatDistanceToNow(new Date(resource.createdAt))} ago
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline w-full justify-center"
                >
                  {resource.fileType === "link" ? (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      Visit Link
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download
                    </>
                  )}
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
