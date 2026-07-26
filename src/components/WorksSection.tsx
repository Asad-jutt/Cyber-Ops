import React, { useState } from 'react';
import { ArrowUpRight, ShieldCheck, ExternalLink, X } from 'lucide-react';
import { Project } from '../types';
import { PROJECTS } from '../data/projects';
import { sound } from '../utils/audio';
import { ScrambleText } from './ScrambleText';
import { LiquidCard } from './LiquidCard';

interface WorksSectionProps {
  onOpenLiveDemo?: (projectTitle: string) => void;
}

export function WorksSection({ onOpenLiveDemo }: WorksSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'CRYPTOGRAPHY', 'AI SIEM & SOC', 'ZERO-TRUST', 'RED TEAMING'];

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'CRYPTOGRAPHY') return p.tags.includes('Post-Quantum Crypto') || p.tags.includes('HSM Hardening');
    if (activeCategory === 'AI SIEM & SOC') return p.tags.includes('Autonomous SOC') || p.tags.includes('SIEM & SOAR');
    if (activeCategory === 'ZERO-TRUST') return p.tags.includes('Zero-Trust (ZTNA)') || p.tags.includes('Microsegmentation');
    if (activeCategory === 'RED TEAMING') return p.tags.includes('Red Teaming') || p.tags.includes('Zero-Day Discovery');
    return true;
  });

  const handleOpenProject = (project: Project) => {
    sound.playClick();
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    sound.playClick();
    setSelectedProject(null);
  };

  const handleTriggerLiveDemo = (title: string) => {
    sound.playClick();
    setSelectedProject(null);
    if (onOpenLiveDemo) {
      onOpenLiveDemo(`scan --target="${title}"`);
    }
  };

  return (
    <section id="work" className="relative z-10 py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-[0.25em] mb-2 uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CASE STUDIES // RECENT ENGAGEMENTS</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-wider text-white uppercase font-sans">
            <ScrambleText text="CYBER DEFENSE ARCHIVE" />
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat);
              }}
              onMouseEnter={() => sound.playHover()}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
              data-cursor-hover
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid with WebGL Liquid Shader Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <LiquidCard
            key={project.id}
            onClick={() => handleOpenProject(project)}
            onMouseEnter={() => sound.playHover()}
            className="rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,240,255,0.25)] cursor-pointer"
          >
            <div>
              {/* Project Image Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-80" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 tracking-widest uppercase">
                  {project.category}
                </div>

                {/* Hover Indicator */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 text-cyan-300 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>

              {/* Project Card Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl md:text-2xl font-bold font-sans text-white group-hover:text-cyan-300 transition-colors tracking-wider">
                    <ScrambleText text={project.title} />
                  </h3>
                  <span className="text-xs font-mono text-slate-500">{project.year}</span>
                </div>

                <p className="text-slate-400 text-xs font-mono line-clamp-2 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-mono text-slate-300 border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </LiquidCard>
        ))}
      </div>

      {/* Interactive Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b0f19] border border-cyan-500/30 p-6 md:p-10 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-white">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-400 hover:text-black flex items-center justify-center transition-all duration-300 cursor-pointer"
              data-cursor-hover
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 border border-white/10">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-[10px] font-mono text-cyan-300 uppercase tracking-widest mb-2 inline-block">
                  {selectedProject.category}
                </span>
                <h3 className="text-3xl md:text-4xl font-black font-sans uppercase text-white">
                  <ScrambleText text={selectedProject.title} />
                </h3>
              </div>
            </div>

            {/* Meta Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs mb-8">
              <div>
                <div className="text-slate-400 text-[10px] uppercase">CLIENT ENTITY</div>
                <div className="font-bold text-cyan-300">{selectedProject.client}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase">ENGAGEMENT YEAR</div>
                <div className="font-bold text-white">{selectedProject.year}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase">ROLE</div>
                <div className="font-bold text-emerald-400">{selectedProject.role}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase">STATUS</div>
                <div className="font-bold text-purple-400">DEPLOYED & ACTIVE</div>
              </div>
            </div>

            {/* Description & Metrics */}
            <div className="space-y-6 font-mono text-sm text-slate-300 leading-relaxed mb-8">
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">ENGAGEMENT SCOPE</h4>
                <p>{selectedProject.fullDescription || selectedProject.description}</p>
              </div>

              {selectedProject.metrics && selectedProject.metrics.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">KEY AUDIT METRICS</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProject.metrics.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/60 border border-emerald-500/30">
                        <div className="text-lg font-bold text-emerald-300">{m.value}</div>
                        <div className="text-xs text-slate-400">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-xs text-slate-300">
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleTriggerLiveDemo(selectedProject.title)}
                className="px-6 py-3 rounded-full bg-cyan-400 text-black font-mono font-bold text-xs tracking-widest uppercase hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>RUN SIMULATED AUDIT SCAN</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
