import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface GlowingButtonProps {
  label?: string;
  onClick?: () => void;
}

export function GlowingButton({
  label = 'EXPLORE SERVICES',
  onClick
}: GlowingButtonProps) {
  return (
    <button
      onClick={() => {
        sound.playClick();
        if (onClick) onClick();
      }}
      onMouseEnter={() => sound.playHover()}
      className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-cyan-950/60 border border-cyan-400 text-cyan-300 font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] cursor-pointer"
      data-cursor-hover
      data-cursor-text="EXPLORE"
    >
      <Sparkles className="w-4 h-4 text-cyan-400 group-hover:text-black transition-colors" />
      <span>{label}</span>
      <div className="w-7 h-7 rounded-full bg-cyan-400/20 group-hover:bg-black/20 flex items-center justify-center transition-colors">
        <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
      </div>

      {/* Ambient Pulsing Glow Ring */}
      <span className="absolute -inset-1 rounded-full border border-cyan-400/40 animate-ping opacity-25 pointer-events-none" />
    </button>
  );
}
