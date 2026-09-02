"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollAnimations() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Small delay to ensure DOM is fully hydrated
    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        // ─── HERO: Cinematic entrance ───
        const heroLines = document.querySelectorAll("[data-hero-line]");
        const heroSub = document.querySelector("[data-hero-sub]");
        const heroCta = document.querySelector("[data-hero-cta]");

        if (heroLines.length) {
          const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
          heroTl
            .set([...heroLines, heroSub, heroCta].filter(Boolean), { opacity: 0, y: 40 })
            .to(heroLines, { opacity: 1, y: 0, duration: 1, stagger: 0.15 })
            .to(heroSub, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
            .to(heroCta, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4");
        }

        // Hero background parallax
        const heroBg = document.querySelector("[data-hero-bg]");
        if (heroBg) {
          gsap.to(heroBg, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
          });
        }

        // Helper: scroll-triggered from() with safety
        const animFrom = (el: gsap.TweenTarget, vars: gsap.TweenVars, trigger: Element, start = "top 80%") => {
          return gsap.from(el, {
            ...vars,
            immediateRender: false,
            scrollTrigger: { trigger, start, toggleActions: "play none none none" },
          });
        };

        // ─── ABOUT ───
        const aboutSection = document.querySelector("#about");
        if (aboutSection) {
          const h = aboutSection.querySelector("[data-anim='about-heading']");
          const t = aboutSection.querySelector("[data-anim='about-text']");
          const bs = aboutSection.querySelectorAll("[data-anim='about-bullet']");
          const c = aboutSection.querySelector("[data-anim='about-card']");

          const aboutTl = gsap.timeline({
            scrollTrigger: { trigger: aboutSection, start: "top 80%", toggleActions: "play none none none" },
            defaults: { ease: "power2.out", immediateRender: false },
          });
          if (h) aboutTl.from(h, { opacity: 0, y: 30, duration: 0.8 });
          if (t) aboutTl.from(t, { opacity: 0, y: 20, duration: 0.7 }, "-=0.4");
          if (bs.length) aboutTl.from(bs, { opacity: 0, x: -15, duration: 0.5, stagger: 0.1 }, "-=0.3");
          if (c) aboutTl.from(c, { opacity: 0, y: 30, scale: 0.97, duration: 0.8 }, "-=0.6");

          if (c) {
            gsap.to(c, {
              yPercent: -5,
              ease: "none",
              scrollTrigger: { trigger: aboutSection, start: "top bottom", end: "bottom top", scrub: true },
            });
          }
        }

        // ─── FEATURES ───
        const featuresHeading = document.querySelector("[data-anim='features-heading']");
        if (featuresHeading) {
          animFrom(featuresHeading, { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" }, featuresHeading, "top 85%");
        }
        const featuresGrid = document.querySelector("[data-anim='features-grid']");
        if (featuresGrid) {
          const cards = featuresGrid.querySelectorAll("[data-anim='feature-card']");
          if (cards.length) {
            gsap.from(cards, {
              opacity: 0, y: 40, duration: 0.7, stagger: 0.15, ease: "power2.out",
              immediateRender: false,
              scrollTrigger: { trigger: featuresGrid, start: "top 85%", toggleActions: "play none none none" },
            });
          }
        }

        // ─── MENTORS ───
        const mentorsSection = document.querySelector("#mentors");
        if (mentorsSection) {
          const mh = mentorsSection.querySelector("[data-anim='mentors-heading']");
          const mc = mentorsSection.querySelector("[data-anim='mentors-cta']");
          const mco = mentorsSection.querySelector("[data-anim='mentors-content']");

          const mtl = gsap.timeline({
            scrollTrigger: { trigger: mentorsSection, start: "top 80%", toggleActions: "play none none none" },
            defaults: { ease: "power2.out", immediateRender: false },
          });
          if (mh) mtl.from(mh, { opacity: 0, y: 30, duration: 0.8 });
          if (mc) mtl.from(mc, { opacity: 0, x: 20, duration: 0.6 }, "-=0.4");
          if (mco) mtl.from(mco, { opacity: 0, y: 25, duration: 0.7 }, "-=0.3");
        }

        // ─── FACULTY ───
        const facultySection = document.querySelector("#faculty");
        if (facultySection) {
          const fhd = facultySection.querySelector("[data-anim='faculty-heading']");
          const fcs = facultySection.querySelectorAll("[data-anim='faculty-card']");

          const ftl = gsap.timeline({
            scrollTrigger: { trigger: facultySection, start: "top 75%", toggleActions: "play none none none" },
            defaults: { ease: "power2.out", immediateRender: false },
          });
          if (fhd) ftl.from(fhd, { opacity: 0, y: 30, duration: 0.8 });
          if (fcs.length) ftl.from(fcs, { opacity: 0, x: 30, duration: 0.6, stagger: 0.12 }, "-=0.3");
        }

        // ─── EVENTS ───
        const eventsSection = document.querySelector("#events");
        if (eventsSection) {
          const eh = eventsSection.querySelector("[data-anim='events-heading']");
          const ecs = eventsSection.querySelectorAll("[data-anim='event-card']");

          const etl = gsap.timeline({
            scrollTrigger: { trigger: eventsSection, start: "top 80%", toggleActions: "play none none none" },
            defaults: { ease: "power2.out", immediateRender: false },
          });
          if (eh) etl.from(eh, { opacity: 0, y: 30, duration: 0.8 });
          if (ecs.length) etl.from(ecs, { opacity: 0, y: 35, duration: 0.6, stagger: 0.15 }, "-=0.3");
        }

        // ─── FOOTER ───
        const footer = document.querySelector("[data-anim='footer']");
        if (footer) {
          animFrom(footer, { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, footer, "top 92%");
        }

        // Force ScrollTrigger refresh after all tweens registered
        ScrollTrigger.refresh();
      });

      // Store for cleanup
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (window as any).__gsapCtx = ctx;
    });

    return () => {
      cancelAnimationFrame(raf);
      const ctx = /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (window as any).__gsapCtx;
      if (ctx) ctx.revert();
    };
  }, []);

  return null;
}
