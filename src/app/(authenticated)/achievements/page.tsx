import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy, Star } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StaggerReveal, StaggerItem } from "@/components/ui/stagger-reveal";

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
      <div className="text-center mb-16">
        <h1 className="text-3xl font-medium tracking-tight mb-4">Club Achievements</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Celebrating the excellence, hard work, and dedication of the Chittagong University Physics Club community.
        </p>
      </div>

      <StaggerReveal className="space-y-6">
        {ACHIEVEMENTS.map((achievement) => (
          <StaggerItem key={achievement.id}>
            <GlassCard className="overflow-hidden group hover:border-white/20 transition-colors">
              <div className="flex flex-col md:flex-row">
                <div className="bg-black/20 p-8 flex items-center justify-center md:w-48 shrink-0 border-b md:border-b-0 md:border-r border-white/5">
                  {achievement.type === "trophy" && <Trophy className="h-12 w-12 text-amber-500/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />}
                  {achievement.type === "star" && <Star className="h-12 w-12 text-amber-500/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />}
                  {achievement.type === "award" && <Award className="h-12 w-12 text-amber-500/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />}
                </div>
                <div className="flex-1 p-2">
                  <CardHeader>
                    <div className="text-xs font-mono text-zinc-500 mb-2">{new Date(achievement.date).getFullYear()}</div>
                    <CardTitle className="text-xl font-medium text-zinc-50">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 leading-relaxed">{achievement.description}</p>
                  </CardContent>
                </div>
              </div>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </div>
  );
}
