import { useState, useEffect } from 'react';
import { TracingLightBeam } from './components/magicui/TracingLightBeam';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ArtistHeroBanner } from './components/hero/ArtistHeroBanner';
import { StaggeredGallery } from './components/gallery/StaggeredGallery';
import { ArtworkModal } from './components/artwork/ArtworkModal';
import { RoomSimulator } from './components/room/RoomSimulator';
import { ReservationModal } from './components/reservation/ReservationModal';
import { StudioLogin } from './components/studio/StudioLogin';
import { StudioDashboard } from './components/studio/StudioDashboard';
import { store } from './lib/supabase';
import type { Artwork, ArtistProfile } from './types';

export function App() {
  const [artworks, setArtworks] = useState<Artwork[]>(() => store.getArtworks());
  const [profile, setProfile] = useState<ArtistProfile>(() => store.getProfile());

  // Navigation & View State with URL Path & Hash Support
  const [currentView, setCurrentView] = useState<'public' | 'studio-login' | 'studio-dashboard'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/studio') || hash === '#studio') {
        return 'studio-login';
      }
    }
    return 'public';
  });

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [roomViewArtwork, setRoomViewArtwork] = useState<Artwork | null>(null);
  const [reservingArtwork, setReservingArtwork] = useState<Artwork | null>(null);

  const refreshData = () => {
    setArtworks(store.getArtworks());
    setProfile(store.getProfile());
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/studio') || hash === '#studio') {
        setCurrentView('studio-login');
      } else {
        setCurrentView('public');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    const unsubscribe = store.subscribe(() => {
      refreshData();
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
      unsubscribe();
    };
  }, []);

  const navigateToView = (view: 'public' | 'studio-login' | 'studio-dashboard') => {
    setCurrentView(view);
    if (view === 'public') {
      window.history.pushState({}, '', '/');
    } else if (view === 'studio-login') {
      window.history.pushState({}, '', '/studio');
    }
  };

  const handleScrollToGallery = () => {
    const el = document.getElementById('gallery-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in Studio CMS view
  if (currentView === 'studio-login') {
    return (
      <StudioLogin
        onLoginSuccess={() => setCurrentView('studio-dashboard')}
        onBackToPublic={() => navigateToView('public')}
      />
    );
  }

  if (currentView === 'studio-dashboard') {
    return (
      <StudioDashboard
        onLogout={() => navigateToView('public')}
        onGoToPublic={() => navigateToView('public')}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090A0D] text-[#F3F3F6] selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Background Noise Texture Overlay */}
      <div className="bg-noise pointer-events-none fixed inset-0 z-0 opacity-40" />

      {/* Cinematic Left Light Beam (Traces Bull Silhouette on Left Rail) */}
      <TracingLightBeam />

      {/* Main App Layout */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation Bar with Sound Controls */}
        <Navbar
          artistName={profile.name}
          onGoToStudio={() => navigateToView('studio-login')}
          onScrollToGallery={handleScrollToGallery}
        />

        {/* Hero Section: "Quién Soy" + Paint Wipe + Shrink/Dissolve on scroll */}
        <main className="flex-1">
          <ArtistHeroBanner
            profile={profile}
            onExploreClick={handleScrollToGallery}
          />

          {/* Staggered 3-Column Art Gallery (Center Column Offset Downward) */}
          <StaggeredGallery
            artworks={artworks}
            onSelectArtwork={(art) => setSelectedArtwork(art)}
            onRoomView={(art) => setRoomViewArtwork(art)}
            onReserve={(art) => setReservingArtwork(art)}
          />
        </main>

        {/* Footer */}
        <Footer
          profile={profile}
          onGoToStudio={() => navigateToView('studio-login')}
        />
      </div>

      {/* High-Resolution Artwork Zoom & Dossier Modal */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onRoomView={(art) => {
            setSelectedArtwork(null);
            setRoomViewArtwork(art);
          }}
          onReserve={(art) => {
            setSelectedArtwork(null);
            setReservingArtwork(art);
          }}
        />
      )}

      {/* 3D Scale Room Simulator Modal */}
      {roomViewArtwork && (
        <RoomSimulator
          artwork={roomViewArtwork}
          onClose={() => setRoomViewArtwork(null)}
          onReserve={(art) => {
            setRoomViewArtwork(null);
            setReservingArtwork(art);
          }}
        />
      )}

      {/* 1-Hour Hold Reservation & WhatsApp Messenger Modal */}
      {reservingArtwork && (
        <ReservationModal
          artwork={reservingArtwork}
          profile={profile}
          onClose={() => setReservingArtwork(null)}
          onSuccess={() => {
            refreshData();
          }}
        />
      )}
    </div>
  );
}

export default App;
