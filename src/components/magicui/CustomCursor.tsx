import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const isArtworkImage = target?.closest('[data-artwork-card]') || target?.closest('[data-artwork-preview]');
      setIsHoveringImage(Boolean(isArtworkImage));
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden md:block">
      {/* Trailing golden halo */}
      <motion.div
        className="fixed top-0 left-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHoveringImage ? 2.6 : 1,
          borderColor: isHoveringImage ? 'rgba(212, 175, 55, 0.8)' : 'rgba(212, 175, 55, 0.4)',
          backgroundColor: isHoveringImage ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.05)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.2 }}
      >
        {isHoveringImage && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-full w-full items-center justify-center text-[7px] font-bold tracking-widest text-[#FFE599] uppercase"
          >
            Ver
          </motion.span>
        )}
      </motion.div>

      {/* Center pinpoint */}
      <motion.div
        className="fixed top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFE599]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ duration: 0 }}
      />
    </div>
  );
};
