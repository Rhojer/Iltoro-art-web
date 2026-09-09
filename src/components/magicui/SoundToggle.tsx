import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../lib/sound';
import { cn } from '../../lib/utils';

export const SoundToggle: React.FC<{ className?: string }> = ({ className }) => {
  const [isMuted, setIsMuted] = useState(() => sound.getIsMuted());

  const handleToggle = () => {
    const nextState = sound.toggleMute();
    setIsMuted(nextState);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
      className={cn(
        'group relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/80 backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/10 hover:text-white',
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {!isMuted && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-75" />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', isMuted ? 'bg-zinc-600' : 'bg-[#D4AF37]')} />
      </span>

      {isMuted ? (
        <VolumeX className="h-3.5 w-3.5 text-zinc-400" />
      ) : (
        <Volume2 className="h-3.5 w-3.5 text-[#D4AF37]" />
      )}

      <span className="font-medium tracking-wide">
        {isMuted ? 'Audio Off' : 'Audio On'}
      </span>
    </button>
  );
};
