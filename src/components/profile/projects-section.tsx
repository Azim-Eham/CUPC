import { ExternalLink } from "lucide-react";
import { AcademicCard } from "@/components/ui/academic-card";
import { StaggerReveal, StaggerItem } from "@/components/ui/stagger-reveal";
import { Project } from "@/types/profile";
import Image from "next/image";

export function ProjectsSection({ projects }: { projects?: Project[] | null }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-6 pl-2">Projects & Work</h3>
      <StaggerReveal className="grid sm:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <StaggerItem key={project.id || i}>
            <AcademicCard className="h-full group hover:border-[#e2e2ea] transition-all duration-300 overflow-hidden flex flex-col">
              {project.imageUrl && (
                <div className="w-full h-48 relative overflow-hidden bg-black/40 border-b border-[#e2e2ea]">
                  <Image 
                    src={project.imageUrl} 
                    alt={project.title} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="text-xl font-medium text-brand-navy group-hover:text-amber-500 transition-colors">
                    {project.title}
                  </h4>
                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="p-2 -mr-2 -mt-2 text-text-secondary hover:text-amber-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {project.description}
                </p>
              </div>
            </AcademicCard>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </div>
  );
}
