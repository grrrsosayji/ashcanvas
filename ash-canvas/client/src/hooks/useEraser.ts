/**
 * ASH CANVAS — Eraser Tool Hook
 * Manages eraser functionality for removing ash particles
 */

import { useCallback } from "react";
import { AshParticle } from "./useAshPhysics";

export function useEraser() {
  const eraseParticles = useCallback(
    (particles: AshParticle[], eraserX: number, eraserY: number, eraserRadius: number) => {
      // Remove particles within eraser radius
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const dx = p.x - eraserX;
        const dy = p.y - eraserY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < eraserRadius) {
          particles.splice(i, 1);
        }
      }
    },
    []
  );

  return { eraseParticles };
}
