import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Shield, Lock, ShieldAlert, Activity } from 'lucide-react';
import { sound } from '../utils/audio';
import { ScrambleText } from './ScrambleText';
import { LiquidCard } from './LiquidCard';

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
  icon: Icon
}: {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleToggleActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(!isActive);
    sound.playClick();
  };

  return (
    <LiquidCard
      color1={isActive ? '#10b981' : '#00f0ff'}
      color2={isActive ? '#00f0ff' : '#d946ef'}
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
            <ScrambleText text={title} />
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

// Interactive Stats Card with Liquid Shader Effect
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
    <LiquidCard
      className="rounded-2xl bg-black/50 border border-white/10 hover:border-cyan-400 backdrop-blur-md transition-all duration-300"
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
    </LiquidCard>
  );
}

export function AboutSection() {
  const stats = [
    { value: '$18.4B+', label: 'ASSETS SHIELDED', desc: 'Global banking & enterprise liquidity protected' },
    { value: '< 1.2s', label: 'MTTD REMEDIATION', desc: 'Autonomous AI SOC threat detection speed' },
    { value: '2.5B+', label: 'DAILY LOGS ANALYZED', desc: 'Real-time telemetry event stream processing' },
    { value: '99.999%', label: 'THREAT DEFLECTION', desc: 'ISO 27001 & SOC 2 Type II certified' }
  ];

  const pillars = [
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

  return (
    <section id="about" className="relative z-10 py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-16 border-b border-white/10 pb-8">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-[0.25em] mb-2 uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PHILOSOPHY // ZERO-TRUST MANIFESTO</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-wider text-white uppercase font-sans max-w-4xl leading-tight">
          <ScrambleText text="IMPERVIOUS DEFENSE THROUGH ZERO-TRUST & POST-QUANTUM INTELLIGENCE" />
        </h2>
      </div>

      {/* Manifesto Paragraphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 font-mono text-sm leading-relaxed text-slate-300">
        <p className="border-l-2 border-cyan-400 pl-6 py-2">
          Cyber Ops operates at the frontier of offensive red teaming, post-quantum cryptography, and autonomous SOC threat intelligence. We assume initial compromise and engineer resilient zero-trust perimeters that deny unauthorized lateral movement across all infrastructure layers.
        </p>
        <p className="border-l-2 border-purple-500 pl-6 py-2 text-slate-400">
          Every microsegmentation policy, lattice key exchange, and AI SIEM playbook is engineered to safeguard mission-critical banking, aerospace, defense, and healthcare assets against state-sponsored Advanced Persistent Threats (APTs).
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
            title={pillar.title}
            desc={pillar.desc}
            icon={pillar.icon}
          />
        ))}
      </div>
    </section>
  );
}
