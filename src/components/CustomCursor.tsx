import React, { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const posRef = useRef({ x: -100, y: -100 });
  const trailPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check hover target
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest('button, a, input, [data-cursor-hover]');
        if (interactiveEl) {
          setIsHovered(true);
          const customText = interactiveEl.getAttribute('data-cursor-text');
          setHoverText(customText || '');
        } else {
          setIsHovered(false);
          setHoverText('');
        }
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp loop for outer ring
    const render = () => {
      trailPosRef.current.x += (posRef.current.x - trailPosRef.current.x) * 0.18;
      trailPosRef.current.y += (posRef.current.y - trailPosRef.current.y) * 0.18;
      setTrailPos({ x: trailPosRef.current.x, y: trailPosRef.current.y });
      animFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      {/* Inner Dot */}
      <div
        className={`absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-100 ease-out ${
          isHovered ? 'bg-cyan-400 scale-0' : 'bg-cyan-300'
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`
        }}
      />

      {/* Outer Trailing Glowing Ring */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-out flex items-center justify-center ${
          isHovered
            ? 'w-16 h-16 bg-cyan-500/10 border-cyan-400 backdrop-blur-[2px] shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-110'
            : 'w-9 h-9 border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
        }`}
        style={{
          left: `${trailPos.x}px`,
          top: `${trailPos.y}px`
        }}
      >
        {hoverText && (
          <span className="text-[9px] font-mono tracking-widest text-cyan-300 uppercase font-bold text-center px-1 animate-pulse">
            {hoverText}
          </span>
        )}
      </div>
    </div>
  );
}
