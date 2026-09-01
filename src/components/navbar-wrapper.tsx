"use client";

import { useState, useEffect } from "react";

export function NavbarWrapper({ children, isAbsolute = false }: { children: React.ReactNode, isAbsolute?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When absolute (hero page): starts completely transparent, becomes dark glass on scroll
  // When not absolute: sticky dark
  const baseClasses = "w-full z-50 transition-all duration-300";
  const absoluteClasses = isAbsolute 
    ? `fixed top-0 left-0 right-0 ${scrolled ? 'bg-[#0a0f1d]/60 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent border-transparent'}`
    : 'sticky top-0 bg-[#12172e] shadow-md border-b border-white/5';

  return (
    <div className={`${baseClasses} ${absoluteClasses}`}>
      {children}
    </div>
  );
}
