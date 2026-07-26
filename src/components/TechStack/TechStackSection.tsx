import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CapabilityCard } from './CapabilityCard';
import { GlowingButton } from './GlowingButton';
import { Cpu } from 'lucide-react';
import { SanityTechStackBlock } from '../../sanity/client';

interface TechStackSectionProps {
  data?: SanityTechStackBlock;
  onExploreServices?: () => void;
}

export function TechStackSection({ data, onExploreServices }: TechStackSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const badgeText = data?.badgeText || 'CORE CAPABILITIES // DEFENSE SUITE';
  const sectionTitle = data?.sectionTitle || 'MILITARY-GRADE CYBER ENGINE';
  const subtitle =
    data?.subtitle ||
    'FORTIFYING HYBRID MULTI-CLOUD INFRASTRUCTURES THROUGH AUTOMATED THREAT HUNTING, SECURE MESH ARCHITECTURE, AND POST-QUANTUM CRYPTOGRAPHY.';

  // GSAP Stagger Entrance Animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 30, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0 }
    )
      .fromTo(
        Array.from(cardsRef.current?.children || []),
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15 },
        '-=0.5'
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        '-=0.4'
      );

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          tl.play();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      tl.kill();
    };
  }, [sectionTitle]);

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative z-10 py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div ref={titleRef} className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-[0.25em] mb-2 uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-wider text-white uppercase font-sans">
            {sectionTitle}
          </h2>
        </div>

        <p className="text-slate-400 font-mono text-xs sm:text-sm max-w-md leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Grid of Capability Cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12"
      >
        {data?.capabilities && data.capabilities.length > 0 ? (
          data.capabilities.map((cap, idx) => {
            const variants: Array<'webgl' | 'dataviz' | 'react' | 'shaders'> = [
              'webgl',
              'dataviz',
              'react',
              'shaders',
            ];
            return (
              <CapabilityCard
                key={cap.id || idx}
                variant={variants[idx % variants.length]}
                title={cap.title}
                description={cap.description}
                badge={cap.tags?.[0] || 'DEFENSE'}
              />
            );
          })
        ) : (
          <>
            {/* Fallback Cards */}
            <CapabilityCard
              variant="webgl"
              title="OFFENSIVE RED TEAMING // PENTESTING"
              description="Simulated APT Campaigns & Kernel Zero-Day Discovery."
              badge="OFFENSIVE"
            />
            <CapabilityCard
              variant="dataviz"
              title="AUTONOMOUS AI SOC & SIEM"
              description="Real-Time Telemetry Analytics & Sub-Second Remediation."
              badge="THREAT HUNT"
            />
            <CapabilityCard
              variant="react"
              title="SECURE MESH ARCHITECTURE (ZTNA)"
              description="Continuous Ephemeral Identity & Dynamic Microsegmentation."
              badge="SECURE MESH"
            />
            <CapabilityCard
              variant="shaders"
              title="POST-QUANTUM CRYPTOGRAPHY"
              description="NIST Lattice-Based Kyber & Dilithium HSM Hardening."
              badge="ENCRYPTION"
            />
          </>
        )}
      </div>

      {/* CTA Button */}
      <div ref={buttonRef} className="flex justify-center pt-4">
        <GlowingButton label="REQUEST THREAT BRIEF" onClick={onExploreServices} />
      </div>
    </section>
  );
}


