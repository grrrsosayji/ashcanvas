/**
 * ASH CANVAS — AshCanvas
 * Lo-Fi Noir Canvas design system
 * 
 * Full-screen canvas that:
 * - Renders ash particles via requestAnimationFrame
 * - Particles spawn on click and stay fixed
 * - Supports eraser to remove particles
 * - Supports light/dark background
 * - Exposes spawn, clear, getParticles, erase via refs to parent
 */

import { useCallback, useEffect, useRef } from "react";
import { useAshPhysics, type AshParticle } from "@/hooks/useAshPhysics";
import { useEraser } from "@/hooks/useEraser";

interface AshCanvasProps {
  isDark: boolean;
  brushSize: number;
  onAshSpawnRef: React.MutableRefObject<((x: number, y: number) => void) | null>;
  onClearRef: React.MutableRefObject<(() => void) | null>;
  getParticlesRef: React.MutableRefObject<(() => unknown[]) | null>;
  onEraseRef: React.MutableRefObject<((x: number, y: number) => void) | null>;
}

export default function AshCanvas({
  isDark,
  brushSize,
  onAshSpawnRef,
  onClearRef,
  getParticlesRef,
  onEraseRef,
}: AshCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isDarkRef = useRef(isDark);

  const { spawnAsh, tick, clearAll, getParticles, updateConfig } = useAshPhysics();
  const { eraseParticles } = useEraser();

  // Keep refs in sync
  useEffect(() => { isDarkRef.current = isDark; updateConfig({ isDark }); }, [isDark, updateConfig]);

  // Expose spawn, clear, getParticles, erase to parent
  useEffect(() => {
    onAshSpawnRef.current = (x: number, y: number) => {
      updateConfig({ spawnX: x, spawnY: y, isDark: isDarkRef.current });
      spawnAsh();
    };
    onClearRef.current = clearAll;
    getParticlesRef.current = getParticles;
    onEraseRef.current = (x: number, y: number) => {
      const particles = getParticles() as AshParticle[];
      eraseParticles(particles, x, y, 40); // Eraser radius: 40
    };
  }, [spawnAsh, clearAll, getParticles, updateConfig, onAshSpawnRef, onClearRef, getParticlesRef, onEraseRef, eraseParticles]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Draw polygon (for angular ash)
  const drawPolygon = (ctx: CanvasRenderingContext2D, sides: number, radius: number) => {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  // Draw tiny sand-like ash particle
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, p: AshParticle) => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    if (p.shape === "angular") {
      // Angular chunks
      ctx.scale(p.scaleX * 1.1, p.scaleY * 1.0);
      drawPolygon(ctx, p.sides || 4, p.radius);
    } else {
      // Dust particles
      ctx.beginPath();
      ctx.arc(0, 0, p.radius * 0.85, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }, []);

  // RAF loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Tick physics (no mouse interaction)
      tick(null, null, false, canvas.height);

      const particles = getParticles();
      for (const p of particles) {
        drawParticle(ctx, p);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10"
      style={{ cursor: "crosshair", touchAction: "none" }}
    />
  );
}
