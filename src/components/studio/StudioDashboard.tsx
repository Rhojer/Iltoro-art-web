import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Users,
  Settings,
  Plus,
  Clock,
  MessageCircle,
  ArrowLeft,
  Trash2,
  Save,
  Camera,
  Upload,
  Image as ImageIcon,
  Check,
  Edit2
} from 'lucide-react';
import { store } from '../../lib/supabase';
import { sound } from '../../lib/sound';
import { formatPrice, getRemainingTime } from '../../lib/utils';
import type { Artwork, ArtistProfile, Inquiry, ArtworkStatus } from '../../types';

interface StudioDashboardProps {
  onLogout: () => void;
  onGoToPublic: () => void;
}

export const StudioDashboard: React.FC<StudioDashboardProps> = ({ onLogout, onGoToPublic }) => {
  const [activeTab, setActiveTab] = useState<'artworks' | 'inquiries' | 'profile'>('artworks');
  const [artworks, setArtworks] = useState<Artwork[]>(() => store.getArtworks());
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => store.getInquiries());
  const [profile, setProfile] = useState<ArtistProfile>(() => store.getProfile());

  // Editing Artwork state (for adding new or updating existing)
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const [artworkForm, setArtworkForm] = useState<Partial<Artwork>>({
    title: '',
    code: `VAL-2026-00${artworks.length + 1}`,
    medium: 'Óleo sobre lino y pan de oro',
    dimensions: '150 x 120 cm',
    widthCm: 150,
    heightCm: 120,
    year: 2026,
    price: 5000,
    currency: 'USD',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop'],
    story: '',
    palette: ['#D4AF37', '#121316', '#C5A880'],
    pigments: ['Oro 24K', 'Negro de Humo', 'Tierra de Siena'],
    isFeatured: true,
  });

  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const studioFileInputRef = useRef<HTMLInputElement>(null);
  const modalArtworkFileInputRef = useRef<HTMLInputElement>(null);

  const [, setTick] = useState(0);

  const refreshData = () => {
    setArtworks(store.getArtworks());
    setInquiries(store.getInquiries());
    setProfile(store.getProfile());
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      refreshData();
    });

    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const triggerNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => {
      setSaveSuccessNotice(null);
    }, 3500);
  };

  // Helper for reading files directly from disk/device
  const handleFileUpload = (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        callback(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStatusChange = (artworkId: string, newStatus: ArtworkStatus) => {
    sound.playClick();
    store.updateArtworkStatus(artworkId, newStatus);
    triggerNotice(`Estado actualizado a: ${newStatus}`);
  };

  const handleExtendReservation = (artworkId: string) => {
    sound.playClick();
    store.extendReservation(artworkId);
    triggerNotice('Reserva extendida por +1 hora.');
  };

  const handleDeleteArtwork = (artworkId: string) => {
    if (confirm('¿Estás seguro de eliminar esta obra del catálogo?')) {
      sound.playClick();
      store.deleteArtwork(artworkId);
      triggerNotice('Obra eliminada del catálogo.');
    }
  };

  // Direct quick photo changer for an artwork card in the list
  const handleQuickArtworkPhotoChange = (artworkId: string, file: File) => {
    handleFileUpload(file, (dataUrl) => {
      const art = artworks.find((a) => a.id === artworkId);
      if (art) {
        sound.playChime();
        store.saveArtwork({
          ...art,
          images: [dataUrl, ...(art.images.slice(1))]
        });
        triggerNotice(`Foto de "${art.title}" actualizada correctamente`);
      }
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChime();
    store.updateProfile(profile);
    triggerNotice('Perfil, biografía y fotos guardadas exitosamente.');
  };

  const openNewArtworkModal = () => {
    sound.playClick();
    setEditingArtworkId(null);
    setArtworkForm({
      title: '',
      code: `VAL-2026-00${artworks.length + 1}`,
      medium: 'Óleo sobre lino y pan de oro',
      dimensions: '150 x 120 cm',
      widthCm: 150,
      heightCm: 120,
      year: 2026,
      price: 5000,
      currency: 'USD',
      status: 'available',
      images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop'],
      story: '',
      palette: ['#D4AF37', '#121316', '#C5A880'],
      pigments: ['Oro 24K', 'Negro de Humo', 'Tierra de Siena'],
      isFeatured: true,
    });
    setShowAddModal(true);
  };

  const openEditArtworkModal = (artwork: Artwork) => {
    sound.playClick();
    setEditingArtworkId(artwork.id);
    setArtworkForm({ ...artwork });
    setShowAddModal(true);
  };

  const handleSaveArtworkForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artworkForm.title || !artworkForm.price) return;

    sound.playChime();

    if (editingArtworkId) {
      // Editing existing artwork
      const existing = artworks.find((a) => a.id === editingArtworkId);
      if (existing) {
        const updated: Artwork = {
          ...existing,
          title: artworkForm.title || existing.title,
          code: artworkForm.code || existing.code,
          medium: artworkForm.medium || existing.medium,
          dimensions: artworkForm.dimensions || existing.dimensions,
          widthCm: Number(artworkForm.widthCm) || existing.widthCm,
          heightCm: Number(artworkForm.heightCm) || existing.heightCm,
          year: Number(artworkForm.year) || existing.year,
          price: Number(artworkForm.price) || existing.price,
          images: artworkForm.images && artworkForm.images.length > 0 ? artworkForm.images : existing.images,
          story: artworkForm.story || existing.story,
          isFeatured: Boolean(artworkForm.isFeatured),
        };
        store.saveArtwork(updated);
        triggerNotice(`Obra "${updated.title}" actualizada.`);
      }
    } else {
      // Creating new artwork
      const created: Artwork = {
        id: `art-${Date.now()}`,
        code: artworkForm.code || `VAL-2026-${Date.now().toString().slice(-3)}`,
        title: artworkForm.title,
        slug: (artworkForm.title || '').toLowerCase().replace(/\s+/g, '-'),
        medium: artworkForm.medium || 'Óleo y Pan de Oro',
        dimensions: artworkForm.dimensions || '120 x 90 cm',
        widthCm: Number(artworkForm.widthCm) || 120,
        heightCm: Number(artworkForm.heightCm) || 90,
        year: Number(artworkForm.year) || 2026,
        price: Number(artworkForm.price),
        currency: 'USD',
        status: 'available',
        images: artworkForm.images && artworkForm.images.length > 0 ? artworkForm.images : ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop'],
        story: artworkForm.story || 'Obra creada en el atelier.',
        palette: artworkForm.palette || ['#D4AF37', '#121316'],
        pigments: artworkForm.pigments || ['Pigmento Natural'],
        isFeatured: Boolean(artworkForm.isFeatured),
        createdAt: new Date().toISOString(),
      };
      store.saveArtwork(created);
      triggerNotice(`Nueva obra "${created.title}" publicada en la galería.`);
    }

    setShowAddModal(false);
  };

  const totalValue = artworks.reduce((acc, a) => acc + a.price, 0);
  const availableCount = artworks.filter((a) => a.status === 'available').length;
  const reservedCount = artworks.filter((a) => a.status === 'reserved').length;

  return (
    <div className="min-h-screen bg-[#090A0D] text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {saveSuccessNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-[#D4AF37]/50 bg-[#121316]/95 px-5 py-3 shadow-2xl backdrop-blur-xl text-xs font-semibold text-[#FFE599]"
          >
            <Check className="h-4 w-4 text-[#D4AF37]" />
            <span>{saveSuccessNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Studio Navbar */}
      <header className="border-b border-white/10 bg-[#121316]/90 px-6 py-4 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onGoToPublic();
              }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-300 hover:border-[#D4AF37]/40 hover:text-white cursor-pointer transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Ver Galería Pública</span>
            </button>
            <span className="font-serif text-lg text-[#FFE599] hidden sm:inline">
              Atelier Privado · {profile.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onLogout();
              }}
              className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer hover:bg-white/5 transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* KPI Stats Bar */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#121316] p-4">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Total Obras</span>
            <p className="font-serif text-3xl text-white mt-1">{artworks.length}</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
            <span className="text-[10px] font-mono uppercase text-emerald-400">Disponibles</span>
            <p className="font-serif text-3xl text-emerald-400 mt-1">{availableCount}</p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4">
            <span className="text-[10px] font-mono uppercase text-amber-300">Apartadas (1h Activas)</span>
            <p className="font-serif text-3xl text-amber-300 mt-1">{reservedCount}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121316] p-4">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Valor Inventario</span>
            <p className="font-serif text-2xl text-[#D4AF37] mt-1">{formatPrice(totalValue)}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('artworks');
            }}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'artworks'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="h-4 w-4" />
            <span>Gestión de Obras & Fotos</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('inquiries');
            }}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'inquiries'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Apartados & Leads WhatsApp ({inquiries.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('profile');
            }}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Fotos de Perfil & Atelier</span>
          </button>
        </div>

        {/* TAB 1: ARTWORKS INVENTORY & PHOTOS */}
        {activeTab === 'artworks' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl text-white">Catálogo de Piezas</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Haz clic en cualquier imagen para cambiar la foto de la obra instantáneamente desde tu dispositivo.
                </p>
              </div>
              <button
                onClick={openNewArtworkModal}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A880] px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-md transition-transform hover:scale-105 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Subir Nueva Obra</span>
              </button>
            </div>

            <div className="space-y-4">
              {artworks.map((art) => {
                const remaining = getRemainingTime(art.reservedAt);
                return (
                  <div
                    key={art.id}
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#121316] p-4 transition-all hover:border-white/25"
                  >
                    <div className="flex items-center gap-4">
                      {/* Photo Thumbnail with instant Hover File Upload overlay */}
                      <label className="relative group cursor-pointer h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/40">
                        <img
                          src={art.images[0]}
                          alt={art.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
                          <Camera className="h-4 w-4 text-[#FFE599] mb-0.5" />
                          <span className="text-[8px] font-semibold text-[#FFE599] leading-tight">
                            Cambiar Foto
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleQuickArtworkPhotoChange(art.id, f);
                          }}
                        />
                      </label>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[#D4AF37]">{art.code}</span>
                          <span className="text-xs text-zinc-400">· {art.dimensions}</span>
                        </div>
                        <h4 className="font-serif text-xl text-white">{art.title}</h4>
                        <p className="text-xs text-zinc-400">{art.medium}</p>
                        <p className="font-serif text-sm font-semibold text-[#FFE599] mt-1">
                          {formatPrice(art.price, art.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Actions & Status Controls */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                      {art.status === 'reserved' && (
                        <div className="mr-2 flex items-center gap-1 text-xs text-amber-300 font-mono bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
                          <Clock className="h-3 w-3 animate-spin" />
                          <span>Expira en: {remaining.minutes}m {remaining.seconds}s</span>
                        </div>
                      )}

                      {/* Edit Details Button */}
                      <button
                        onClick={() => openEditArtworkModal(art)}
                        className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:border-[#D4AF37]/50 hover:text-white cursor-pointer transition-all"
                        title="Editar información y fotos de la obra"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Editar</span>
                      </button>

                      {/* Switch to Available */}
                      <button
                        onClick={() => handleStatusChange(art.id, 'available')}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                          art.status === 'available'
                            ? 'bg-emerald-500 text-zinc-950 font-bold'
                            : 'border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                        title="Marcar disponible en galería"
                      >
                        Disponible
                      </button>

                      {/* Switch to Reserved / Extend */}
                      <button
                        onClick={() => handleExtendReservation(art.id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                          art.status === 'reserved'
                            ? 'bg-amber-400 text-zinc-950 font-bold'
                            : 'border border-amber-500/40 text-amber-300 hover:bg-amber-500/10'
                        }`}
                        title="Apartar o reiniciar temporizador de 1 hora"
                      >
                        {art.status === 'reserved' ? 'Extender +1h' : 'Apartar (1h)'}
                      </button>

                      {/* Switch to Sold */}
                      <button
                        onClick={() => handleStatusChange(art.id, 'sold')}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                          art.status === 'sold'
                            ? 'bg-zinc-700 text-white font-bold'
                            : 'border border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                        }`}
                        title="Marcar como vendido de forma definitiva"
                      >
                        Vendido
                      </button>

                      <button
                        onClick={() => handleDeleteArtwork(art.id)}
                        className="p-2 text-zinc-500 hover:text-rose-400 cursor-pointer ml-1"
                        title="Eliminar obra"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INQUIRIES & WHATSAPP LEADS */}
        {activeTab === 'inquiries' && (
          <div>
            <h3 className="font-serif text-2xl text-white mb-6">
              Solicitudes de Apartado & Clientes WhatsApp
            </h3>

            {inquiries.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#121316] p-12 text-center">
                <Users className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400 text-sm">No hay prospectos recientes aún.</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Cuando un coleccionista aparte una obra desde la galería, aparecerá aquí con acceso directo a WhatsApp.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => {
                  const rawPhone = inq.buyerPhone.replace(/[^0-9]/g, '');
                  const waLink = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
                    `Hola ${inq.buyerName}, un gusto saludarte. Soy ilToro. Recibí tu solicitud para la obra "${inq.artworkTitle}" (Código: ${inq.artworkCode}). Con gusto coordinamos los detalles de adquisición y certificado.`
                  )}`;

                  return (
                    <div
                      key={inq.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#121316] p-5"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{inq.buyerName}</span>
                          <span className="text-xs text-zinc-400">· {inq.buyerLocation}</span>
                          <span className="rounded-full bg-[#D4AF37]/20 px-2 py-0.5 text-[10px] font-mono text-[#FFE599]">
                            {inq.artworkCode}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-1 font-medium">
                          Obra de interés: <span className="text-white">{inq.artworkTitle}</span> ({formatPrice(inq.artworkPrice)})
                        </p>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                          <span>📱 {inq.buyerPhone}</span>
                          <span>✉️ {inq.buyerEmail}</span>
                        </div>
                        {inq.message && (
                          <p className="text-xs text-zinc-500 italic mt-2 border-l-2 border-[#D4AF37]/40 pl-2">
                            "{inq.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow transition-transform hover:scale-105"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Chatear en WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ARTIST PROFILE & PHOTO UPLOADER */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="max-w-3xl space-y-8">
            <div>
              <h3 className="font-serif text-2xl text-white">Configuración del Artista, Fotos & WhatsApp</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Personaliza las fotografías que se muestran en el banner editorial "Quién Soy" y los datos de contacto.
              </p>
            </div>

            {/* SECCIÓN 1: FOTO DE PERFIL DEL ARTISTA (RETRATO HERO) */}
            <div className="rounded-3xl border border-white/10 bg-[#121316] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg text-white">1. Fotografía de Retrato ("Quién Soy")</h4>
                  <p className="text-xs text-zinc-400">
                    Esta foto aparece en la primera diapositiva de la portada con la biografía.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                {/* Visual Avatar Preview */}
                <div className="relative group shrink-0">
                  <div className="h-28 w-28 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)] bg-black/60">
                    <img
                      src={profile.portraitUrl}
                      alt="Retrato Artista"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1 w-full space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <input
                      ref={profileFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, (dataUrl) => {
                            setProfile({ ...profile, portraitUrl: dataUrl });
                            triggerNotice('Foto de retrato cargada.');
                          });
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => profileFileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-4 py-2 text-xs font-semibold text-[#FFE599] hover:bg-[#D4AF37] hover:text-zinc-950 transition-all cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Subir Foto desde este Dispositivo</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
                      O ingresar enlace URL directo de la foto:
                    </label>
                    <input
                      type="url"
                      value={profile.portraitUrl}
                      onChange={(e) => setProfile({ ...profile, portraitUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: FOTO DEL ATELIER / ESTUDIO (MANIFIESTO HERO) */}
            <div className="rounded-3xl border border-white/10 bg-[#121316] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg text-white">2. Fotografía del Atelier & Proceso ("El Manifiesto")</h4>
                  <p className="text-xs text-zinc-400">
                    Esta foto panorámica ilustra la segunda diapositiva sobre la alquimia y el proceso de creación.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                {/* Visual Banner Preview */}
                <div className="relative shrink-0 w-full sm:w-44 h-28 rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-lg bg-black/60">
                  <img
                    src={profile.studioImageUrl}
                    alt="Foto Atelier"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Upload Controls */}
                <div className="flex-1 w-full space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <input
                      ref={studioFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, (dataUrl) => {
                            setProfile({ ...profile, studioImageUrl: dataUrl });
                            triggerNotice('Foto del atelier cargada.');
                          });
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => studioFileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-4 py-2 text-xs font-semibold text-[#FFE599] hover:bg-[#D4AF37] hover:text-zinc-950 transition-all cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Subir Foto del Atelier</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
                      O ingresar enlace URL directo de la foto del taller:
                    </label>
                    <input
                      type="url"
                      value={profile.studioImageUrl}
                      onChange={(e) => setProfile({ ...profile, studioImageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: DATOS DE CONTACTO & TEXTOS */}
            <div className="rounded-3xl border border-white/10 bg-[#121316] p-6 space-y-4">
              <h4 className="font-serif text-lg text-white">3. Datos de Contacto & Textos Editoriales</h4>

              <div>
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Número de WhatsApp para Recepción de Apartados *
                </label>
                <input
                  type="text"
                  required
                  value={profile.whatsappNumber}
                  onChange={(e) => setProfile({ ...profile, whatsappNumber: e.target.value })}
                  placeholder="ej. 5215544332211 (con código de país sin +)"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Los mensajes estructurados de los compradores con el código de obra y precio llegarán a este número.
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Nombre del Artista
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Biografía Editorial
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Sueño del Creador (Para el Banner 'Quién Soy')
                </label>
                <textarea
                  rows={2}
                  value={profile.dreams}
                  onChange={(e) => setProfile({ ...profile, dreams: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Declaración Poética ('El Manifiesto')
                </label>
                <textarea
                  rows={2}
                  value={profile.statement}
                  onChange={(e) => setProfile({ ...profile, statement: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A880] px-8 py-3.5 text-xs font-bold text-zinc-950 shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Toda la Configuración</span>
            </button>
          </form>
        )}
      </main>

      {/* ADD / EDIT ARTWORK MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#121316] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <h3 className="font-serif text-2xl text-white">
                  {editingArtworkId ? 'Editar Obra & Fotografía' : 'Publicar Nueva Obra'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveArtworkForm} className="space-y-4">
                {/* Photo Upload Zone */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider block">
                    Fotografía de la Obra *
                  </label>

                  <div className="flex items-center gap-4 p-3 rounded-2xl border border-white/10 bg-black/40">
                    <div className="h-20 w-20 rounded-xl overflow-hidden border border-[#D4AF37]/50 shrink-0 bg-black/80 flex items-center justify-center">
                      {artworkForm.images && artworkForm.images[0] ? (
                        <img
                          src={artworkForm.images[0]}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-zinc-600" />
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      <input
                        ref={modalArtworkFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, (dataUrl) => {
                              setArtworkForm({ ...artworkForm, images: [dataUrl] });
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => modalArtworkFileInputRef.current?.click()}
                        className="flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1.5 text-xs font-semibold text-[#FFE599] hover:bg-[#D4AF37] hover:text-zinc-950 transition-all cursor-pointer"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Subir Foto desde Dispositivo</span>
                      </button>

                      <input
                        type="url"
                        value={artworkForm.images?.[0] || ''}
                        onChange={(e) => setArtworkForm({ ...artworkForm, images: [e.target.value] })}
                        placeholder="O ingresar enlace URL (https://...)"
                        className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Título de la Obra *</label>
                  <input
                    type="text"
                    required
                    value={artworkForm.title}
                    onChange={(e) => setArtworkForm({ ...artworkForm, title: e.target.value })}
                    placeholder="ej. El Vuelo de Ícaro"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Código de Catálogo</label>
                    <input
                      type="text"
                      value={artworkForm.code}
                      onChange={(e) => setArtworkForm({ ...artworkForm, code: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Precio (USD) *</label>
                    <input
                      type="number"
                      required
                      value={artworkForm.price}
                      onChange={(e) => setArtworkForm({ ...artworkForm, price: Number(e.target.value) })}
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Técnica & Soporte</label>
                  <input
                    type="text"
                    value={artworkForm.medium}
                    onChange={(e) => setArtworkForm({ ...artworkForm, medium: e.target.value })}
                    placeholder="Óleo sobre lino belga con pan de oro"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Medidas</label>
                    <input
                      type="text"
                      value={artworkForm.dimensions}
                      onChange={(e) => setArtworkForm({ ...artworkForm, dimensions: e.target.value })}
                      placeholder="150 x 120 cm"
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Ancho (cm)</label>
                    <input
                      type="number"
                      value={artworkForm.widthCm}
                      onChange={(e) => setArtworkForm({ ...artworkForm, widthCm: Number(e.target.value) })}
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Alto (cm)</label>
                    <input
                      type="number"
                      value={artworkForm.heightCm}
                      onChange={(e) => setArtworkForm({ ...artworkForm, heightCm: Number(e.target.value) })}
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">Concepto / Historia</label>
                  <textarea
                    rows={2}
                    value={artworkForm.story}
                    onChange={(e) => setArtworkForm({ ...artworkForm, story: e.target.value })}
                    placeholder="Inspiración detrás de la obra..."
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A880] px-6 py-2 text-xs font-bold text-zinc-950 shadow-md transition-transform hover:scale-105 cursor-pointer"
                  >
                    {editingArtworkId ? 'Guardar Cambios' : 'Guardar y Publicar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
