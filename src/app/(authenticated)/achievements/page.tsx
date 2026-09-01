import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Trophy, Star } from "lucide-react";

// Mock data for achievements. In a real app, this would be in the database.
const ACHIEVEMENTS = [
  {
    id: "1",
    title: "National Physics Olympiad Winners",
    description: "CUPC members secured 1st and 3rd positions in the 2025 National Physics Olympiad.",
    date: "2025-05-15",
    type: "trophy",
  },
  {
    id: "2",
    title: "Best Science Club Award",
    description: "Awarded the Best Science Club of the Year by the University Administration.",
    date: "2024-12-10",
    type: "star",
  },
  {
    id: "3",
    title: "Published Research Paper",
    description: "A group of senior members published their undergraduate thesis in the Journal of Applied Physics.",
    date: "2024-08-22",
    type: "award",
  },
];

export default async function AchievementsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Club Achievements</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Celebrating the excellence, hard work, and dedication of the Chittagong University Physics Club community.
        </p>
      </div>

      <div className="space-y-6">
        {ACHIEVEMENTS.map((achievement) => (
          <Card key={achievement.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="bg-primary/5 p-8 flex items-center justify-center md:w-48 shrink-0 border-b md:border-b-0 md:border-r">
                {achievement.type === "trophy" && <Trophy className="h-16 w-16 text-primary" />}
                {achievement.type === "star" && <Star className="h-16 w-16 text-primary" />}
                {achievement.type === "award" && <Award className="h-16 w-16 text-primary" />}
              </div>
              <div className="flex-1">
                <CardHeader>
                  <div className="text-sm font-medium text-muted-foreground mb-1">{new Date(achievement.date).getFullYear()}</div>
                  <CardTitle className="text-2xl">{achievement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
