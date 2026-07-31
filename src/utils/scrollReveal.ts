import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollRevealOptions {
  targets?: string;
  stagger?: number;
  y?: number;
  blur?: number;
  duration?: number;
  start?: string;
  ease?: string;
  delay?: number;
}

export function useSectionReveal<T extends HTMLElement = HTMLElement>(
  sectionRef: RefObject<T | null>,
  options: ScrollRevealOptions = {}
) {
  const {
    targets,
    stagger = 0.12,
    y = 48,
    blur = 10,
    duration = 1,
    start = 'top 82%',
    ease = 'power3.out',
    delay = 0,
  } = options;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = targets
        ? Array.from(section.querySelectorAll<HTMLElement>(targets))
        : Array.from(section.children) as HTMLElement[];

      if (elements.length === 0) return;

      gsap.fromTo(
        elements,
        { opacity: 0, y, filter: `blur(${blur}px)`, willChange: 'opacity, transform, filter' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          willChange: 'auto',
          duration,
          ease,
          delay,
          stagger,
          scrollTrigger: {
            trigger: section,
            start,
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [sectionRef, targets, stagger, y, blur, duration, start, ease, delay]);
}
