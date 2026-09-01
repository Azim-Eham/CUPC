"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={cn(
        "bg-zinc-900/40 backdrop-blur-md border border-white/10 shadow-none text-zinc-50 rounded-2xl overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}