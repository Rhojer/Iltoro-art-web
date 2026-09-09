import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { sound } from '../../lib/sound';
import type { Artwork } from '../../types';

interface RoomSimulatorProps {
  artwork: Artwork;
  onClose: () => void;
  onReserve: (artwork: Artwork) => void;
}

export const RoomSimulator: React.FC<RoomSimulatorProps> = ({ artwork, onClose, onReserve }) => {
  const [roomStyle, setRoomStyle] = useState<'minimal' | 'dark' | 'loft'>('minimal');
  const [frameStyle, setFrameStyle] = useState<'none' | 'black' | 'gold'>('gold');

  // Room background configurations
  const rooms = {
    minimal: {
      name: 'Salón Blanco Nórdico',
      wallBg: 'bg-[#F2F1ED]',
      floorBg: 'bg-[#C4A482]',
      furniture: '🛋️',
      wallTextColor: 'text-zinc-800',
    },
    dark: {
      name: 'Galería Nocturna Carbón',
      wallBg: 'bg-[#18191E]',
      floorBg: 'bg-[#2B2724]',
      furniture: '🛋️',
      wallTextColor: 'text-zinc-200',
    },
    loft: {
      name: 'Loft Industrial Cemento',
      wallBg: 'bg-[#3A3B40]',
      floorBg: 'bg-[#8B7355]',
      furniture: '🛋️',
      wallTextColor: 'text-zinc-100',
    },
  };

  const getFrameClass = () => {
    switch (frameStyle) {
      case 'black':
        return 'border-[10px] border-zinc-950 shadow-2xl shadow-black/80';
      case 'gold':
        return 'border-[12px] border-[#C5A880] shadow-2xl shadow-[#D4AF37]/20';
      default:
        return 'border-[2px] border-white/20 shadow-2xl shadow-black/60';
    }
  };

  // Calculate proportional visual scale (100cm = 180px base)
  const baseScale = 1.3;
  const pixelWidth = Math.min(Math.max(artwork.widthCm * baseScale, 180), 380);
  const pixelHeight = Math.min(Math.max(artwork.heightCm * baseScale, 150), 340);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0E0F13] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Simulador a Escala Real
            </span>
            <h3 className="font-serif text-2xl text-white">{artwork.title}</h3>
            <p className="text-xs text-zinc-400">
              Dimensiones de la pieza: {artwork.dimensions} · Montaje en pared
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Interactive Virtual Room Viewport */}
        <div className={`relative flex-1 overflow-hidden ${rooms[roomStyle].wallBg} transition-colors duration-700 flex flex-col justify-between p-8`}>
          {/* Ceiling Spotlight Ambient Cone */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[500px] bg-gradient-to-b from-white/30 via-white/5 to-transparent blur-2xl" />

          {/* Wall Hanging Artwork with real scale and shadow */}
          <div className="relative z-10 flex flex-1 items-center justify-center">
            <motion.div
              layout
              style={{ width: `${pixelWidth}px`, height: `${pixelHeight}px` }}
              className={`relative overflow-hidden rounded-2xl ${getFrameClass()} transition-all duration-300`}
            >
              <img
                src={artwork.images[0]}
                alt={artwork.title}
                className="h-full w-full object-cover object-center"
              />
            </motion.div>
          </div>

          {/* Floor & Luxury Furniture Mockup */}
          <div className="relative z-10 flex items-end justify-center pt-8">
            <div className="flex flex-col items-center">
              {/* Sofa / Furniture Silhouette Indicator */}
              <div className="h-16 w-80 rounded-t-3xl bg-zinc-900/60 shadow-lg backdrop-blur-sm border-t border-white/10 flex items-center justify-center text-xs text-zinc-400">
                <span>Sofá de Referencia (2.20 m)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#121316] p-4 sm:px-6">
          {/* Room Ambient Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium mr-2">Ambiente:</span>
            {(['minimal', 'dark', 'loft'] as const).map((style) => (
              <button
                key={style}
                onClick={() => {
                  sound.playClick();
                  setRoomStyle(style);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  roomStyle === style
                    ? 'bg-[#D4AF37] text-zinc-950 font-semibold'
                    : 'border border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {rooms[style].name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Frame Style Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium mr-2">Marco:</span>
            {(['none', 'black', 'gold'] as const).map((frame) => (
              <button
                key={frame}
                onClick={() => {
                  sound.playClick();
                  setFrameStyle(frame);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  frameStyle === frame
                    ? 'bg-[#D4AF37] text-zinc-950 font-semibold'
                    : 'border border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {frame === 'none' ? 'Sin Marco' : frame === 'black' ? 'Negro Ébano' : 'Oro Clásico'}
              </button>
            ))}
          </div>

          {/* Reserve CTA */}
          {artwork.status === 'available' && (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
                onReserve(artwork);
              }}
              className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A880] px-5 py-2 text-xs font-semibold text-zinc-950 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Apartar Esta Obra
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
