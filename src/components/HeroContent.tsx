import React from 'react';
import { ArrowUpRight, ShieldCheck, Cpu, Lock, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';
import { LiquidCard } from './LiquidCard';
import { SanityHeroBlock } from '../sanity/client';

interface HeroContentProps {
  data?: SanityHeroBlock;
  onBeginExploration: () => void;
  onOpenLab: () => void;
}

export function HeroContent({ data, onBeginExploration, onOpenLab }: HeroContentProps) {
  const statusBadge = data?.statusBadge || 'SYSTEM STATUS // ALL SYSTEMS HARDENED';
  const headlinePrimary = data?.headlinePrimary || 'ZERO-TRUST ARCHITECTURE &';
  const headlineAccent = data?.headlineAccent || 'QUANTUM-RESISTANT CYBER OPS';
  const subheadline =
    data?.subheadline ||
    'FORTIFYING GLOBAL ENTERPRISES, DEFENSE CONTRACTORS, AND FINTECH INFRASTRUCTURES WITH POST-QUANTUM CRYPTOGRAPHY, OFFENSIVE RED-TEAM PENTESTING, AND AUTONOMOUS AI SOC THREAT HUNTING.';
  const ctaPrimaryText = data?.ctaPrimaryText || 'INITIATE THREAT AUDIT';
  const ctaSecondaryText = data?.ctaSecondaryText || 'SIMULATE WAR ROOM';

  return (
    <div
      className="relative z-10 flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-20 pt-24 pb-12 max-w-5xl pointer-events-none"
    >
      {/* Subtitle / Eyebrow */}
      <div
        className="flex items-center gap-2 mb-4 pointer-events-auto"
      >
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 text-xs font-mono tracking-[0.2em] shadow-[0_0_20px_rgba(0,240,255,0.25)] uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {statusBadge}
        </span>
      </div>

      {/* Main Hero Headline (Heading only) */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[0.95] mb-6 drop-shadow-[0_0_35px_rgba(0,240,255,0.2)] font-sans"
      >
        {headlinePrimary} <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-500 animate-gradient">
          {headlineAccent}
        </span>
      </h1>

      {/* Description */}
      <p
        className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-mono leading-relaxed mb-8 tracking-wide text-balance"
      >
        {subheadline}
      </p>

      {/* Action Buttons */}
      <div
        className="flex flex-wrap items-center gap-4 mb-12 pointer-events-auto"
      >
        {/* Initiate Threat Audit Button */}
        <button
          onClick={() => {
            sound.playClick();
            onBeginExploration();
          }}
          onMouseEnter={() => sound.playHover()}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-cyan-500/10 border border-cyan-400/80 text-cyan-300 font-mono text-sm tracking-widest font-bold uppercase transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] cursor-pointer"
          data-cursor-hover
          data-cursor-text="AUDIT"
        >
          <span>{ctaPrimaryText}</span>
          <div className="w-8 h-8 rounded-full bg-cyan-400/20 group-hover:bg-black/20 flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-1 rounded-full border border-cyan-400/40 animate-ping opacity-30 pointer-events-none" />
        </button>

        {/* Access War Room Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenLab();
          }}
          onMouseEnter={() => sound.playHover()}
          className="flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-950/20 transition-all duration-300 font-mono text-xs tracking-widest cursor-pointer"
          data-cursor-hover
          data-cursor-text="WAR ROOM"
        >
          <Lock className="w-4 h-4 text-purple-400" />
          <span>{ctaSecondaryText}</span>
        </button>
      </div>

      {/* Technical Badges with Liquid Shader Cards */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl pointer-events-auto"
      >
        {(data?.statPills || [
          { label: 'FRAMEWORK', value: 'CYBER ARCHITECTURE' },
          { label: 'ENCRYPTION', value: '256-BIT LATTICE' },
          { label: 'SOC INTELLIGENCE', value: 'AI THREAT HUNT' },
          { label: 'COMPLIANCE', value: 'ISO 27001 / SOC 2' }
        ]).map((item, idx) => {
          const icons = [Lock, ShieldCheck, Cpu, ShieldAlert];
          const IconComp = icons[idx % icons.length];
          return (
            <LiquidCard
              key={idx}
              disableShader
              className="rounded-xl bg-black/50 border border-white/10 backdrop-blur-md hover:border-cyan-500/40 transition-colors"
            >
              <div className="p-3.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 mb-1">
                  <IconComp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                <div className="text-xs font-bold font-mono text-white tracking-wider">
                  {item.value}
                </div>
              </div>
            </LiquidCard>
          );
        })}
      </div>
    </div>
  );
}

