import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Home, ShoppingBag, ShieldCheck, QrCode, Clock } from 'lucide-react';
import { formatPrice, getRemainingTime } from '../../lib/utils';
import { sound } from '../../lib/sound';
import type { Artwork } from '../../types';

interface ArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
  onRoomView: (artwork: Artwork) => void;
  onReserve: (artwork: Artwork) => void;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({
  artwork,
  onClose,
  onRoomView,
  onReserve,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showCOA, setShowCOA] = useState(false);
  const [, setTick] = useState(0);

  React.useEffect(() => {
    if (artwork.status === 'reserved') {
      const interval = setInterval(() => {
        setTick((t) => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [artwork.status]);

  const remaining = getRemainingTime(artwork.reservedAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0E0F13] shadow-2xl lg:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/60 text-zinc-300 backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Interactive Deep Zoom Canvas & Thumbnails */}
        <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-black/40 p-6 lg:p-8">
          <div
            onClick={() => setIsZoomed(!isZoomed)}
            className={`relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-zinc-950/80 cursor-zoom-in ${
              isZoomed ? 'cursor-zoom-out' : ''
            }`}
          >
            <motion.img
              src={artwork.images[activeImageIndex] || artwork.images[0]}
              alt={artwork.title}
              animate={{ scale: isZoomed ? 1.9 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="max-h-[55vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Zoom hint badge */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-xs text-zinc-300 backdrop-blur-md">
              <ZoomIn className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>{isZoomed ? 'Reducir' : 'Zoom HD'}</span>
            </div>
          </div>

          {/* Image Thumbnails Strip */}
          {artwork.images.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              {artwork.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setActiveImageIndex(idx);
                  }}
                  className={`h-14 w-14 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#D4AF37] scale-105 shadow-md shadow-[#D4AF37]/30'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Artwork Dossier & Acquisition Specs */}
        <div className="flex w-full flex-col justify-between overflow-y-auto border-t border-white/10 bg-[#121316] p-6 lg:w-[460px] lg:border-t-0 lg:border-l lg:p-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#D4AF37] tracking-wider">{artwork.code}</span>
                <span className="text-xs text-zinc-400">{artwork.year}</span>
              </div>
              <h2 className="mt-1 font-serif text-3xl font-normal text-white sm:text-4xl">
                {artwork.title}
              </h2>
              <p className="mt-1 text-xs text-[#C5A880] tracking-wide uppercase font-semibold">
                {artwork.medium}
              </p>
            </div>

            {/* Status & Investment Box */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Inversión</span>
                  <span className="font-serif text-3xl font-normal text-[#D4AF37]">
                    {formatPrice(artwork.price, artwork.currency)}
                  </span>
                </div>
                <div>
                  {artwork.status === 'available' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-3 py-1 text-xs font-semibold text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Disponible
                    </span>
                  ) : artwork.status === 'reserved' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/80 px-3 py-1 text-xs font-semibold text-amber-300">
                      <Clock className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                      Apartado ({remaining.minutes}m restantes)
                    </span>
                  ) : (
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400 font-mono">
                      Vendido
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Artwork Story & Concept */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Concepto & Historia</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-300 font-light">
                {artwork.story}
              </p>
            </div>

            {/* Color Palette & Minerals */}
            {artwork.palette && artwork.palette.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Paleta Cromática & Pigmentos
                </h4>
                <div className="flex items-center gap-2">
                  {artwork.palette.map((color, i) => (
                    <div
                      key={i}
                      className="group relative h-7 w-7 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-mono text-white group-hover:block whitespace-nowrap">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
                {artwork.pigments && (
                  <p className="mt-2 text-[11px] text-zinc-400 font-mono">
                    {artwork.pigments.join(' · ')}
                  </p>
                )}
              </div>
            )}

            {/* Authenticity Certificate Guarantee Preview Button */}
            <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <h5 className="text-xs font-medium text-white">Certificado de Autenticidad (COA)</h5>
                  <p className="text-[10px] text-zinc-400">Firmado por el artista con sello de lacre y QR</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowCOA(true);
                }}
                className="text-xs text-[#FFE599] hover:underline cursor-pointer font-medium"
              >
                Ver COA
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-2.5 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                sound.playClick();
                onRoomView(artwork);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 py-3 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-[#D4AF37]/60 cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>Ver en tu Habitación (Escala 3D)</span>
            </button>

            {artwork.status === 'available' && (
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onReserve(artwork);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A880] py-3.5 text-xs font-semibold text-zinc-950 shadow-lg shadow-[#D4AF37]/20 transition-all hover:shadow-[#D4AF37]/40 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Apartar por 1 Hora & Hablar por WhatsApp</span>
              </button>
            )}
          </div>
        </div>

        {/* COA Modal Overlay */}
        <AnimatePresence>
          {showCOA && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/95 p-6 backdrop-blur-xl"
            >
              <div className="relative max-w-md rounded-3xl border-2 border-[#D4AF37]/40 bg-[#16171D] p-8 text-center shadow-2xl">
                <button
                  onClick={() => setShowCOA(false)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
                  <ShieldCheck className="h-7 w-7" />
                </div>

                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                  Documento Oficial de Autenticidad
                </span>
                <h3 className="mt-1 font-serif text-2xl text-white font-normal">
                  Certificado de Originalidad
                </h3>

                <div className="my-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Código Único:</span>
                    <span className="text-white font-bold">{artwork.code}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Título:</span>
                    <span className="text-white">{artwork.title}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Dimensiones:</span>
                    <span className="text-white">{artwork.dimensions}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Año de Creación:</span>
                    <span className="text-white">{artwork.year}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                  <QrCode className="h-4 w-4 text-[#D4AF37]" />
                  <span>Verificación criptográfica y firma hológrafa</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
