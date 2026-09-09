const fs = require('fs');
const centerlineData = JSON.parse(fs.readFileSync('src/components/magicui/bull-centerline.json', 'utf8'));

const componentCode = `import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../../lib/sound';

// 100% Exact Single-Stroke Centerline Path generated directly from the user's image
const SINGLE_LINE_BULL_PATH = ${JSON.stringify(centerlineData.d)};
const VIEWBOX_W = ${centerlineData.width};
const VIEWBOX_H = ${centerlineData.height};

export const TracingLightBeam: React.FC = () => {
  const [animationCycle, setAnimationCycle] = useState(0);

  useEffect(() => {
    // Sound resonance trigger timed when the continuous line is drawn
    const soundTimer = setTimeout(() => {
      sound.playBullResonance();
    }, 2200);

    const cycleInterval = setInterval(() => {
      setAnimationCycle((prev) => prev + 1);
    }, 9500);

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
            <stop offset="50%" stopColor="#FFE599" stopOpacity="0.9" />
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
            duration: 1.6,
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
            delay: 4.2,
            duration: 2.0,
            times: [0, 0.45, 0.9],
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* 2. TRUE SINGLE CONTINUOUS LINE DRAWING: Draws from start to finish without lifting */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 w-80 h-72 overflow-visible">
        <svg
          key={\`single-stroke-bull-\${animationCycle}\`}
          className="w-full h-full overflow-visible"
          viewBox={\`0 0 \${VIEWBOX_W} \${VIEWBOX_H}\`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="singleStrokeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="s1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="s2" />
              <feMerge>
                <feMergeNode in="s2" />
                <feMergeNode in="s1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="singleLineLaserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="40%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#FFE599" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>

          {/* Faint ambient guide rail for depth */}
          <path
            d={SINGLE_LINE_BULL_PATH}
            fill="none"
            stroke="rgba(212, 175, 55, 0.12)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* THE SINGLE LASER STROKE: Physically traces the bull line from start to finish */}
          <motion.path
            d={SINGLE_LINE_BULL_PATH}
            fill="none"
            stroke="url(#singleLineLaserGrad)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#singleStrokeGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1], // Pure continuous line draw from 0% to 100%
              opacity: [0, 1, 1, 0], // Appears, stays complete for 1.5s, then dissolves
            }}
            transition={{
              delay: 0.9,
              duration: 3.4, // 2.0s continuous draw + 1.4s hold + smooth dissolve
              times: [0, 0.58, 0.85, 1],
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
console.log('Single-line TracingLightBeam generated successfully!');
