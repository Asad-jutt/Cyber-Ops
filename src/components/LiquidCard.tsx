import React, { useState, useRef, ReactNode } from 'react';
import { LiquidShaderCanvas } from './LiquidShaderCanvas';

interface LiquidCardProps {
  children: ReactNode;
  className?: string;
  color1?: string;
  color2?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export function LiquidCard({
  children,
  className = '',
  color1 = '#00f0ff',
  color2 = '#d946ef',
  onClick,
  onMouseEnter
}: LiquidCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* WebGL Liquid Hover Shader Background Layer */}
      <LiquidShaderCanvas
        isHovered={isHovered}
        mousePos={mousePos}
        color1={color1}
        color2={color2}
      />

      {/* Children Card Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
