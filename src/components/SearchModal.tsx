import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles, Terminal, Box, Cpu } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import { sound } from '../utils/audio';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (id: string) => void;
  onNavigateSection: (section: string) => void;
}

export function SearchModal({ isOpen, onClose, onSelectProject, onNavigateSection }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        if (isOpen) onClose();
        else {
          // Open search modal
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0b0f19] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search security case studies, zero-trust, cryptography, war room..."
            className="w-full bg-transparent text-white font-mono text-sm focus:outline-none placeholder:text-slate-600"
          />
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Quick Nav Sections */}
          {!query && (
            <div>
              <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase mb-2 px-2">
                QUICK NAVIGATION
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'work', label: 'ENGAGEMENTS ARCHIVE', icon: Sparkles },
                  { id: 'stack', label: 'CAPABILITIES SUITE', icon: Cpu },
                  { id: 'lab', label: 'WAR ROOM SIMULATOR', icon: Box },
                  { id: 'about', label: 'ZERO-TRUST MANIFESTO', icon: Terminal },
                  { id: 'contact', label: 'SECURITY AUDIT BRIEF', icon: ArrowRight }
                ].map((nav) => (
                  <button
                    key={nav.id}
                    onClick={() => {
                      sound.playClick();
                      onNavigateSection(nav.id);
                      onClose();
                    }}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-cyan-950/40 hover:border-cyan-500/30 border border-transparent text-left font-mono text-xs text-slate-300 transition-all cursor-pointer"
                  >
                    <nav.icon className="w-4 h-4 text-cyan-400" />
                    <span>{nav.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Project Results */}
          <div>
            <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase mb-2 px-2">
              PROJECTS ({filteredProjects.length})
            </div>
            {filteredProjects.length === 0 ? (
              <div className="text-xs font-mono text-slate-500 p-4 text-center">
                No matching projects found.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectProject(p.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="text-xs font-mono font-bold text-white group-hover:text-cyan-300">
                          {p.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {p.category}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
