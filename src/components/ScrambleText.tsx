import React, { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealSpeed?: number;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4';
}

const CYBER_CHARACTERS = '░▒▓█<>/_[]{}+-*^!@#$0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function ScrambleText({
  text,
  className = '',
  scrambleSpeed = 30,
  revealSpeed = 2,
  as: Component = 'span'
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isRevealed) {
            triggerScramble();
            setIsRevealed(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, isRevealed]);

  const triggerScramble = () => {
    let iteration = 0;
    const maxIterations = text.length * revealSpeed;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n') return char;
            if (index < iteration / revealSpeed) {
              return text[index];
            }
            return CYBER_CHARACTERS[Math.floor(Math.random() * CYBER_CHARACTERS.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        setDisplayText(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1;
    }, scrambleSpeed);
  };

  const handleMouseEnter = () => {
    triggerScramble();
  };

  const Tag = Component as any;

  return (
    <Tag
      ref={elementRef}
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </Tag>
  );
}
