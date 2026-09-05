"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function StaggerReveal({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Find all children marked as stagger-item
    const items = containerRef.current.querySelectorAll('[data-stagger-item="true"]');
    
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all"
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-stagger-item="true" className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
