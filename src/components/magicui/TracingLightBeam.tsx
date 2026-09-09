import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../../lib/sound';

// Exact Single-Stroke Centerline Path normalized to fill 300x250 viewbox majestically
const GEOMETRIC_BULL_PATH = "M 17 15 L 17 19 L 15 21 L 15 25 L 15 29 L 15 33 L 15 37 L 17 41 L 17 45 L 19 50 L 19 54 L 21 58 L 21 62 L 23 64 L 25 66 L 27 68 L 29 70 L 31 72 L 33 74 L 35 78 L 37 80 L 39 82 L 41 84 L 45 86 L 50 86 L 54 88 L 58 88 L 62 90 L 62 94 L 66 94 L 70 94 L 74 94 L 78 96 L 82 96 L 86 96 L 90 96 L 92 94 L 94 90 L 96 86 L 96 82 L 98 78 L 100 74 L 104 74 L 106 76 L 108 80 L 108 84 L 110 88 L 112 92 L 114 96 L 114 100 L 117 104 L 119 108 L 119 112 L 121 117 L 123 121 L 123 125 L 121 127 L 121 131 L 125 131 L 127 129 L 131 127 L 135 127 L 137 125 L 139 123 L 141 121 L 143 119 L 145 117 L 149 117 L 153 117 L 155 119 L 157 121 L 161 123 L 163 125 L 165 127 L 169 127 L 173 129 L 177 129 L 177 125 L 181 125 L 186 123 L 188 121 L 190 119 L 192 117 L 194 114 L 198 114 L 202 114 L 202 119 L 206 119 L 210 119 L 214 123 L 218 123 L 222 125 L 226 127 L 230 129 L 234 129 L 238 127 L 240 125 L 244 123 L 246 121 L 250 119 L 253 117 L 255 114 L 257 110 L 255 106 L 250 104 L 248 100 L 246 98 L 244 96 L 240 94 L 236 94 L 232 94 L 228 94 L 224 94 L 220 96 L 216 96 L 212 96 L 210 98 L 210 102 L 208 106 L 204 108 L 202 112 L 204 108 L 208 106 L 210 102 L 210 98 L 206 94 L 206 90 L 204 86 L 202 82 L 200 78 L 200 74 L 196 72 L 194 74 L 192 78 L 190 82 L 190 86 L 188 90 L 186 94 L 183 98 L 183 102 L 181 106 L 179 110 L 179 114 L 177 119 L 177 123 L 177 119 L 179 114 L 179 110 L 181 106 L 183 102 L 183 98 L 186 94 L 188 90 L 190 86 L 190 82 L 192 78 L 194 74 L 196 72 L 198 68 L 200 66 L 204 66 L 208 64 L 212 64 L 216 64 L 220 62 L 224 62 L 228 62 L 232 60 L 236 60 L 240 58 L 244 58 L 246 56 L 248 54 L 253 52 L 257 50 L 259 47 L 263 47 L 265 45 L 265 41 L 267 39 L 269 35 L 271 33 L 273 29 L 275 27 L 277 25 L 279 23 L 283 23 L 285 25 L 285 29 L 285 33 L 283 37 L 283 41 L 281 45 L 281 50 L 279 54 L 279 58 L 277 62 L 275 66 L 273 68 L 271 70 L 269 72 L 267 74 L 265 76 L 263 78 L 261 82 L 259 84 L 255 86 L 250 86 L 246 88 L 242 88 L 240 90 L 240 90 L 242 88 L 246 88 L 250 86 L 255 86 L 259 84 L 261 82 L 263 78 L 265 76 L 267 74 L 269 72 L 271 70 L 273 68 L 275 66 L 277 62 L 279 58 L 279 54 L 281 50 L 281 45 L 283 41 L 283 37 L 285 33 L 285 29 L 285 25 L 283 23 L 283 19 L 283 15 L 283 19 L 279 23 L 277 25 L 275 27 L 273 29 L 271 33 L 269 35 L 267 39 L 265 41 L 265 45 L 263 47 L 259 47 L 257 50 L 253 52 L 248 54 L 246 56 L 244 58 L 240 58 L 236 60 L 232 60 L 228 62 L 224 62 L 220 62 L 216 64 L 212 64 L 208 64 L 204 66 L 200 66 L 196 66 L 192 64 L 190 62 L 188 60 L 183 60 L 181 58 L 179 56 L 175 54 L 171 54 L 167 56 L 163 56 L 159 56 L 155 58 L 151 58 L 147 58 L 143 56 L 139 56 L 135 56 L 131 54 L 127 54 L 123 56 L 119 58 L 117 60 L 112 60 L 110 62 L 108 64 L 104 66 L 102 68 L 102 72 L 102 68 L 98 66 L 94 64 L 90 64 L 86 64 L 82 62 L 78 62 L 74 62 L 70 62 L 66 60 L 62 60 L 58 58 L 56 56 L 52 56 L 50 54 L 47 52 L 43 50 L 41 47 L 37 47 L 35 45 L 33 43 L 33 39 L 31 37 L 29 35 L 27 33 L 25 29 L 23 27 L 23 23 L 19 23 L 23 23 L 23 27 L 25 29 L 27 33 L 29 35 L 31 37 L 33 39 L 33 43 L 35 45 L 37 47 L 41 47 L 43 50 L 47 52 L 50 54 L 52 56 L 56 56 L 58 58 L 62 60 L 66 60 L 70 62 L 74 62 L 78 62 L 82 62 L 86 64 L 90 64 L 94 64 L 98 66 L 102 68 L 104 66 L 108 64 L 110 62 L 112 60 L 117 60 L 119 58 L 123 56 L 127 54 L 131 54 L 135 56 L 139 56 L 143 56 L 147 58 L 151 58 L 155 58 L 159 56 L 163 56 L 167 56 L 171 54 L 175 54 L 179 56 L 181 58 L 183 60 L 188 60 L 190 62 L 192 64 L 196 66 L 198 68 L 196 72 L 200 74 L 200 78 L 202 82 L 204 86 L 206 90 L 206 94 L 210 98 L 212 96 L 216 96 L 220 96 L 224 94 L 228 94 L 232 94 L 236 94 L 240 94 L 244 96 L 246 98 L 248 100 L 250 104 L 246 106 L 242 104 L 238 104 L 236 106 L 232 106 L 228 108 L 226 110 L 222 110 L 218 112 L 214 114 L 212 117 L 214 114 L 218 112 L 222 110 L 226 110 L 228 108 L 232 106 L 236 106 L 238 104 L 242 104 L 246 106 L 250 104 L 255 106 L 257 110 L 255 114 L 253 117 L 250 119 L 246 121 L 244 123 L 240 125 L 238 127 L 234 129 L 230 129 L 226 127 L 222 125 L 218 123 L 214 123 L 210 119 L 206 119 L 202 121 L 200 125 L 200 129 L 200 133 L 200 137 L 200 141 L 200 145 L 200 149 L 200 153 L 200 157 L 200 161 L 198 165 L 196 169 L 194 171 L 192 173 L 190 177 L 188 179 L 186 183 L 181 183 L 181 188 L 181 192 L 181 196 L 181 200 L 181 204 L 179 208 L 177 212 L 175 216 L 171 216 L 169 218 L 169 222 L 167 226 L 163 228 L 159 228 L 155 228 L 151 228 L 147 228 L 143 228 L 139 228 L 135 226 L 133 224 L 131 222 L 129 218 L 131 216 L 135 216 L 139 214 L 143 214 L 147 214 L 151 214 L 155 214 L 159 214 L 163 216 L 167 216 L 163 216 L 159 214 L 155 214 L 151 214 L 147 214 L 143 214 L 139 214 L 135 216 L 131 216 L 127 216 L 123 214 L 121 212 L 119 208 L 119 204 L 119 200 L 119 196 L 119 192 L 119 188 L 119 183 L 123 183 L 127 181 L 131 181 L 135 181 L 139 181 L 143 181 L 147 183 L 151 183 L 155 181 L 159 181 L 163 181 L 167 181 L 171 181 L 175 183 L 179 183 L 181 179 L 181 175 L 181 171 L 181 167 L 183 163 L 181 159 L 181 155 L 179 151 L 179 147 L 177 143 L 177 139 L 173 137 L 169 139 L 169 143 L 167 147 L 165 151 L 165 155 L 165 159 L 165 163 L 167 167 L 169 171 L 171 175 L 171 179 L 171 175 L 169 171 L 167 167 L 165 163 L 165 159 L 165 155 L 165 151 L 167 147 L 169 143 L 169 139 L 173 137 L 175 133 L 175 133 L 173 137 L 177 139 L 177 143 L 179 147 L 179 151 L 181 155 L 181 159 L 183 163 L 181 167 L 181 171 L 181 175 L 181 179 L 179 183 L 175 183 L 171 181 L 167 181 L 163 181 L 159 181 L 155 181 L 151 183 L 147 183 L 143 181 L 139 181 L 135 181 L 131 181 L 129 177 L 129 173 L 131 169 L 133 167 L 133 163 L 135 159 L 135 155 L 133 151 L 131 147 L 131 143 L 129 139 L 125 137 L 123 139 L 121 143 L 121 147 L 119 151 L 119 155 L 117 159 L 117 163 L 117 167 L 119 171 L 119 175 L 119 179 L 117 183 L 112 181 L 110 179 L 108 177 L 106 173 L 104 171 L 104 167 L 102 165 L 100 161 L 100 157 L 100 153 L 100 149 L 100 145 L 100 141 L 100 137 L 100 133 L 104 133 L 108 133 L 112 133 L 117 133 L 117 133 L 112 133 L 108 133 L 104 133 L 100 131 L 100 127 L 98 123 L 96 119 L 92 119 L 90 121 L 86 123 L 82 123 L 78 125 L 74 127 L 70 129 L 66 129 L 62 127 L 60 125 L 56 123 L 54 121 L 50 119 L 47 117 L 45 114 L 43 110 L 45 106 L 50 104 L 54 106 L 58 104 L 62 104 L 64 106 L 68 106 L 72 108 L 74 110 L 78 110 L 82 112 L 84 114 L 88 114 L 88 114 L 84 114 L 82 112 L 78 110 L 74 110 L 72 108 L 68 106 L 64 106 L 62 104 L 58 104 L 54 106 L 50 104 L 52 100 L 54 98 L 56 96 L 60 96 L 56 96 L 54 98 L 52 100 L 50 104 L 45 106 L 43 110 L 45 114 L 47 117 L 50 119 L 54 121 L 56 123 L 60 125 L 62 127 L 66 129 L 70 129 L 74 127 L 78 125 L 82 123 L 86 123 L 90 121 L 92 119 L 96 119 L 98 114 L 102 114 L 106 114 L 108 117 L 110 119 L 112 121 L 114 123 L 119 125 L 114 123 L 112 121 L 110 119 L 108 117 L 106 114 L 102 114 L 98 112 L 96 108 L 94 106 L 92 104 L 90 102 L 90 98 L 90 102 L 92 104 L 94 106 L 96 108 L 98 112 L 98 114 L 96 119 L 98 123 L 100 127 L 100 131 L 100 133 L 100 137 L 100 141 L 100 145 L 100 149 L 100 153 L 100 157 L 100 161 L 102 165 L 104 167 L 104 171 L 106 173 L 108 177 L 110 179 L 112 181 L 117 183 L 119 179 L 119 175 L 119 171 L 117 167 L 117 163 L 117 159 L 119 155 L 119 151 L 121 147 L 121 143 L 123 139 L 125 135 L 125 135 L 125 137 L 129 139 L 131 143 L 131 147 L 133 151 L 135 155 L 135 159 L 133 163 L 133 167 L 131 169 L 129 173 L 129 177 L 131 181 L 127 181 L 123 183 L 119 183 L 119 188 L 119 192 L 119 196 L 119 200 L 119 204 L 119 208 L 121 212 L 123 214 L 127 216 L 129 218 L 131 222 L 133 224 L 135 226 L 139 228 L 143 228 L 147 228 L 151 228 L 155 228 L 159 228 L 163 228 L 167 226 L 169 222 L 169 218 L 171 216 L 175 216 L 177 212 L 179 208 L 181 204 L 181 200 L 181 196 L 181 192 L 181 188 L 181 183 L 186 183 L 188 179 L 190 177 L 192 173 L 194 171 L 196 169 L 198 165 L 200 161 L 200 157 L 200 153 L 200 149 L 200 145 L 200 141 L 200 137 L 198 133 L 194 133 L 190 133 L 186 133 L 181 133 L 181 133 L 186 133 L 190 133 L 194 133 L 198 133 L 200 133 L 200 129 L 200 125 L 202 121 L 202 119 L 202 114 L 198 114 L 194 114 L 192 117 L 190 119 L 188 121 L 186 123 L 181 125 L 177 125 L 177 129 L 173 129 L 169 127 L 165 127 L 163 125 L 161 123 L 157 121 L 155 119 L 153 117 L 149 117 L 145 117 L 143 119 L 141 121 L 139 123 L 137 125 L 135 127 L 131 127 L 127 129 L 125 131 L 121 131 L 121 127 L 123 125 L 123 121 L 121 117 L 119 112 L 119 108 L 117 104 L 114 100 L 114 96 L 112 92 L 110 88 L 108 84 L 108 80 L 106 76 L 104 74 L 100 74 L 98 78 L 96 82 L 96 86 L 94 90 L 92 94 L 90 96 L 86 96 L 82 96 L 78 96 L 74 94 L 70 94 L 66 94 L 62 94 L 62 90 L 58 88 L 54 88 L 50 86 L 45 86 L 41 84 L 39 82 L 37 80 L 35 78 L 33 74 L 31 72 L 29 70 L 27 68 L 25 66 L 23 64 L 21 62 L 21 58 L 19 54 L 19 50 L 17 45 L 17 41 L 15 37 L 15 33 L 15 29 L 15 25 L 15 21 L 17 19 L 17 15 L 169 192 L 169 196 L 165 198 L 169 196 L 169 192 L 131 192 L 131 196 L 135 198 L 137 200 L 137 204 L 137 200 L 135 198 L 131 196 L 131 192";
const VIEWBOX_W = 300;
const VIEWBOX_H = 250;

export const TracingLightBeam: React.FC = () => {
  const [animationCycle, setAnimationCycle] = useState(0);

  useEffect(() => {
    // Sound resonance trigger timed when the continuous line is drawn
    const soundTimer = setTimeout(() => {
      sound.playBullResonance();
    }, 1800);

    const cycleInterval = setInterval(() => {
      setAnimationCycle((prev) => prev + 1);
    }, 8500);

    return () => {
      clearTimeout(soundTimer);
      clearInterval(cycleInterval);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden min-[1380px]:block w-36 sm:w-40 md:w-44 lg:w-48 overflow-visible">
      {/* 1. Vertical Light Rails (Top to Center, and Center to Bottom) */}
      <svg
        key={`rail-${animationCycle}`}
        className="h-full w-full overflow-visible"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFE599" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <filter id="railLaserGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="g1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="g2" />
            <feMerge>
              <feMergeNode in="g2" />
              <feMergeNode in="g1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top rail down to viewport center (y = 500) */}
        <motion.path
          d="M 40 0 L 40 370"
          stroke="url(#laserBeamGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#railLaserGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            opacity: [0, 1, 0], // Fades away completely 1.5s after passing
          }}
          transition={{
            duration: 1.4,
            times: [0, 0.45, 0.9],
            ease: "easeInOut",
          }}
        />

        {/* Bottom rail continuing down from center (y = 630) to bottom */}
        <motion.path
          d="M 40 630 L 40 1000"
          stroke="url(#laserBeamGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#railLaserGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            opacity: [0, 1, 0], // Fades away completely 1.5s after passing
          }}
          transition={{
            delay: 3.8,
            duration: 1.6,
            times: [0, 0.45, 0.9],
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* 2. GEOMETRIC BULL SINGLE CONTINUOUS STROKE - Refined, subtle luxury proportions */}
      <div className="absolute top-1/2 left-2 sm:left-3 lg:left-3.5 -translate-y-1/2 w-28 h-24 sm:w-32 sm:h-28 md:w-36 md:h-30 lg:w-40 lg:h-34 overflow-visible">
        <svg
          key={`geo-bull-trace-${animationCycle}`}
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="geoLaserGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="s1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="s2" />
              <feMerge>
                <feMergeNode in="s2" />
                <feMergeNode in="s1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="geoLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="35%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#FFE599" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>

          {/* SINGLE LASER STROKE: Completely OFF/INVISIBLE until drawn, stays 1.5s, dissolves to 0 */}
          <motion.path
            d={GEOMETRIC_BULL_PATH}
            fill="none"
            stroke="url(#geoLineGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#geoLaserGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 1], // Physically traces the entire geometry
              opacity: [0, 1, 1, 0], // Inactive (0) -> Visible during draw (1) -> Holds 1.5s -> Completely turned off (0)
            }}
            transition={{
              delay: 0.8,
              duration: 3.1, // 1.6s draw + 1.5s hold + smooth turn off
              times: [0, 0.52, 0.85, 1],
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
    </div>
  );
};
