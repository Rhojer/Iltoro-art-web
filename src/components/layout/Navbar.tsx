import React from 'react';
import { Lock } from 'lucide-react';
import { SoundToggle } from '../magicui/SoundToggle';
import { GeometricBullTrace } from '../magicui/GeometricBullTrace';
import { sound } from '../../lib/sound';

interface NavbarProps {
  onGoToStudio: () => void;
  onScrollToGallery: () => void;
  artistName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoToStudio, onScrollToGallery, artistName }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#090A0D]/80 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Artist Monogram + Adaptive Bull Light Trace */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Animated Bull Light Silhouette Badge - Shown when lateral margins are narrow/not visible */}
          <div
            onClick={() => sound.playBullResonance()}
            title="Toro De La Mora"
            className="flex min-[1380px]:hidden h-9 w-11 items-center justify-center rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-1 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.2)]"
          >
            <GeometricBullTrace
              className="w-full h-full"
              strokeWidth={3.2}
              glowId="mobileNavGlow"
              gradId="mobileNavGrad"
            />
          </div>

          {/* Desktop Wide Monogram Icon - Shown when side margins are wide */}
          <div className="hidden min-[1380px]:flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-xs font-serif font-bold text-[#FFE599] shadow-inner">
            {artistName ? artistName.charAt(0).toUpperCase() : 'V'}
          </div>

          <div>
            <span className="font-serif text-base sm:text-lg font-normal tracking-wide text-white block leading-tight">
              {artistName}
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase block">
              Atelier & Fine Arts
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          {/* Sound Synthesizer Toggle */}
          <SoundToggle />

          {/* Explore Gallery Shortcut */}
          <button
            onClick={() => {
              sound.playClick();
              onScrollToGallery();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer transition-all"
          >
            <span>Obras</span>
          </button>

          {/* Discrete Artist Admin Access */}
          <button
            onClick={() => {
              sound.playClick();
              onGoToStudio();
            }}
            aria-label="Acceso Studio"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:border-[#D4AF37]/50 hover:bg-white/5 hover:text-[#FFE599] cursor-pointer transition-all"
            title="Acceso Privado Artista"
          >
            <Lock className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
