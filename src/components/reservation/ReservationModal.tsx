import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { store } from '../../lib/supabase';
import { sound } from '../../lib/sound';
import { formatPrice } from '../../lib/utils';
import type { Artwork, ArtistProfile } from '../../types';

interface ReservationModalProps {
  artwork: Artwork;
  profile: ArtistProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  artwork,
  profile,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    setIsSubmitting(true);

    // Save reservation in Supabase / reactive store
    const result = store.reserveArtwork(artwork.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location || 'No especificada',
      message: formData.message,
    });

    if (result.success) {
      // Fire celebration chime and confetti
      sound.playChime();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFE599', '#C5A880', '#ffffff'],
      });

      // Format WhatsApp Message
      const formattedMessage = `✨ *SOLICITUD DE APARTADO DE OBRA (RESERVA 1 HORA)* ✨\n\n` +
        `🎨 *Obra:* ${artwork.title}\n` +
        `🔖 *Código:* ${artwork.code}\n` +
        `📐 *Medidas:* ${artwork.dimensions}\n` +
        `🖌️ *Técnica:* ${artwork.medium}\n` +
        `💰 *Inversión:* ${formatPrice(artwork.price, artwork.currency)}\n\n` +
        `👤 *Datos del Coleccionista:*\n` +
        `• Nombre: ${formData.name}\n` +
        `• Email: ${formData.email}\n` +
        `• WhatsApp: ${formData.phone}\n` +
        `• Ubicación: ${formData.location || 'Por coordinar'}\n` +
        (formData.message ? `\n💬 *Mensaje del comprador:* "${formData.message}"\n` : '') +
        `\n⏳ _Reserva activa por 60 minutos registrada en sistema._`;

      const encodedMsg = encodeURIComponent(formattedMessage);
      const cleanPhone = profile.whatsappNumber.replace(/[^0-9]/g, '');
      const waLink = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

      setWhatsappUrl(waLink);
      setIsCompleted(true);
      setIsSubmitting(false);

      // Open WhatsApp automatically
      setTimeout(() => {
        window.open(waLink, '_blank');
      }, 700);

      onSuccess();
    } else {
      alert(result.error || 'No se pudo apartar la obra');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/15 bg-[#121316] p-6 shadow-2xl sm:p-8"
      >
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {!isCompleted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                  Adquisición Directa
                </span>
                <h3 className="font-serif text-2xl font-normal text-white">Apartar Obra (1 Hora)</h3>
              </div>
            </div>

            {/* Artwork Mini Summary Card */}
            <div className="mb-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
              <img
                src={artwork.images[0]}
                alt={artwork.title}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono text-[#D4AF37] block">{artwork.code}</span>
                <h4 className="truncate font-serif text-lg text-white">{artwork.title}</h4>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>{artwork.dimensions}</span>
                  <span className="font-serif text-sm font-semibold text-[#FFE599]">
                    {formatPrice(artwork.price, artwork.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* 1-Hour Hold Guarantee Alert */}
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-950/40 p-3 text-xs text-amber-200">
              <Clock className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                Al confirmar, la obra quedará <strong>bloqueada para ti por 60 minutos</strong> mientras coordinas los detalles de envío y pago en WhatsApp con el artista.
              </span>
            </div>

            {/* Buyer Details Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej. Arq. Sofía Ramírez"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                    WhatsApp / Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sofia@arte.com"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Ciudad / País
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="ej. Madrid, España / CDMX"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Mensaje o Consulta Especial (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="¿Deseas marco especial o entrega internacional personalizada?"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-[#D4AF37] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A880] py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-[#D4AF37]/20 transition-all hover:shadow-[#D4AF37]/40 active:scale-95 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>Confirmar Apartado & Abrir WhatsApp</span>
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Success Screen */
          <div className="py-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            >
              <CheckCircle2 className="h-9 w-9" />
            </motion.div>

            <span className="font-mono text-xs text-[#D4AF37] uppercase tracking-widest">
              ¡Obra Reservada con Éxito!
            </span>
            <h3 className="mt-1 font-serif text-3xl font-normal text-white">
              {artwork.title}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-xs text-zinc-300">
              Hemos apartado la pieza por <strong>60 minutos</strong> a tu nombre ({formData.name}). Tu chat con el artista se ha abierto en una nueva pestaña.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Abrir Chat de WhatsApp Ahora</span>
              </a>

              <button
                onClick={onClose}
                className="rounded-full border border-white/10 py-2.5 text-xs text-zinc-400 hover:text-white"
              >
                Volver a la Galería
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
