import React, { useState, useEffect } from 'react';
import { Shield, ArrowUp } from 'lucide-react';
import { sound } from '../utils/audio';
import { SanityFooterBlock } from '../sanity/client';

interface FooterProps {
  data?: SanityFooterBlock;
}

export function Footer({ data }: FooterProps) {
  const [timeStr, setTimeStr] = useState('');

  const copyrightText = data?.copyrightNotice || data?.copyrightText || 'CYBER OPS // ZERO-TRUST CYBER ADVISORY © 2026';

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, timeZoneName: 'short' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0b0f19] py-12 px-6 md:px-12 lg:px-20 text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white tracking-widest uppercase">
              {copyrightText}
            </span>
          </div>
        </div>

        {/* Live Clock & Status */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>SOC TELEMETRY: {timeStr}</span>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all duration-300 cursor-pointer"
            data-cursor-hover
            data-cursor-text="TOP"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
