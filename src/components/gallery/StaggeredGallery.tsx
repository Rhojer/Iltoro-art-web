import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ArtworkCard } from './ArtworkCard';
import { BlurFade } from '../magicui/BlurFade';
import { sound } from '../../lib/sound';
import type { Artwork } from '../../types';

interface StaggeredGalleryProps {
  artworks: Artwork[];
  onSelectArtwork: (artwork: Artwork) => void;
  onRoomView: (artwork: Artwork) => void;
  onReserve: (artwork: Artwork) => void;
}

export const StaggeredGallery: React.FC<StaggeredGalleryProps> = ({
  artworks,
  onSelectArtwork,
  onRoomView,
  onReserve,
}) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'featured'>('all');

  const filteredArtworks = artworks.filter((art) => {
    if (filter === 'available') return art.status === 'available';
    if (filter === 'featured') return art.isFeatured;
    return true;
  });

  // Distribute items into 3 columns for desktop (lg)
  const col1: Artwork[] = [];
  const col2: Artwork[] = [];
  const col3: Artwork[] = [];

  filteredArtworks.forEach((art, index) => {
    if (index % 3 === 0) col1.push(art);
    else if (index % 3 === 1) col2.push(art);
    else col3.push(art);
  });

  // Distribute items into 2 columns for tablet (md)
  const medCol1: Artwork[] = [];
  const medCol2: Artwork[] = [];
  filteredArtworks.forEach((art, index) => {
    if (index % 2 === 0) medCol1.push(art);
    else medCol2.push(art);
  });

  const handleFilterChange = (newFilter: 'all' | 'available' | 'featured') => {
    sound.playClick();
    setFilter(newFilter);
  };

  return (
    <section id="gallery-section" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end mb-12">
        <div>
          <BlurFade delay={0.05}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold text-[#FFE599] uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Colección Original & Adquisiciones</span>
            </div>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h2 className="font-serif text-3xl font-normal text-white sm:text-5xl lg:text-5xl">
              Galería de Obras Exclusivas
            </h2>
            <p className="mt-2 text-sm text-zinc-400 font-light max-w-xl">
              Lienzos de gran formato, pigmentos minerales puros y acabados en pan de oro de 24 quilates.
            </p>
          </BlurFade>
        </div>

        {/* Filter Tabs */}
        <BlurFade delay={0.15}>
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#121316]/90 p-1.5 backdrop-blur-xl shadow-lg">
            <button
              onClick={() => handleFilterChange('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#D4AF37] text-zinc-950 font-semibold shadow-md shadow-[#D4AF37]/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todas ({artworks.length})
            </button>
            <button
              onClick={() => handleFilterChange('available')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                filter === 'available'
                  ? 'bg-[#D4AF37] text-zinc-950 font-semibold shadow-md shadow-[#D4AF37]/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Disponibles ({artworks.filter((a) => a.status === 'available').length})
            </button>
            <button
              onClick={() => handleFilterChange('featured')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                filter === 'featured'
                  ? 'bg-[#D4AF37] text-zinc-950 font-semibold shadow-md shadow-[#D4AF37]/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Destacadas
            </button>
          </div>
        </BlurFade>
      </div>

      {/* DESKTOP LAYOUT (3 Columns with Staggered Center Column) */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-start">
        {/* Column 1 (Left) */}
        <div className="flex flex-col space-y-8">
          <AnimatePresence mode="popLayout">
            {col1.map((art, i) => (
              <BlurFade key={art.id} delay={0.08 + i * 0.08}>
                <ArtworkCard
                  artwork={art}
                  index={i * 3}
                  onSelect={onSelectArtwork}
                  onRoomView={onRoomView}
                  onReserve={onReserve}
                />
              </BlurFade>
            ))}
          </AnimatePresence>
        </div>

        {/* Column 2 (Center - Museum Staggered Downward) */}
        <div className="flex flex-col space-y-8 lg:mt-14">
          <AnimatePresence mode="popLayout">
            {col2.map((art, i) => (
              <BlurFade key={art.id} delay={0.12 + i * 0.08}>
                <ArtworkCard
                  artwork={art}
                  index={i * 3 + 1}
                  onSelect={onSelectArtwork}
                  onRoomView={onRoomView}
                  onReserve={onReserve}
                />
              </BlurFade>
            ))}
          </AnimatePresence>
        </div>

        {/* Column 3 (Right - Offset) */}
        <div className="flex flex-col space-y-8 lg:mt-6">
          <AnimatePresence mode="popLayout">
            {col3.map((art, i) => (
              <BlurFade key={art.id} delay={0.16 + i * 0.08}>
                <ArtworkCard
                  artwork={art}
                  index={i * 3 + 2}
                  onSelect={onSelectArtwork}
                  onRoomView={onRoomView}
                  onReserve={onReserve}
                />
              </BlurFade>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* TABLET LAYOUT (2 Columns) */}
      <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-6 items-start">
        <div className="flex flex-col space-y-6">
          <AnimatePresence mode="popLayout">
            {medCol1.map((art, i) => (
              <BlurFade key={art.id} delay={0.08 + i * 0.08}>
                <ArtworkCard
                  artwork={art}
                  index={i * 2}
                  onSelect={onSelectArtwork}
                  onRoomView={onRoomView}
                  onReserve={onReserve}
                />
              </BlurFade>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex flex-col space-y-6 md:mt-10">
          <AnimatePresence mode="popLayout">
            {medCol2.map((art, i) => (
              <BlurFade key={art.id} delay={0.12 + i * 0.08}>
                <ArtworkCard
                  artwork={art}
                  index={i * 2 + 1}
                  onSelect={onSelectArtwork}
                  onRoomView={onRoomView}
                  onReserve={onReserve}
                />
              </BlurFade>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE LAYOUT (1 Single Column in Natural Order) */}
      <div className="flex flex-col space-y-6 md:hidden">
        <AnimatePresence mode="popLayout">
          {filteredArtworks.map((art, i) => (
            <BlurFade key={art.id} delay={0.06 + i * 0.06}>
              <ArtworkCard
                artwork={art}
                index={i}
                onSelect={onSelectArtwork}
                onRoomView={onRoomView}
                onReserve={onReserve}
              />
            </BlurFade>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
