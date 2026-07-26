import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { sound } from '../../utils/audio';

export type CardVariant = 'webgl' | 'dataviz' | 'react' | 'shaders';

interface CapabilityCardProps {
  variant: CardVariant;
  title: string;
  description: string;
  badge?: string;
  onHoverCard?: (variant: CardVariant) => void;
}

// Micro 3D Component: Rotating Glowing Wireframe Cube
function MicroWireframeCube() {
  const cubeRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.8;
      cubeRef.current.rotation.y += delta * 1.0;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={cubeRef}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshBasicMaterial color="#00f0ff" wireframe />
      </mesh>
    </Float>
  );
}

// Micro 3D Component: PBR Metallic Shader Ball (Bottom-Right Card)
function MicroPBRSphere({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetSpeed = isHovered ? 2.5 : 0.6;
  const currentSpeed = useRef(0.6);

  useFrame((state, delta) => {
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, delta * 4);
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * currentSpeed.current;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <Float speed={2} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={isHovered ? '#00f0ff' : '#d946ef'}
          metalness={isHovered ? 1.0 : 0.85}
          roughness={isHovered ? 0.05 : 0.2}
          emissive={isHovered ? '#00f0ff' : '#8b5cf6'}
          emissiveIntensity={isHovered ? 0.8 : 0.2}
        />
      </mesh>
    </Float>
  );
}

export function CapabilityCard({
  variant,
  title,
  description,
  badge,
  onHoverCard
}: CapabilityCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playHover();
    if (onHoverCard) onHoverCard(variant);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Render icon graphic based on variant
  const renderIcon = () => {
    switch (variant) {
      case 'webgl':
        return (
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }} gl={{ alpha: true }}>
              <ambientLight intensity={0.8} />
              <MicroWireframeCube />
            </Canvas>
          </div>
        );

      case 'dataviz':
        return (
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-400/40 flex items-center justify-center relative p-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            {/* Glowing Green Trend Line Graph */}
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="10" y1="20" x2="90" y2="20" stroke="#10b981" strokeOpacity="0.15" strokeWidth="1" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="#10b981" strokeOpacity="0.15" strokeWidth="1" />
              <line x1="10" y1="80" x2="90" y2="80" stroke="#10b981" strokeOpacity="0.15" strokeWidth="1" />
              {/* Area */}
              <polygon points="10,80 10,65 30,70 50,35 70,45 90,15 90,80" fill="url(#gridGrad)" />
              {/* Line */}
              <polyline
                points="10,65 30,70 50,35 70,45 90,15"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="filter drop-shadow-[0_0_6px_#10b981]"
              />
              {/* Pulsing Node Dots */}
              <circle cx="50" cy="35" r="3.5" fill="#10b981" className="animate-ping" />
              <circle cx="90" cy="15" r="4" fill="#6ee7b7" />
            </svg>
          </div>
        );

      case 'react':
        return (
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center relative p-2 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            {/* Glowing Cyan React Atom Symbol */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Center Nucleus */}
              <circle cx="50" cy="50" r="6" fill="#00f0ff" className="animate-pulse" />
              {/* 3 Orbiting Rings */}
              <ellipse
                cx="50"
                cy="50"
                rx="38"
                ry="14"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2"
                transform="rotate(0 50 50)"
                strokeOpacity="0.8"
              />
              <ellipse
                cx="50"
                cy="50"
                rx="38"
                ry="14"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2"
                transform="rotate(60 50 50)"
                strokeOpacity="0.8"
              />
              <ellipse
                cx="50"
                cy="50"
                rx="38"
                ry="14"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2"
                transform="rotate(120 50 50)"
                strokeOpacity="0.8"
              />
            </svg>
          </div>
        );

      case 'shaders':
        return (
          <div
            className={`w-16 h-16 rounded-2xl border transition-all duration-300 flex items-center justify-center overflow-hidden ${
              isHovered
                ? 'bg-cyan-950/80 border-cyan-300 shadow-[0_0_30px_rgba(0,240,255,0.6)]'
                : 'bg-purple-950/60 border-purple-400/40 shadow-[0_0_20px_rgba(217,70,239,0.2)]'
            }`}
          >
            <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} gl={{ alpha: true }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[3, 3, 3]} intensity={2.5} color={isHovered ? '#00f0ff' : '#d946ef'} />
              <MicroPBRSphere isHovered={isHovered} />
            </Canvas>
          </div>
        );
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative p-6 sm:p-8 rounded-2xl transition-all duration-500 backdrop-blur-xl border flex flex-col justify-between group cursor-pointer ${
        isHovered
          ? 'bg-black/75 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.35)] translate-y-[-4px]'
          : 'bg-black/50 border-white/10 hover:border-cyan-500/40'
      }`}
      data-cursor-hover
      data-cursor-text="INSPECT"
    >
      {/* Top Bar: Icon + Badge */}
      <div className="flex items-start justify-between mb-6">
        {renderIcon()}
        {badge && (
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 tracking-widest uppercase">
            {badge}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div>
        <h3
          className={`text-lg sm:text-xl font-bold font-sans tracking-wide uppercase transition-colors mb-2 ${
            isHovered ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'text-white'
          }`}
        >
          {title}
        </h3>
        <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Hover Indicator Border Gradient Line */}
      <div
        className={`absolute bottom-0 left-6 right-6 h-[2px] rounded-full transition-all duration-500 ${
          isHovered
            ? 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-100'
            : 'opacity-0'
        }`}
      />
    </div>
  );
}
