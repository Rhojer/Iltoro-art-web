import { createClient } from '@supabase/supabase-js';
import type { Artwork, ArtistProfile, Inquiry, ArtworkStatus } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial high-end artist profile
const INITIAL_ARTIST_PROFILE: ArtistProfile = {
  name: "Valentin De La Mora",
  tagline: "Maestro del Expresionismo Abstracto & Texturas Áureas",
  bio: "Pintor contemporáneo cuya obra fusiona pigmentos naturales de origen mineral, óleo denso y aplicaciones de pan de oro de 24 quilates sobre lino crudo. Sus creaciones exploran la memoria atávica, el silencio y la fuerza indomable de la naturaleza.",
  dreams: "Mi sueño es transformar espacios sagrados y contemporáneos en portales de contemplación profunda, donde cada trazo y pigmento despierte en el espectador una conexión visceral con lo sublime y lo eterno.",
  statement: "El lienzo no es un soporte, es un campo de batalla donde la luz y la materia pactan una tregua efímera.",
  portraitUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop",
  studioImageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600&auto=format&fit=crop",
  whatsappNumber: "5215544332211", // Número de WhatsApp internacional del artista
  instagramUrl: "https://instagram.com/valentin.art",
  email: "contacto@valentinart.studio",
  location: "Madrid & Ciudad de México",
  exhibitions: [
    { year: "2026", title: "El Oro y la Ceniza", location: "Galería Marlborough, Madrid", type: "Individual" },
    { year: "2025", title: "Resonancias Primordiales", location: "Museo Jumex, CDMX", type: "Colectiva" },
    { year: "2024", title: "Fuerza y Gravedad", location: "Art Basel, Miami", type: "Feria Internacional" },
    { year: "2023", title: "Tauro: El Silencio del Minotauro", location: "Palais de Tokyo, París", type: "Individual" }
  ]
};

// Initial collection of authentic museum-quality artworks
const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: "art-01",
    code: "VAL-2026-001",
    title: "El Despertar del Minotauro",
    slug: "el-despertar-del-minotauro",
    medium: "Óleo empastado, pan de oro de 24k y carbón vegetal sobre lino belga",
    dimensions: "180 x 140 cm",
    widthCm: 180,
    heightCm: 140,
    year: 2026,
    price: 8400,
    currency: "USD",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600&auto=format&fit=crop"
    ],
    story: "Inspirada en el mito del laberinto cretense, esta obra encarna la reconciliación entre la fuerza instintiva del toro y la búsqueda de iluminación humana. Las capas de óleo fueron trabajadas con espátula de acero durante 7 meses.",
    palette: ["#121316", "#C5A880", "#8C271E", "#D4AF37", "#E6E2DD"],
    pigments: ["Negro de Humo", "Oro Ducado 24K", "Tierra de Siena Quemada", "Blanco de Titanio"],
    isFeatured: true,
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "art-02",
    code: "VAL-2026-002",
    title: "Sinfonía en Azul Cobalto y Obsidiana",
    slug: "sinfonia-en-azul-cobalto-y-obsidiana",
    medium: "Técnica mixta con pigmento ultramar puro, ceniza volcánica y resina mate",
    dimensions: "160 x 120 cm",
    widthCm: 160,
    heightCm: 120,
    year: 2026,
    price: 6800,
    currency: "USD",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1600&auto=format&fit=crop"
    ],
    story: "Una inmersión en los abismos oceánicos de la conciencia. El azul cobalto genera una vibración óptica que cambia según la inclinación de la luz solar natural.",
    palette: ["#0B1B3D", "#1C3F73", "#C59B27", "#17181C", "#E2E8F0"],
    pigments: ["Azul Ultramar Francés", "Ceniza Volcánica", "Polvo de Cobre", "Grafito Líquido"],
    isFeatured: true,
    createdAt: "2026-02-01T12:00:00Z"
  },
  {
    id: "art-03",
    code: "VAL-2025-009",
    title: "Canto de la Tierra Negra",
    slug: "canto-de-la-tierra-negra",
    medium: "Óleo al temple, corteza molida y polvo de mármol sobre tabla de roble",
    dimensions: "200 x 150 cm",
    widthCm: 200,
    heightCm: 150,
    year: 2025,
    price: 11200,
    currency: "USD",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop"
    ],
    story: "Homenaje a los estratos geológicos y a la resistencia de la tierra fértil. La superficie presenta grietas escultóricas orgánicas que invitan a una experiencia táctil y contemplativa.",
    palette: ["#1F1D1A", "#523B2C", "#A88350", "#D3C2A3", "#3C3F38"],
    pigments: ["Tierra de Cassel", "Ocre Amarillo Natural", "Polvo de Mármol de Carrara"],
    isFeatured: true,
    createdAt: "2025-11-10T14:30:00Z"
  },
  {
    id: "art-04",
    code: "VAL-2025-012",
    title: "Geometría del Solsticio",
    slug: "geometria-del-solsticio",
    medium: "Acrílico estructural, pigmento cadmio y láminas de latón bruñido",
    dimensions: "130 x 100 cm",
    widthCm: 130,
    heightCm: 100,
    year: 2025,
    price: 5400,
    currency: "USD",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1600&auto=format&fit=crop"
    ],
    story: "La danza matemática de la luz solar en el solsticio de invierno. Tonos dorados que irradian calidez y serenidad en cualquier espacio de arquitectura moderna.",
    palette: ["#E5A93C", "#C47B2B", "#222226", "#F2ECE1", "#8C5E35"],
    pigments: ["Amarillo Cadmio Profundo", "Latón Pulido", "Óxido de Hierro Rojo"],
    isFeatured: false,
    createdAt: "2025-12-05T09:15:00Z"
  },
  {
    id: "art-05",
    code: "VAL-2025-006",
    title: "El Silencio de las Horas",
    slug: "el-silencio-de-las-horas",
    medium: "Óleo monocromático con espatulado sobre lienzo de algodón pesado",
    dimensions: "150 x 110 cm",
    widthCm: 150,
    heightCm: 110,
    year: 2025,
    price: 6100,
    currency: "USD",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1576769267415-9642010aa962?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=1600&auto=format&fit=crop"
    ],
    story: "Estudio sobre la calma y la quietud nocturna. Las texturas generan sombras en relieve que transforman la pieza a lo largo del día con la luz ambiental.",
    palette: ["#232428", "#4A4D53", "#9B9DA3", "#EAEBED", "#141517"],
    pigments: ["Gris de Payne", "Blanco de Zinc", "Negro Marfil"],
    isFeatured: false,
    createdAt: "2025-09-20T16:00:00Z"
  },
  {
    id: "art-06",
    code: "VAL-2024-018",
    title: "Fuego Sagrado & Cenizas",
    slug: "fuego-sagrado-y-cenizas",
    medium: "Óleo, pigmentos carmín y pan de cobre sobre lino montado en bastidor flotante",
    dimensions: "170 x 130 cm",
    widthCm: 170,
    heightCm: 130,
    year: 2024,
    price: 7900,
    currency: "USD",
    status: "sold",
    images: [
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1600&auto=format&fit=crop"
    ],
    story: "Pieza perteneciente a la colección privada de la Fundación de Arte Iberoamericano. Representa la transmutación y el renacimiento espiritual.",
    palette: ["#9E2A2B", "#540B0E", "#E09F3E", "#FFF3B0", "#335C67"],
    pigments: ["Rojo Carmín de Cochinilla", "Cobre Flamante", "Bistre Antiguo"],
    isFeatured: false,
    createdAt: "2024-08-14T11:00:00Z"
  }
];

// In-memory reactive local store with 1-hour reservation cleaner
class StoreManager {
  private artworks: Artwork[] = [];
  private inquiries: Inquiry[] = [];
  private profile: ArtistProfile = INITIAL_ARTIST_PROFILE;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.load();
    // Run reservation expiration check every 15 seconds
    if (typeof window !== 'undefined') {
      setInterval(() => this.checkExpiredReservations(), 15000);
    }
  }

  private load() {
    if (typeof window === 'undefined') {
      this.artworks = INITIAL_ARTWORKS;
      return;
    }
    const savedArtworks = localStorage.getItem('artist_artworks_store');
    const savedInquiries = localStorage.getItem('artist_inquiries_store');
    const savedProfile = localStorage.getItem('artist_profile_store');

    this.artworks = savedArtworks ? JSON.parse(savedArtworks) : INITIAL_ARTWORKS;
    this.inquiries = savedInquiries ? JSON.parse(savedInquiries) : [];
    this.profile = savedProfile ? JSON.parse(savedProfile) : INITIAL_ARTIST_PROFILE;
    this.checkExpiredReservations();
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('artist_artworks_store', JSON.stringify(this.artworks));
    localStorage.setItem('artist_inquiries_store', JSON.stringify(this.inquiries));
    localStorage.setItem('artist_profile_store', JSON.stringify(this.profile));
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Check and auto-release 1-hour expired reservations
  public checkExpiredReservations() {
    const now = Date.now();
    let hasChanges = false;

    this.artworks = this.artworks.map((art) => {
      if (art.status === 'reserved' && art.reservedAt) {
        const reservedTime = new Date(art.reservedAt).getTime();
        const oneHour = 60 * 60 * 1000;
        if (now - reservedTime > oneHour) {
          hasChanges = true;
          return {
            ...art,
            status: 'available' as ArtworkStatus,
            reservedAt: null,
            reservedByName: null,
            reservedByPhone: null,
            reservedByEmail: null
          };
        }
      }
      return art;
    });

    if (hasChanges) {
      this.save();
    }
  }

  public getArtworks(): Artwork[] {
    this.checkExpiredReservations();
    return [...this.artworks];
  }

  public getArtworkById(id: string): Artwork | undefined {
    this.checkExpiredReservations();
    return this.artworks.find((a) => a.id === id || a.slug === id);
  }

  public reserveArtwork(
    artworkId: string,
    buyer: { name: string; email: string; phone: string; location: string; message?: string }
  ): { success: boolean; artwork?: Artwork; error?: string } {
    this.checkExpiredReservations();
    const index = this.artworks.findIndex((a) => a.id === artworkId);
    if (index === -1) return { success: false, error: 'Obra no encontrada' };

    const target = this.artworks[index];
    if (target.status === 'sold') return { success: false, error: 'Esta obra ya ha sido vendida' };
    if (target.status === 'reserved') return { success: false, error: 'Esta obra se encuentra actualmente apartada por otro coleccionista' };

    const nowIso = new Date().toISOString();
    const expiresIso = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const updatedArtwork: Artwork = {
      ...target,
      status: 'reserved',
      reservedAt: nowIso,
      reservedByName: buyer.name,
      reservedByEmail: buyer.email,
      reservedByPhone: buyer.phone
    };

    this.artworks[index] = updatedArtwork;

    // Create inquiry record
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      artworkId: target.id,
      artworkTitle: target.title,
      artworkCode: target.code,
      artworkPrice: target.price,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      buyerPhone: buyer.phone,
      buyerLocation: buyer.location,
      message: buyer.message,
      status: 'new',
      createdAt: nowIso,
      expiresAt: expiresIso
    };

    this.inquiries.unshift(newInquiry);
    this.save();

    return { success: true, artwork: updatedArtwork };
  }

  public updateArtworkStatus(artworkId: string, status: ArtworkStatus): boolean {
    const index = this.artworks.findIndex((a) => a.id === artworkId);
    if (index === -1) return false;

    this.artworks[index] = {
      ...this.artworks[index],
      status,
      reservedAt: status === 'reserved' ? new Date().toISOString() : null,
      reservedByName: status === 'reserved' ? this.artworks[index].reservedByName : null,
      reservedByPhone: status === 'reserved' ? this.artworks[index].reservedByPhone : null,
      reservedByEmail: status === 'reserved' ? this.artworks[index].reservedByEmail : null
    };

    this.save();
    return true;
  }

  public extendReservation(artworkId: string): boolean {
    const index = this.artworks.findIndex((a) => a.id === artworkId);
    if (index === -1) return false;

    this.artworks[index] = {
      ...this.artworks[index],
      status: 'reserved',
      reservedAt: new Date().toISOString() // Reset 1-hour window
    };

    this.save();
    return true;
  }

  public saveArtwork(artwork: Artwork): void {
    const index = this.artworks.findIndex((a) => a.id === artwork.id);
    if (index >= 0) {
      this.artworks[index] = artwork;
    } else {
      this.artworks.unshift(artwork);
    }
    this.save();
  }

  public deleteArtwork(artworkId: string): void {
    this.artworks = this.artworks.filter((a) => a.id !== artworkId);
    this.save();
  }

  public getInquiries(): Inquiry[] {
    return [...this.inquiries];
  }

  public getProfile(): ArtistProfile {
    return { ...this.profile };
  }

  public updateProfile(profile: Partial<ArtistProfile>): void {
    this.profile = { ...this.profile, ...profile };
    this.save();
  }
}

export const store = new StoreManager();
