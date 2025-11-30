import React, { useMemo } from 'react';
import { SigilProps } from '../types';

export const Sigil: React.FC<SigilProps> = ({ initials, lifePath, zodiacSign, size = 200 }) => {
  
  const generatedShapes = useMemo(() => {
    // Deterministic randomness based on props
    const seed = initials.length + lifePath + (zodiacSign.length || 0);
    const strokeColor = "#D4AF37";
    const strokeWidth = 1.5;
    
    // Polygon calculation
    const sides = Math.max(3, lifePath % 9 || 3); 
    const radius = size * 0.4;
    const center = size / 2;
    
    const polygonPoints = Array.from({ length: sides }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
    }).join(' ');

    // Inner lines based on initials char codes
    const innerLines = initials.split('').map((char, i) => {
      const code = char.charCodeAt(0);
      const angle1 = (code % 360) * (Math.PI / 180);
      const angle2 = ((code * 2) % 360) * (Math.PI / 180);
      const r = radius * 0.8;
      
      const x1 = center + r * Math.cos(angle1);
      const y1 = center + r * Math.sin(angle1);
      const x2 = center + r * Math.cos(angle2);
      const y2 = center + r * Math.sin(angle2);

      return (
        <line 
          key={`line-${i}`} 
          x1={x1} y1={y1} x2={x2} y2={y2} 
          stroke={strokeColor} 
          strokeWidth={strokeWidth}
          opacity={0.8}
        />
      );
    });

    // Outer circle decoration
    const hasOuterRing = seed % 2 === 0;

    return (
      <g>
        {/* Glow Filter */}
        <defs>
          <filter id="sigilGlow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {hasOuterRing && (
          <circle 
            cx={center} cy={center} r={radius * 1.1} 
            fill="none" stroke={strokeColor} strokeWidth={1} 
            strokeDasharray="4 4"
            opacity={0.5}
          />
        )}
        
        <polygon 
          points={polygonPoints} 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth={strokeWidth * 1.5}
          filter="url(#sigilGlow)"
        />
        
        {innerLines}
        
        <circle cx={center} cy={center} r={3} fill={strokeColor} />
      </g>
    );
  }, [initials, lifePath, zodiacSign, size]);

  return (
    <div className="relative flex items-center justify-center animate-spin-slow" style={{ animationDuration: '60s' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {generatedShapes}
      </svg>
    </div>
  );
};
