import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { sound } from '../../lib/sound';

interface StudioLoginProps {
  onLoginSuccess: () => void;
  onBackToPublic: () => void;
}

export const StudioLogin: React.FC<StudioLoginProps> = ({ onLoginSuccess, onBackToPublic }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    // Default artist master password or quick entrance
    if (password === 'artista2026' || password === 'admin' || password === 'valentin' || password === '') {
      onLoginSuccess();
    } else {
      setError('Contraseña incorrecta. (Prueba con "artista2026" o déjalo vacío para modo demo)');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090A0D] p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#121316] p-8 shadow-2xl"
      >
        <button
          onClick={() => {
            sound.playClick();
            onBackToPublic();
          }}
          className="mb-6 inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a la Galería Pública</span>
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
            <Lock className="h-6 w-6" />
          </div>
          <span className="font-mono text-xs text-[#D4AF37] uppercase tracking-widest">
            Portal Privado
          </span>
          <h2 className="mt-1 font-serif text-3xl font-normal text-white">
            Atelier & Studio CMS
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Administración de obras, inventario y solicitudes de WhatsApp
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
              Clave de Acceso del Artista
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Ingresa tu clave de artista..."
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#D4AF37] focus:outline-none"
            />
            {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
          </div>

          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A880] py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-[#D4AF37]/20 transition-all hover:shadow-[#D4AF37]/40 active:scale-95"
          >
            <span>Acceder al Studio</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 border-t border-white/5 pt-4 text-center">
          <span className="text-[10px] text-zinc-500 font-mono">
            Tip: Presiona Acceder directamente para explorar el panel
          </span>
        </div>
      </motion.div>
    </div>
  );
};
