import { Briefcase, GraduationCap } from "lucide-react";
import { AcademicCard } from "@/components/ui/academic-card";
import { StaggerReveal, StaggerItem } from "@/components/ui/stagger-reveal";
import { Education, Experience } from "@/types/profile";

interface TimelineItemProps {
  title: string;
  subtitle: string;
  dateRange: string;
  description?: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

function TimelineItem({ title, subtitle, dateRange, description, icon, isLast }: TimelineItemProps) {
  return (
    <div className="relative pl-10 pb-8 last:pb-0">
      <div className="absolute left-0 top-0 w-8 h-8 bg-white border border-[#e2e2ea] rounded-full flex items-center justify-center text-text-secondary z-10 shadow-sm">
        {icon}
      </div>
      {!isLast && (
        <div className="absolute left-4 top-8 bottom-0 w-px bg-gradient-to-b from-[#e2e2ea] to-transparent"></div>
      )}
      <div className="group">
        <h4 className="text-lg font-medium text-brand-navy group-hover:text-amber-500 transition-colors">{title}</h4>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-text-secondary mt-1 mb-3">
          <span className="font-medium text-text-secondary">{subtitle}</span>
          <span className="hidden sm:inline text-text-secondary">•</span>
          <span className="bg-[#12172e]/5 px-2 py-0.5 rounded text-xs">{dateRange}</span>
        </div>
        {description && (
          <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
        )}
      </div>
    </div>
  );
}

export function TimelineSection({
  education,
  experience,
}: {
  education?: Education[] | null;
  experience?: Experience[] | null;
}) {
  const hasEd = education && education.length > 0;
  const hasExp = experience && experience.length > 0;

  if (!hasEd && !hasExp) return null;

  return (
    <AcademicCard className="p-8">
      <h3 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-8 border-b border-[#e2e2ea] pb-4">Background</h3>
      
      <StaggerReveal className="grid md:grid-cols-2 gap-12">
        {hasExp && (
          <StaggerItem>
            <h4 className="text-lg font-medium text-brand-navy mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-500" />
              Experience
            </h4>
            <div className="space-y-0">
              {experience.map((exp, i) => (
                <TimelineItem
                  key={exp.id || i}
                  title={exp.role}
                  subtitle={exp.company}
                  dateRange={`${exp.startYear || ""} - ${exp.endYear || "Present"}`}
                  description={exp.description}
                  icon={<Briefcase className="w-4 h-4" />}
                  isLast={i === experience.length - 1}
                />
              ))}
            </div>
          </StaggerItem>
        )}

        {hasEd && (
          <StaggerItem>
            <h4 className="text-lg font-medium text-brand-navy mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-500" />
              Education
            </h4>
            <div className="space-y-0">
              {education.map((ed, i) => (
                <TimelineItem
                  key={ed.id || i}
                  title={ed.degree}
                  subtitle={ed.institution}
                  dateRange={`${ed.startYear || ""} - ${ed.endYear || "Present"}`}
                  description={ed.description}
                  icon={<GraduationCap className="w-4 h-4" />}
                  isLast={i === education.length - 1}
                />
              ))}
            </div>
          </StaggerItem>
        )}
      </StaggerReveal>
    </AcademicCard>
  );
}
