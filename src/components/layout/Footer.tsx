import React from 'react';
import { MessageCircle, Globe, Mail, MapPin } from 'lucide-react';
import type { ArtistProfile } from '../../types';

export const Footer: React.FC<{ profile: ArtistProfile; onGoToStudio: () => void }> = ({
  profile,
  onGoToStudio,
}) => {
  return (
    <footer className="border-t border-white/10 bg-[#090A0D] pt-16 pb-12 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <span className="font-serif text-2xl text-white block">{profile.name}</span>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-light">
              {profile.tagline}. Adquisición directa con certificado de autenticidad y envío internacional con embalaje museográfico.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Contacto & Atelier</h4>
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <MapPin className="h-4 w-4 text-[#D4AF37]" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Mail className="h-4 w-4 text-[#D4AF37]" />
              <span>{profile.email}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Canales Directos</h4>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white hover:border-[#25D366] hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                <span>WhatsApp Atelier</span>
              </a>

              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white hover:border-[#FFE599] hover:text-[#FFE599] transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>Instagram / Web</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-6 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} {profile.name}. Todos los derechos reservados.</p>
          <button
            onClick={onGoToStudio}
            className="hover:text-zinc-300 cursor-pointer transition-colors mt-2 sm:mt-0"
          >
            Acceso Atelier Privado
          </button>
        </div>
      </div>
    </footer>
  );
};
