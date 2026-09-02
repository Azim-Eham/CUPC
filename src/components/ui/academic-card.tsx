"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AcademicCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={cn(
        "bg-white border border-[#e2e2ea] shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-brand-navy rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}