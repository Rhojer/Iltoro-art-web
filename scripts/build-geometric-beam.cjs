const fs = require('fs');
const pathData = JSON.parse(fs.readFileSync('src/components/magicui/geometric-bull-path.json', 'utf8'));

const componentCode = `import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../../lib/sound';

// Exact Single-Stroke Centerline Path generated directly from the user's latest geometric bull image
const GEOMETRIC_BULL_PATH = ${JSON.stringify(pathData.d)};
const VIEWBOX_W = ${pathData.width};
const VIEWBOX_H = ${pathData.height};

export const TracingLightBeam: React.FC = () => {
  const [animationCycle, setAnimationCycle] = useState(0);

  useEffect(() => {
    // Sound resonance trigger timed when the continuous line is drawn
    const soundTimer = setTimeout(() => {
      sound.playBullResonance();
    }, 1800);

    const cycleInterval = setInterval(() => {
      setAnimationCycle((prev) => prev + 1);
    }, 8500);

    return () => {
      clearTimeout(soundTimer);
      clearInterval(cycleInterval);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden md:block w-48 sm:w-56 lg:w-64 overflow-visible">
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
          <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFE599" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <filter id="railLaserGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="g1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="g2" />
            <feMerge>
              <feMergeNode in="g2" />
              <feMergeNode in="g1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top rail down to viewport center (y = 500) */}
        <motion.path
          d="M 40 0 L 40 370"
          stroke="url(#laserBeamGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          filter="url(#railLaserGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            opacity: [0, 1, 0], // Fades away completely 1.5s after passing
          }}
          transition={{
            duration: 1.4,
            times: [0, 0.45, 0.9],
            ease: "easeInOut",
          }}
        />

        {/* Bottom rail continuing down from center (y = 630) to bottom */}
        <motion.path
          d="M 40 630 L 40 1000"
          stroke="url(#laserBeamGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          filter="url(#railLaserGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            opacity: [0, 1, 0], // Fades away completely 1.5s after passing
          }}
          transition={{
            delay: 3.8,
            duration: 1.6,
            times: [0, 0.45, 0.9],
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* 2. GEOMETRIC BULL SINGLE CONTINUOUS STROKE - Prominent, majestic size (w-48 to w-60) */}
      <div className="absolute top-1/2 left-4 sm:left-6 lg:left-8 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 overflow-visible">
        <svg
          key={\`geo-bull-trace-\${animationCycle}\`}
          className="w-full h-full overflow-visible"
          viewBox={\`0 0 \${VIEWBOX_W} \${VIEWBOX_H}\`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="geoLaserGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="s1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="s2" />
              <feMerge>
                <feMergeNode in="s2" />
                <feMergeNode in="s1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="geoLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="35%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#FFE599" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>

          {/* SINGLE LASER STROKE: Completely OFF/INVISIBLE until drawn, stays 1.5s, dissolves to 0 */}
          <motion.path
            d={GEOMETRIC_BULL_PATH}
            fill="none"
            stroke="url(#geoLineGrad)"
            strokeWidth="3.0"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#geoLaserGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 1], // Physically traces the entire geometry
              opacity: [0, 1, 1, 0], // Inactive (0) -> Visible during draw (1) -> Holds 1.5s -> Completely turned off (0)
            }}
            transition={{
              delay: 0.8,
              duration: 3.1, // 1.6s draw + 1.5s hold + smooth turn off
              times: [0, 0.52, 0.85, 1],
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
console.log('TracingLightBeam updated with prominent, majestic size!');
