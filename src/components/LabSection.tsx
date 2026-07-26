import React from 'react';
import { Sliders, RefreshCw, Cpu, Zap, Eye, Box, Shield, Lock } from 'lucide-react';
import { LabSettings } from '../types';
import { sound } from '../utils/audio';
import { LiquidCard } from './LiquidCard';

interface LabSectionProps {
  labSettings: LabSettings;
  onUpdateSettings: (settings: LabSettings) => void;
}

export function LabSection({ labSettings, onUpdateSettings }: LabSectionProps) {
  const handleChange = <K extends keyof LabSettings>(key: K, value: LabSettings[K]) => {
    sound.playHover();
    onUpdateSettings({
      ...labSettings,
      [key]: value
    });
  };

  const presets = [
    {
      name: 'QUANTUM LATTICE',
      settings: {
        geometry: 'crystalMatrix' as const,
        wireframe: false,
        rotationSpeed: 0.8,
        particleCount: 2000,
        primaryColor: '#00f0ff',
        accentColor: '#d946ef',
        metalness: 0.9,
        roughness: 0.1,
        bloomIntensity: 1.5,
        lightIntensity: 3.0
      }
    },
    {
      name: 'ZERO-TRUST MESH',
      settings: {
        geometry: 'icosahedron' as const,
        wireframe: true,
        rotationSpeed: 1.2,
        particleCount: 1500,
        primaryColor: '#10b981',
        accentColor: '#00f0ff',
        metalness: 0.85,
        roughness: 0.1,
        bloomIntensity: 1.8,
        lightIntensity: 2.8
      }
    },
    {
      name: 'SOC AI MATRIX',
      settings: {
        geometry: 'octahedron' as const,
        wireframe: false,
        rotationSpeed: 0.6,
        particleCount: 2200,
        primaryColor: '#3b82f6',
        accentColor: '#8b5cf6',
        metalness: 0.95,
        roughness: 0.05,
        bloomIntensity: 2.0,
        lightIntensity: 3.2
      }
    },
    {
      name: 'RED TEAM ALERT',
      settings: {
        geometry: 'torusKnot' as const,
        wireframe: true,
        rotationSpeed: 1.5,
        particleCount: 2800,
        primaryColor: '#ef4444',
        accentColor: '#f59e0b',
        metalness: 0.7,
        roughness: 0.2,
        bloomIntensity: 2.2,
        lightIntensity: 3.5
      }
    }
  ];

  return (
    <section id="lab" className="relative z-10 py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs tracking-[0.25em] mb-2 uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>WAR ROOM // THREAT VECTOR & ENCRYPTION SIMULATOR</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-wider text-white uppercase font-sans">
            WAR ROOM SIMULATOR
          </h2>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                sound.playClick();
                onUpdateSettings(preset.settings);
              }}
              onMouseEnter={() => sound.playHover()}
              className="px-3.5 py-1.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-300 hover:bg-purple-500 hover:text-black font-mono text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer"
              data-cursor-hover
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel 1: Geometry & Topology */}
        <LiquidCard
          color1="#00f0ff"
          color2="#3b82f6"
          className="rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase border-b border-white/10 pb-3 font-bold">
              <Shield className="w-4 h-4" />
              <span>01 // SHIELD & MATRIX GEOMETRY</span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                FORCEFIELD TOPOLOGY
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'crystalMatrix', label: 'LATTICE VAULT' },
                  { id: 'icosahedron', label: 'ICOSA SHIELD' },
                  { id: 'octahedron', label: 'SOC MATRIX' },
                  { id: 'torusKnot', label: 'TORUS NODE' },
                  { id: 'dodecahedron', label: 'DODECA CELL' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleChange('geometry', g.id as LabSettings['geometry'])}
                    className={`px-3 py-2 rounded-xl text-xs font-mono tracking-wider border transition-all cursor-pointer ${
                      labSettings.geometry === g.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wireframe Toggle */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" /> WIREFRAME RADAR MODE
              </span>
              <button
                onClick={() => handleChange('wireframe', !labSettings.wireframe)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  labSettings.wireframe ? 'bg-cyan-400' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-black transition-transform ${
                    labSettings.wireframe ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </LiquidCard>

        {/* Panel 2: Physics & Motion */}
        <LiquidCard
          color1="#a855f7"
          color2="#ec4899"
          className="rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs tracking-widest uppercase border-b border-white/10 pb-3 font-bold">
              <Zap className="w-4 h-4" />
              <span>02 // ATTACK VECTOR DYNAMICS</span>
            </div>

            {/* Rotation Speed Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span>FIREWALL REFRESH VELOCITY</span>
                <span className="text-cyan-400">{labSettings.rotationSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.5"
                step="0.1"
                value={labSettings.rotationSpeed}
                onChange={(e) => handleChange('rotationSpeed', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Particle Density */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span>TELEMETRY EVENT STREAM</span>
                <span className="text-purple-400">{labSettings.particleCount} LOGS/s</span>
              </div>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={labSettings.particleCount}
                onChange={(e) => handleChange('particleCount', parseInt(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>
        </LiquidCard>

        {/* Panel 3: Optics & Color */}
        <LiquidCard
          color1="#10b981"
          color2="#00f0ff"
          className="rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase border-b border-white/10 pb-3 font-bold">
              <Cpu className="w-4 h-4" />
              <span>03 // CHROMATIC RAYTRACING</span>
            </div>

            {/* Primary Color Picker */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                PRIMARY MATRIX SPECTRUM
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={labSettings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-cyan-300">{labSettings.primaryColor}</span>
              </div>
            </div>

            {/* Accent Color Picker */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                ACCENT RAY DISPERSION
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={labSettings.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-purple-300">{labSettings.accentColor}</span>
              </div>
            </div>
          </div>
        </LiquidCard>
      </div>
    </section>
  );
}
