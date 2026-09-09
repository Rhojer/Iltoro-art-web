import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  glareEnable?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  tiltMaxAngleX = 7,
  tiltMaxAngleY = 7,
  glareEnable = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rY = ((mouseX - width / 2) / (width / 2)) * tiltMaxAngleY;
    const rX = -((mouseY - height / 2) / (height / 2)) * tiltMaxAngleX;

    setRotateX(rX);
    setRotateY(rY);

    if (glareEnable) {
      setGlarePosition({
        x: (mouseX / width) * 100,
        y: (mouseY / height) * 100,
        opacity: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.15 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn('relative perspective-[1200px] transform-gpu will-change-transform', className)}
      {...(props as any)}
    >
      {glareEnable && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-[2rem] transition-opacity duration-300"
          style={{
            opacity: glarePosition.opacity,
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 245, 210, 0.35), transparent 55%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
};
