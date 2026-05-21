/**
 * ASH CANVAS — Ash Particle Physics Engine
 * Lo-Fi Noir Canvas design system
 * 
 * Singleton pattern: all hooks share the same particle array and config.
 * Manages ash particles: spawning at click location and staying fixed.
 * 
 * Black ash in light mode, white ash in dark mode.
 * Tiny sand-like particles with varied angular shapes.
 * Particles spawn and immediately settle at spawn location.
 */

import { useCallback, useRef } from "react";

export interface AshParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  settled: boolean;
  age: number;
  color: string;
  shape: "angular" | "dust"; // Tiny angular or dust
  rotation: number;
  scaleX: number;
  scaleY: number;
  sides?: number;
}

interface PhysicsConfig {
  gravity: number;
  friction: number;
  mouseRadius: number;
  mouseForce: number;
  spawnX: number;
  spawnY: number;
  isDark: boolean;
}

// Singleton state — shared across all hook instances
const globalParticles: AshParticle[] = [];
const globalConfig: PhysicsConfig = {
  gravity: 0.14,
  friction: 0.96,
  mouseRadius: 70,
  mouseForce: 4.2,
  spawnX: 0,
  spawnY: 0,
  isDark: false,
};
let idCounter = 0;
const MAX_PARTICLES = 10000; // Increased limit to prevent premature deletion

function getAshColor(isDark: boolean): string {
  if (isDark) {
    // White ash in dark mode
    return `rgba(${245 + (Math.random() * 10 | 0)}, ${243 + (Math.random() * 10 | 0)}, ${240 + (Math.random() * 8 | 0)}, ${(0.8 + Math.random() * 0.2).toFixed(2)})`;
  } else {
    // Black ash in light mode
    return `rgba(${15 + (Math.random() * 15 | 0)}, ${10 + (Math.random() * 15 | 0)}, ${5 + (Math.random() * 10 | 0)}, ${(0.8 + Math.random() * 0.2).toFixed(2)})`;
  }
}

export function useAshPhysics() {
  const updateConfig = useCallback((config: Partial<PhysicsConfig>) => {
    Object.assign(globalConfig, config);
    
    // When theme changes, update color of all particles
    if (config.isDark !== undefined) {
      for (const p of globalParticles) {
        p.color = getAshColor(config.isDark);
      }
    }
  }, []);

  const spawnAsh = useCallback(() => {
    if (globalParticles.length >= MAX_PARTICLES) {
      // Remove the oldest/most transparent particle instead of first
      let minOpacityIdx = 0;
      let minOpacity = globalParticles[0].opacity;
      for (let i = 1; i < globalParticles.length; i++) {
        if (globalParticles[i].opacity < minOpacity) {
          minOpacity = globalParticles[i].opacity;
          minOpacityIdx = i;
        }
      }
      globalParticles.splice(minOpacityIdx, 1);
    }

    const cfg = globalConfig;
    const ashColor = getAshColor(cfg.isDark);
    
    // Tiny sand-like particles — much smaller
    const shapeRand = Math.random();
    let shape: "angular" | "dust";
    let radius: number;
    let sides: number | undefined;
    
    if (shapeRand < 0.6) {
      shape = "angular";
      radius = 0.4 + Math.random() * 0.8; // Tiny angular chunks
      sides = 3 + (Math.random() * 4 | 0); // 3-6 sides
    } else {
      shape = "dust";
      radius = 0.3 + Math.random() * 0.6; // Fine dust
    }

    globalParticles.push({
      id: idCounter++,
      x: cfg.spawnX + (Math.random() - 0.5) * 6,
      y: cfg.spawnY,
      vx: 0,
      vy: 0,
      radius,
      opacity: 0.75 + Math.random() * 0.25,
      settled: true, // Immediately settled
      age: 0,
      color: ashColor,
      shape,
      rotation: Math.random() * Math.PI * 2,
      scaleX: 0.7 + Math.random() * 0.6,
      scaleY: 0.6 + Math.random() * 0.7,
      sides,
    });
  }, []);

  const tick = useCallback(
    (_mouseX: number | null, _mouseY: number | null, _isMouseDown: boolean, _canvasH: number) => {
      // No physics needed — all particles are settled on spawn
      const particles = globalParticles;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age++;
        // Never remove particles — they persist until explicitly erased
      }
    },
    []
  );

  const clearAll = useCallback(() => {
    globalParticles.length = 0;
  }, []);

  const getParticles = useCallback(() => globalParticles, []);

  return { spawnAsh, tick, clearAll, getParticles, updateConfig };
}
