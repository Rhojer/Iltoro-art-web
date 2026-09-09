import React, { useEffect, useState, useId } from 'react';
import { motion } from 'framer-motion';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  borderRadius?: number;
  cycleInterval?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = "",
  borderWidth = 2,
  colorFrom = "#D4AF37",
  colorTo = "#FFFFFF",
  delay = 3.9, // Activates exactly when the bull silhouette light beam dissolves
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
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="0" />
            <stop offset="50%" stopColor={colorTo} stopOpacity="1" />
            <stop offset="100%" stopColor={colorFrom} stopOpacity="0" />
          </linearGradient>

          <filter id={`glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur1" />
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Perimeter Laser Beam Travel */}
        <motion.rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={`calc(100% - ${borderWidth}px)`}
          height={`calc(100% - ${borderWidth}px)`}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={`url(#grad-${uniqueId})`}
          strokeWidth={borderWidth * 1.5}
          strokeLinecap="round"
          filter={`url(#glow-${uniqueId})`}
          strokeDasharray="140 400"
          initial={{ strokeDashoffset: 0, opacity: 0 }}
          animate={{
            strokeDashoffset: [-600, 600],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            delay: delay,
            duration: 2.8,
            times: [0, 0.2, 0.8, 1],
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};
