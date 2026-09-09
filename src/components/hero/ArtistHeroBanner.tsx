import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ChevronRight, ChevronLeft, Palette, Award, Compass, ArrowDown } from 'lucide-react';
import { BlurFade } from '../magicui/BlurFade';
import { GradientText } from '../magicui/GradientText';
import { MagneticButton } from '../magicui/MagneticButton';
import { sound } from '../../lib/sound';
import type { ArtistProfile } from '../../types';

interface ArtistHeroBannerProps {
  profile: ArtistProfile;
  onExploreClick: () => void;
}

export const ArtistHeroBanner: React.FC<ArtistHeroBannerProps> = ({ profile, onExploreClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Ultra-smooth, lightweight hardware-accelerated scroll transition
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [100, 650], [1, 0.96]);
  const opacity = useTransform(scrollY, [150, 600], [1, 0.05]);
  const y = useTransform(scrollY, [0, 650], [0, -20]);

  const slides = [
    {
      id: 'quien-soy',
      badge: 'El Artista & Su Visión',
      eyebrow: '¿Quién Soy?',
      mainTitle: profile.name,
      navLabel: '¿Quién Soy?',
      description: profile.bio,
      highlight: profile.dreams,
      highlightLabel: 'El Sueño del Creador',
      image: profile.portraitUrl,
      accent: 'Óleo & Pan de Oro',
      icon: Palette
    },
    {
      id: 'manifiesto',
      badge: 'Declaración Poética',
      eyebrow: 'El Manifiesto',
      mainTitle: 'La Alquimia de la Materia',
      navLabel: 'El Manifiesto',
      description: profile.statement,
      highlight: 'Cada cuadro se concibe como una reliquia viva, tallada con pigmentos de tierras sagradas y sellada bajo la luz del fuego.',
      highlightLabel: 'Filosofía Pictórica',
      image: profile.studioImageUrl,
      accent: 'Proceso de Estudio',
      icon: Compass
    },
    {
      id: 'trayectoria',
      badge: 'Reconocimiento Internacional',
      eyebrow: 'Trayectoria',
      mainTitle: 'Exposiciones & Galardones',
      navLabel: 'Trayectoria',
      description: 'Obras presentes en colecciones privadas de Europa, América y Asia. Participación recurrente en bienales y salas de subasta contemporáneas.',
      highlight: 'Seleccionado en Art Basel y Marlborough Gallery por la pureza de sus contrastes y la fuerza del arquetipo.',
      highlightLabel: 'Hito Curatorial',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600&auto=format&fit=crop',
      accent: 'Madrid · CDMX · París',
      icon: Award
    }
  ];

  const handleNext = React.useCallback(() => {
    sound.playBrushWipe();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = React.useCallback(() => {
    sound.playBrushWipe();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto advance slides every 8 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [isHovered, handleNext]);

  const current = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden px-3 pt-4 pb-12 sm:px-6 lg:px-8">
      {/* Scroll-driven Lightweight Parallax & Fade Container */}
      <motion.div
        style={{ scale, opacity, y }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#14151a]/95 via-[#0e0f13]/95 to-[#090a0d]/95 p-5 sm:p-10 lg:p-14 shadow-2xl backdrop-blur-2xl transform-gpu will-change-transform"
      >
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-[#8C271E]/15 blur-[130px]" />

        {/* Quick Slide Selectors Pill Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((s, index) => {
              const Icon = s.icon;
              const isActive = index === currentSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    sound.playBrushWipe();
                    setCurrentSlide(index);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#FFE599] shadow-sm shadow-[#D4AF37]/20'
                      : 'border border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-zinc-500'}`} />
                  <span className="hidden xs:inline sm:inline">{s.navLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Slide anterior"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-[#D4AF37]/50 hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Siguiente slide"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-[#D4AF37]/50 hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Outer Banner Frame (Stays Fixed while internal content wipes with paint brush) */}
        <div className="relative min-h-[460px] sm:min-h-[500px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{
                opacity: 0,
                clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                filter: 'blur(8px)',
              }}
              animate={{
                opacity: 1,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                filter: 'blur(0px)',
              }}
              exit={{
                opacity: 0,
                clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
                filter: 'blur(8px)',
              }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
            >
              {/* Left Column: Story, Title & Dreams */}
              <div className="flex flex-col justify-center space-y-5 sm:space-y-6 lg:col-span-7">
                <BlurFade delay={0.05}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#FFE599] uppercase backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>{current.badge}</span>
                  </div>
                </BlurFade>

                <BlurFade delay={0.1}>
                  <div>
                    {/* Eyebrow / Concept: "¿Quién Soy?", "El Manifiesto", "Trayectoria" in white */}
                    <span className="font-serif text-lg sm:text-2xl font-light tracking-wide text-white block mb-1">
                      {current.eyebrow}
                    </span>

                    {/* Main Majestic Title with animated GradientText for all banner slides */}
                    <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight text-white leading-[1.08]">
                      <GradientText className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl">
                        {current.mainTitle}
                      </GradientText>
                    </h1>
                  </div>
                </BlurFade>

                <BlurFade delay={0.15}>
                  <p className="text-sm sm:text-base leading-relaxed text-zinc-300 font-light">
                    {current.description}
                  </p>
                </BlurFade>

                {/* Poetic Dream / Highlight Quote Box */}
                <BlurFade delay={0.2}>
                  <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#FFE599] uppercase tracking-wider">
                      <current.icon className="h-4 w-4 text-[#D4AF37]" />
                      <span>{current.highlightLabel}</span>
                    </div>
                    <p className="mt-2 font-serif text-sm italic text-zinc-200 leading-relaxed sm:text-base">
                      "{current.highlight}"
                    </p>
                  </div>
                </BlurFade>

                {/* Call to Actions & Slide Switchers */}
                <BlurFade delay={0.25}>
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <MagneticButton
                      onClick={onExploreClick}
                      className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A880] px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide text-zinc-950 shadow-lg shadow-[#D4AF37]/20 transition-all hover:shadow-[#D4AF37]/40"
                    >
                      <span>Explorar Colección</span>
                      <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                    </MagneticButton>
                  </div>
                </BlurFade>
              </div>

              {/* Right Column: Artist Portrait & Paint Textured Frame */}
              <div className="relative flex justify-center lg:col-span-5">
                <BlurFade delay={0.12}>
                  <div className="relative group w-full max-w-[340px] sm:max-w-[380px]">
                    {/* Golden atmospheric halo behind image */}
                    <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-r from-[#D4AF37]/30 to-[#8C271E]/30 blur-xl opacity-60 transition-all duration-700 group-hover:opacity-90" />

                    {/* Artwork / Portrait Card with rounded corners */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-white/20 bg-zinc-900 shadow-2xl">
                      <img
                        src={current.image}
                        alt={current.mainTitle}
                        className="h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                      />

                      {/* Organic Paint Brush Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* Floating metadata badge on image bottom */}
                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 rounded-xl border border-white/15 bg-black/65 p-3 sm:p-3.5 backdrop-blur-md">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white tracking-wide truncate max-w-[170px]">{profile.name}</span>
                          <span className="rounded-full bg-[#D4AF37]/20 px-2.5 py-0.5 text-[10px] font-medium text-[#FFE599] shrink-0">
                            {current.accent}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators / Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => {
                sound.playClick();
                setCurrentSlide(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                index === currentSlide ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
