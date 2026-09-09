import React from 'react';
import { Eye, Home, ShoppingBag, Clock } from 'lucide-react';
import { TiltCard } from '../magicui/TiltCard';
import { SpotlightCard } from '../magicui/Spotlight';
import { BorderBeam } from '../magicui/BorderBeam';
import { formatPrice, getRemainingTime } from '../../lib/utils';
import { sound } from '../../lib/sound';
import type { Artwork } from '../../types';

interface ArtworkCardProps {
  artwork: Artwork;
  onSelect: (artwork: Artwork) => void;
  onRoomView: (artwork: Artwork) => void;
  onReserve: (artwork: Artwork) => void;
  index?: number;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onSelect,
  onRoomView,
  onReserve,
  index = 0,
}) => {
  const remaining = getRemainingTime(artwork.reservedAt);

  const getStatusBadge = () => {
    switch (artwork.status) {
      case 'available':
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Disponible</span>
          </div>
        );
      case 'reserved':
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/80 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
            <Clock className="h-3 w-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Apartado {!remaining.isExpired ? `(${remaining.minutes}m)` : ''}</span>
          </div>
        );
      case 'sold':
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-xs font-semibold text-zinc-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
            <span>Colección Privada</span>
          </div>
        );
    }
  };

  return (
    <TiltCard tiltMaxAngleX={6} tiltMaxAngleY={6} className="w-full">
      <SpotlightCard
        data-artwork-card
        className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#121316]/90 p-4 transition-all duration-500 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/10"
      >
        {/* Artwork Image Container with Rounded Corners */}
        <div
          onClick={() => {
            sound.playClick();
            onSelect(artwork);
          }}
          className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[1.5rem] bg-zinc-950"
        >
          {/* Animated Border Beam: Activates after the silhouette light beam disappears (~3.9s) */}
          <BorderBeam
            borderRadius={24}
            delay={3.9 + (index % 6) * 0.18}
            borderWidth={2}
            colorFrom="#D4AF37"
            colorTo="#FFFFFF"
          />

          <img
            src={artwork.images[0]}
            alt={artwork.title}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {getStatusBadge()}
            <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-0.5 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
              {artwork.code}
            </span>
          </div>

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onSelect(artwork);
              }}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-xl transition-transform hover:scale-110 active:scale-95"
              title="Ver en alta resolución"
            >
              <Eye className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onRoomView(artwork);
              }}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95 hover:border-[#D4AF37]"
              title="Ver en una habitación"
            >
              <Home className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Artwork Info & Details */}
        <div className="mt-4 flex flex-col justify-between space-y-3 p-1">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>{artwork.dimensions}</span>
              <span>{artwork.year}</span>
            </div>
            <h3
              onClick={() => {
                sound.playClick();
                onSelect(artwork);
              }}
              className="mt-1 font-serif text-2xl font-normal text-white hover:text-[#FFE599] transition-colors cursor-pointer"
            >
              {artwork.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-xs text-zinc-400 font-light">
              {artwork.medium}
            </p>
          </div>

          {/* Price & Action Section */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Inversión</span>
              <span className="font-serif text-xl font-medium text-[#D4AF37]">
                {formatPrice(artwork.price, artwork.currency)}
              </span>
            </div>

            {artwork.status === 'available' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onReserve(artwork);
                }}
                className="flex items-center gap-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-3.5 py-1.5 text-xs font-semibold text-[#FFE599] transition-all hover:bg-[#D4AF37] hover:text-zinc-950 cursor-pointer active:scale-95"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Apartar (1h)</span>
              </button>
            ) : artwork.status === 'reserved' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onSelect(artwork);
                }}
                className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-xs font-medium text-amber-300 cursor-pointer"
              >
                En Negociación
              </button>
            ) : (
              <span className="text-xs text-zinc-500 font-mono">Adquirida</span>
            )}
          </div>
        </div>
      </SpotlightCard>
    </TiltCard>
  );
};
