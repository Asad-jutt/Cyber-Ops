import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Background3D } from './Background3D';
import { CapabilityCard, CardVariant } from './CapabilityCard';
import { GlowingButton } from './GlowingButton';
import { Cpu } from 'lucide-react';

interface TechStackSectionProps {
  onExploreServices?: () => void;
}

export function TechStackSection({ onExploreServices }: TechStackSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
  }, []);

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative z-10 py-28 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden rounded-3xl my-12"
    >
      {/* 3D WebGL Canvas Layer */}
      <Background3D mousePos={mousePos} />

      {/* Radial Dark Masking Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0b0f19] via-[#0b0f19]/80 to-[#0b0f19] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <div ref={titleRef} className="text-center max-w-3xl mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>CORE CAPABILITIES // DEFENSE SUITE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider text-white uppercase font-sans leading-tight">
            MILITARY-GRADE <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
              CYBER ENGINE
            </span>
          </h2>

          <p className="text-slate-300 font-mono text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            FORTIFYING HYBRID MULTI-CLOUD INFRASTRUCTURES THROUGH AUTOMATED THREAT HUNTING, ZERO-TRUST MESH ARCHITECTURE, AND POST-QUANTUM CRYPTOGRAPHY.
          </p>
        </div>

        {/* 2x2 Grid of Capability Cards framing the central 3D scene */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-16"
        >
          {/* Card 1: Top-Left */}
          <CapabilityCard
            variant="webgl"
            title="OFFENSIVE RED TEAMING // PENTESTING"
            description="Simulated APT Campaigns & Kernel Zero-Day Discovery."
            badge="OFFENSIVE"
          />

          {/* Card 2: Top-Right */}
          <CapabilityCard
            variant="dataviz"
            title="AUTONOMOUS AI SOC & SIEM"
            description="Real-Time Telemetry Analytics & Sub-Second Remediation."
            badge="THREAT HUNT"
          />

          {/* Card 3: Bottom-Left */}
          <CapabilityCard
            variant="react"
            title="ZERO-TRUST MESH (ZTNA)"
            description="Continuous Ephemeral Identity & Dynamic Microsegmentation."
            badge="ZERO-TRUST"
          />

          {/* Card 4: Bottom-Right */}
          <CapabilityCard
            variant="shaders"
            title="POST-QUANTUM CRYPTOGRAPHY"
            description="NIST Lattice-Based Kyber & Dilithium HSM Hardening."
            badge="ENCRYPTION"
          />
        </div>

        {/* CTA Button */}
        <div ref={buttonRef}>
          <GlowingButton label="REQUEST THREAT BRIEF" onClick={onExploreServices} />
        </div>
      </div>
    </section>
  );
}
