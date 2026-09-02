import { BookOpen, ExternalLink } from "lucide-react";
import { AcademicCard } from "@/components/ui/academic-card";
import { StaggerReveal, StaggerItem } from "@/components/ui/stagger-reveal";
import { Publication } from "@/types/profile";

export function PublicationsSection({ publications }: { publications?: Publication[] | null }) {
  if (!publications || publications.length === 0) return null;

  return (
    <AcademicCard className="p-8">
      <h3 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-8 border-b border-[#e2e2ea] pb-4 flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        Research & Publications
      </h3>
      
      <StaggerReveal className="space-y-6">
        {publications.map((pub, i) => (
          <StaggerItem key={pub.id || i}>
            <div className="group relative p-6 rounded-2xl bg-surface-alt border border-[#e2e2ea] hover:border-[#e2e2ea] hover:bg-black/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-brand-navy group-hover:text-amber-500 transition-colors mb-2">
                    {pub.title}
                  </h4>
                  <p className="text-sm text-text-secondary mb-3 font-medium">
                    {pub.authors}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                    {pub.journal && (
                      <span className="bg-[#12172e]/5 px-2 py-1 rounded border border-[#e2e2ea]">
                        {pub.journal}
                      </span>
                    )}
                    {pub.year && <span>{pub.year}</span>}
                  </div>
                </div>
                
                {pub.link && (
                  <a 
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#12172e]/5 text-text-secondary hover:bg-white/10 hover:text-white text-sm transition-colors shrink-0 border border-[#e2e2ea]"
                  >
                    View Paper <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </AcademicCard>
  );
}
