import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Shield, Lock, ShieldAlert, Activity } from 'lucide-react';
import { sound } from '../utils/audio';
import { useSectionReveal } from '../utils/scrollReveal';
import { LiquidCard } from './LiquidCard';
import { SanityAboutBlock } from '../sanity/client';

// Interactive Active Background Grid Canvas (Visible when card is activated)
function CardActiveBackgroundCanvas({ color = '#10b981' }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Subtle cyber grid lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.12;

      const step = 20;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Scanning line
      const scanY = (Math.sin(time * 1.5) * 0.5 + 0.5) * h;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    handleResize();

    render();

    return () => cancelAnimationFrame(animId);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block opacity-70 pointer-events-none"
    />
  );
}

// Interactive Pillar Card Component with WebGL Liquid Shader
function InteractivePillarCard({
  title,
  desc,
  icon: Icon,
  index = 0,
}: {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  index?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleToggleActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(!isActive);
    sound.playClick();
  };

  const getShaderColors = (idx: number, active: boolean) => {
    if (active) {
      return { color1: '#10b981', color2: '#00f0ff' };
    }
    switch (idx % 3) {
      case 0:
        return { color1: '#00f0ff', color2: '#3b82f6' }; // Cyan & Royal Blue
      case 1:
        return { color1: '#a855f7', color2: '#ec4899' }; // Electric Purple & Hot Pink
      case 2:
        return { color1: '#f59e0b', color2: '#10b981' }; // Amber Gold & Emerald Green
      default:
        return { color1: '#00f0ff', color2: '#d946ef' };
    }
  };

  const { color1, color2 } = getShaderColors(index, isActive);

  return (
    <LiquidCard
      disableShader={true}
      color1={color1}
      color2={color2}
      className={`relative rounded-2xl transition-all duration-300 backdrop-blur-xl border flex flex-col justify-between group cursor-pointer overflow-hidden ${
        isActive
          ? 'bg-black/90 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.35)]'
          : isHovered
          ? 'bg-black/80 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.25)]'
          : 'bg-gradient-to-b from-white/5 to-transparent border-white/10 hover:border-cyan-500/40'
      }`}
      onMouseEnter={() => {
        setIsHovered(true);
        sound.playHover();
      }}
    >
      <div className="p-8 flex flex-col justify-between h-full space-y-6">
        {/* Interactive Background Grid (Visible when active) */}
        {isActive && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
            <CardActiveBackgroundCanvas color="#10b981" />
          </div>
        )}

        {/* Card Content Header */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
              isActive
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400'
            }`}>
              <Icon className="w-6 h-6" />
            </div>

            <span className="px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 tracking-widest uppercase flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
              <span>CYBER MATRIX</span>
            </span>
          </div>

          <h3 className={`text-lg font-bold font-sans tracking-wider uppercase transition-colors ${
            isActive ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : isHovered ? 'text-cyan-300' : 'text-white'
          }`}>
            {title}
          </h3>

          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Interactive Action Button */}
        <div className="relative z-10 pt-2">
          <button
            onClick={handleToggleActive}
            className={`w-full py-2.5 rounded-xl border font-mono text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-cyan-950/60 border-cyan-500/40 hover:border-cyan-300 hover:bg-cyan-900/60 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{isActive ? 'SHIELD MATRIX: ENGAGED' : 'ENGAGE SHIELD MATRIX'}</span>
          </button>
        </div>
      </div>
    </LiquidCard>
  );
}

// Interactive Stats Card
function InteractiveStatsCard({
  value,
  label,
  desc,
}: {
  value: string;
  label: string;
  desc: string;
  idx: number;
}) {
  return (
    <div
      className="rounded-2xl bg-black/50 border border-white/10 hover:border-cyan-400/50 backdrop-blur-md transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => sound.playHover()}
    >
      <div className="p-6">
        <div className="relative z-10 text-3xl md:text-4xl font-black font-mono text-cyan-300 group-hover:text-cyan-400 transition-colors mb-2">
          {value}
        </div>
        <div className="relative z-10 text-xs font-mono font-bold tracking-widest text-white uppercase mb-1">
          {label}
        </div>
        <div className="relative z-10 text-[11px] font-mono text-slate-400">
          {desc}
        </div>
      </div>
    </div>
  );
}

interface AboutSectionProps {
  data?: SanityAboutBlock;
}

export function AboutSection({ data }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, { stagger: 0.15, y: 60, start: 'top 85%' });
  const badgeText = data?.badgeText || 'PHILOSOPHY // ZERO-TRUST MANIFESTO';
  const sectionTitle = data?.sectionTitle || 'IMPERVIOUS DEFENSE THROUGH ZERO-TRUST & POST-QUANTUM INTELLIGENCE';

  const stats = data?.stats && data.stats.length > 0
    ? data.stats.map(s => ({
        value: s.value || '0',
        label: s.label || 'STAT',
        desc: s.description || ''
      }))
    : [
        { value: '$18.4B+', label: 'ASSETS SHIELDED', desc: 'Global banking & enterprise liquidity protected' },
        { value: '< 1.2s', label: 'MTTD REMEDIATION', desc: 'Autonomous AI SOC threat detection speed' },
        { value: '2.5B+', label: 'DAILY LOGS ANALYZED', desc: 'Real-time telemetry event stream processing' },
        { value: '99.999%', label: 'THREAT DEFLECTION', desc: 'ISO 27001 & SOC 2 Type II certified' }
      ];

  const pillars = data?.pillars && data.pillars.length > 0
    ? data.pillars.map((p, idx) => ({
        title: p.title || 'SECURITY PILLAR',
        desc: p.description || '',
        icon: idx === 0 ? Lock : idx === 1 ? Shield : ShieldAlert
      }))
    : [
        {
          title: 'ZERO-TRUST ARCHITECTURE (ZTNA)',
          desc: 'Eliminating implicit trust through ephemeral mTLS authentication, continuous device posture evaluation, and granular microsegmentation policies.',
          icon: Lock
        },
        {
          title: 'POST-QUANTUM CRYPTOGRAPHY',
          desc: 'Deploying NIST-approved lattice encryption algorithms (Kyber & Dilithium) inside cloud HSMs to neutralize future quantum decryption harvest attacks.',
          icon: Shield
        },
        {
          title: 'AUTONOMOUS AI SOC & RED TEAMING',
          desc: 'Combining simulated APT red-team campaigns with sub-second AI threat hunting to detect and neutralize zero-days before adversaries exploit them.',
          icon: ShieldAlert
        }
      ];

  const bioParagraphs = data?.bio || [
    'Cyber Ops operates at the frontier of offensive red teaming, post-quantum cryptography, and autonomous SOC threat intelligence. We assume initial compromise and engineer resilient zero-trust perimeters that deny unauthorized lateral movement across all infrastructure layers.',
    'Every microsegmentation policy, lattice key exchange, and AI SIEM playbook is engineered to safeguard mission-critical banking, aerospace, defense, and healthcare assets against state-sponsored Advanced Persistent Threats (APTs).'
  ];

  return (
    <section ref={sectionRef} id="about" className="relative z-10 py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-16 border-b border-white/10 pb-8">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-[0.25em] mb-2 uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{badgeText}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-wider text-white uppercase font-sans max-w-4xl leading-tight">
          {sectionTitle}
        </h2>
      </div>

      {/* Manifesto Paragraphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 font-mono text-sm leading-relaxed text-slate-300">
        <p className="border-l-2 border-cyan-400 pl-6 py-2">
          {bioParagraphs[0]}
        </p>
        <p className="border-l-2 border-purple-500 pl-6 py-2 text-slate-400">
          {bioParagraphs[1] || bioParagraphs[0]}
        </p>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {stats.map((stat, idx) => (
          <InteractiveStatsCard
            key={idx}
            value={stat.value}
            label={stat.label}
            desc={stat.desc}
            idx={idx}
          />
        ))}
      </div>

      {/* Technical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((pillar, i) => (
          <InteractivePillarCard
            key={i}
            index={i}
            title={pillar.title}
            desc={pillar.desc}
            icon={pillar.icon}
          />
        ))}
      </div>
    </section>
  );
}
