import React, { useEffect, useState, useId } from 'react';
import { motion } from 'framer-motion';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  borderRadius?: number;
  cycleInterval?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = "",
  borderWidth = 2.4,
  colorFrom = "#D4AF37",
  colorTo = "#FFFFFF",
  delay = 3.9, // Synchronized to activate right when the silhouette light beam fades
  cycleInterval = 8500,
  borderRadius = 32,
}) => {
  const [cycle, setCycle] = useState(0);
  const reactId = useId().replace(/:/g, '');

  useEffect(() => {
    const interval = setInterval(() => {
      setCycle((prev) => prev + 1);
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [cycleInterval]);

  const uniqueId = `beam-${reactId}`;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 overflow-hidden ${className}`}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      <svg
        key={`border-beam-svg-${cycle}`}
        className="h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="0" />
            <stop offset="35%" stopColor={colorTo} stopOpacity="1" />
            <stop offset="65%" stopColor="#FFE599" stopOpacity="1" />
            <stop offset="100%" stopColor={colorFrom} stopOpacity="0" />
          </linearGradient>

          <filter id={`glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur1" />
            <feGaussianBlur stdDeviation="5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Single continuous unsegmented light beam traversing the perimeter */}
        <motion.rect
          x="0.8"
          y="0.8"
          width="98.4"
          height="98.4"
          rx="6"
          ry="6"
          fill="none"
          stroke={`url(#grad-${uniqueId})`}
          strokeWidth={borderWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          filter={`url(#glow-${uniqueId})`}
          pathLength={1000}
          strokeDasharray="180 1000"
          initial={{ strokeDashoffset: 1000, opacity: 0 }}
          animate={{
            strokeDashoffset: [1000, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            delay: delay,
            duration: 3.2,
            times: [0, 0.15, 0.85, 1],
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};
