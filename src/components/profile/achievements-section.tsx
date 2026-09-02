import { Trophy } from "lucide-react";
import { AcademicCard } from "@/components/ui/academic-card";
import { StaggerReveal, StaggerItem } from "@/components/ui/stagger-reveal";
import { Achievement } from "@/types/profile";

export function AchievementsSection({ achievements }: { achievements?: Achievement[] | null }) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <AcademicCard className="p-8">
      <h3 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-8 border-b border-[#e2e2ea] pb-4 flex items-center gap-2">
        <Trophy className="w-4 h-4" />
        Honors & Awards
      </h3>
      
      <StaggerReveal className="grid gap-4">
        {achievements.map((item, i) => (
          <StaggerItem key={item.id || i}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl hover:bg-[#12172e]/5 transition-colors border border-transparent hover:border-[#e2e2ea]">
              <div>
                <h4 className="text-base font-medium text-brand-navy mb-1">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-text-secondary">{item.description}</p>
                )}
              </div>
              {item.date && (
                <div className="shrink-0 text-sm font-medium text-amber-500/80 bg-amber-500/10 px-3 py-1 rounded-full">
                  {item.date}
                </div>
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </AcademicCard>
  );
}
