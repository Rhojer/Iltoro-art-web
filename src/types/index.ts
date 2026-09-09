export type ArtworkStatus = 'available' | 'reserved' | 'sold';

export interface Artwork {
  id: string;
  code: string; // e.g. ART-2026-001
  title: string;
  slug: string;
  medium: string; // e.g. Óleo sobre lienzo con pan de oro
  dimensions: string; // e.g. 150 x 120 cm
  widthCm: number;
  heightCm: number;
  year: number;
  price: number;
  currency: string;
  status: ArtworkStatus;
  reservedAt?: string | null; // ISO timestamp
  reservedByName?: string | null;
  reservedByPhone?: string | null;
  reservedByEmail?: string | null;
  images: string[];
  story: string;
  inspiration?: string;
  palette?: string[]; // Array of hex colors
  pigments?: string[]; // Array of pigment names
  collectionId?: string;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
}

export interface Inquiry {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artworkCode: string;
  artworkPrice: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerLocation: string;
  message?: string;
  status: 'new' | 'contacted' | 'sold' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt: string; // ISO timestamp (1 hour after creation)
}

export interface ArtistProfile {
  name: string;
  tagline: string;
  bio: string;
  dreams: string;
  statement: string;
  portraitUrl: string;
  studioImageUrl: string;
  whatsappNumber: string; // International format without +, e.g. 5215512345678
  instagramUrl: string;
  email: string;
  location: string;
  exhibitions: {
    year: string;
    title: string;
    location: string;
    type: string;
  }[];
}
