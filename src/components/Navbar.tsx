import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Search, Shield, Command, Terminal, Menu, X } from 'lucide-react';
import { NavSection } from '../types';
import { sound } from '../utils/audio';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenSearch: () => void;
  onOpenTerminal: () => void;
}

export function Navbar({ activeSection, onNavigate, onOpenSearch, onOpenTerminal }: NavbarProps) {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const state = sound.toggleSound();
    setIsAudioActive(state);
  };

  const handleLinkClick = (section: NavSection) => {
    sound.playClick();
    onNavigate(section);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'work', label: 'ENGAGEMENTS' },
    { id: 'stack', label: 'CAPABILITIES' },
    { id: 'lab', label: 'WAR ROOM' },
    { id: 'about', label: 'PHILOSOPHY' },
    { id: 'contact', label: 'AUDIT BRIEF' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-500 border ${
          scrolled
            ? 'bg-[#0b0f19]/80 backdrop-blur-md border-cyan-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'bg-[#0b0f19]/40 backdrop-blur-sm border-white/10'
        }`}
      >
        {/* Brand Logo */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 group text-left cursor-pointer"
          data-cursor-hover
          data-cursor-text="HOME"
        >
          <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-950/60 border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300">
            <Shield className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute -inset-0.5 rounded-lg bg-cyan-400/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-[0.25em] text-white group-hover:text-cyan-300 transition-colors">
              CYBER OPS
            </div>
            <div className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
              DEFENSE CONSULTING
            </div>
          </div>
        </button>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-black/30 p-1 rounded-full border border-white/5 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id as NavSection)}
                onMouseEnter={() => sound.playHover()}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono tracking-widest transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 font-bold bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                data-cursor-hover
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions & Tools */}
        <div className="flex items-center gap-2.5">
          {/* Terminal CLI Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTerminal();
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all duration-300 text-xs font-mono cursor-pointer"
            data-cursor-hover
            data-cursor-text="TERMINAL"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400 group-hover:text-black" />
            <span className="hidden sm:inline text-[11px] font-bold tracking-wider">CLI</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSearch();
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-all duration-300 text-xs font-mono cursor-pointer"
            data-cursor-hover
            data-cursor-text="SEARCH"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline text-[11px] tracking-wider">SEARCH</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[9px] bg-black/40 px-1.5 py-0.5 rounded text-slate-400 border border-white/10">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleAudioToggle}
            onMouseEnter={() => sound.playHover()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer ${
              isAudioActive
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
            data-cursor-hover
            data-cursor-text={isAudioActive ? 'MUTE' : 'AUDIO'}
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-cyan-400 animate-bounce" style={{ animationDuration: '0.6s' }} />
                  <span className="w-0.5 h-2/3 bg-cyan-400 animate-bounce" style={{ animationDuration: '0.4s' }} />
                  <span className="w-0.5 h-4/5 bg-cyan-400 animate-bounce" style={{ animationDuration: '0.8s' }} />
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline text-[11px] font-mono tracking-wider">SFX</span>
              </>
            )}
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto bg-[#0b0f19]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,240,255,0.2)] animate-fadeIn">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id as NavSection)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-mono text-xs tracking-wider transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
