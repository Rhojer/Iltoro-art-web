const fs = require('fs');
const svgContent = fs.readFileSync('src/components/magicui/bull-clean.svg', 'utf8');
const match = svgContent.match(/d="([^"]+)"/);
if (!match) throw new Error('Path not found');
const pathD = match[1];

const componentCode = `import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../../lib/sound';

const EXACT_BULL_PATH = ${JSON.stringify(pathD)};

export const TracingLightBeam: React.FC = () => {
  const [animationCycle, setAnimationCycle] = useState(0);

  useEffect(() => {
    // Sound resonance trigger timed when the bull is drawn
    const soundTimer = setTimeout(() => {
      sound.playBullResonance();
    }, 1800);

    const cycleInterval = setInterval(() => {
      setAnimationCycle((prev) => prev + 1);
    }, 9000);

    return () => {
      clearTimeout(soundTimer);
      clearInterval(cycleInterval);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-96 md:block overflow-visible">
      {/* 1. Vertical Light Rails (Top to Center, and Center to Bottom) */}
      <svg
        key={\`rail-\${animationCycle}\`}
        className="h-full w-full overflow-visible"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fluidBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="60%" stopColor="#FFE599" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <filter id="railGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="g1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="g2" />
            <feMerge>
              <feMergeNode in="g2" />
              <feMergeNode in="g1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top rail down to viewport center (y = 500) */}
        <motion.path
          d="M 32 0 L 32 380"
          stroke="url(#fluidBeamGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#railGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            opacity: [0, 1, 0], // Fades away 1.5s after passing
          }}
          transition={{
            duration: 1.4,
            times: [0, 0.45, 0.9],
            ease: "easeInOut",
          }}
        />

        {/* Bottom rail continuing down from center (y = 620) to bottom */}
        <motion.path
          d="M 32 620 L 32 1000"
          stroke="url(#fluidBeamGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#railGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            opacity: [0, 1, 0], // Fades away 1.5s after passing
          }}
          transition={{
            delay: 3.2,
            duration: 1.8,
            times: [0, 0.45, 0.9],
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* 2. 100% Mathematically Exact Vector Bull - PURE STROKE TRACE (Zero Fill) */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 w-80 h-72 overflow-visible">
        <svg
          key={\`exact-bull-trace-\${animationCycle}\`}
          className="w-full h-full overflow-visible"
          viewBox="0 0 299 246"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="exactLaserGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="beamTraceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFE599" />
            </linearGradient>
          </defs>

          {/* Faint ambient guide rail */}
          <path
            d={EXACT_BULL_PATH}
            fill="none"
            stroke="rgba(212, 175, 55, 0.12)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* PHYSICAL LASER TRACE: Animates from pathLength 0 to 1 without any fill */}
          <motion.path
            d={EXACT_BULL_PATH}
            fill="none"
            stroke="url(#beamTraceGrad)"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#exactLaserGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1], // Pure continuous stroke tracing
              opacity: [0, 1, 1, 0], // Appears as it is drawn, stays glowing, then dissolves completely in 1.5s
            }}
            transition={{
              delay: 0.8,
              duration: 2.5, // 1.0s to trace physically + 1.5s to dissolve away
              times: [0, 0.4, 0.75, 1],
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/magicui/TracingLightBeam.tsx', componentCode);
console.log('TracingLightBeam updated with pure laser stroke trace!');
