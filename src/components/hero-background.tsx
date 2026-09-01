"use client";

import Image from "next/image";

export function HeroBackground() {
  return (
    <div data-hero-bg className="absolute inset-0 z-0 overflow-hidden">
      {/* Base Space Image */}
      <div className="absolute inset-0">
         <Image src="/hero-bg.png" alt="Space" fill className="object-cover object-center" priority />
      </div>

    </div>
  );
}
