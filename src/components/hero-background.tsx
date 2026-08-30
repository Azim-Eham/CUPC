"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      {/* Base Space Image */}
      <div className="absolute inset-0 scale-105 animate-[slow-zoom_30s_ease-in-out_infinite_alternate]">
         <Image src="/Space.jfif" alt="Space" fill className="object-cover object-center" priority />
      </div>

      {/* Deep Space Gradient Mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d]/90 via-[#0a0f1d]/75 to-surface-base"></div>

      {/* Quantum Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        style={{ WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 60%, transparent 100%)' }}
      ></div>

      {/* Physics Particles */}
      <div className="absolute top-[25%] left-[15%] w-1 h-1 rounded-full bg-[#f2a93c]/80 shadow-[0_0_10px_2px_#f2a93c] animate-[pulse_3s_ease-in-out_infinite]" />
      <div className="absolute top-[65%] left-[82%] w-1 h-1 rounded-full bg-teal-400/80 shadow-[0_0_10px_2px_teal] animate-[pulse_5s_ease-in-out_infinite_0.5s]" />
      <div className="absolute top-[75%] left-[20%] w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_12px_2px_white] animate-[pulse_4s_ease-in-out_infinite_1s]" />
      <div className="absolute top-[35%] left-[75%] w-1 h-1 rounded-full bg-blue-400/80 shadow-[0_0_10px_2px_blue] animate-[pulse_6s_ease-in-out_infinite]" />

      {/* Dynamic Cursor Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
        style={{
          background: `radial-gradient(circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(242, 169, 60, 0.12), transparent 80%)`
        }}
      />
    </div>
  );
}