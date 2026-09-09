import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  colors = ['#D4AF37', '#FFF3D1', '#F5D061', '#E6BE45', '#D4AF37'],
  animationSpeed = 6,
}) => {
  const gradientString = colors.join(', ');

  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent font-serif bg-[length:300%_auto] ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradientString})`,
      }}
      animate={{
        backgroundPosition: ['0% center', '200% center'],
      }}
      transition={{
        repeat: Infinity,
        repeatType: 'loop',
        duration: animationSpeed,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
};
