/**
 * ASH CANVAS — Home Page
 * Lo-Fi Noir Canvas design system
 * 
 * Full-screen interactive ash drawing experience.
 * Light: pure white background
 * Dark: pure black background
 * 
 * Layout:
 * - Full-screen canvas (z-10)
 * - Cigarette widget follows mouse (z-50)
 * - Toolbar fixed top-center (z-50)
 * - Grain texture overlay (z-100, pointer-events-none)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import AshCanvas from "@/components/AshCanvas";
import CigaretteWidget from "@/components/CigaretteWidget";
import EraserWidget from "@/components/EraserWidget";
import Toolbar from "@/components/Toolbar";

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [brushSize, setBrushSize] = useState(70);
  const [particleCount, setParticleCount] = useState(0);
  const [mode, setMode] = useState<"drawing" | "eraser">("drawing");

  // Refs to communicate with AshCanvas's internal physics
  const onAshSpawnRef = useRef<((x: number, y: number) => void) | null>(null);
  const onClearRef = useRef<(() => void) | null>(null);
  const getParticlesRef = useRef<(() => unknown[]) | null>(null);
  const onEraseRef = useRef<((x: number, y: number) => void) | null>(null);

  // Sync theme class on document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Update particle count periodically via ref
  useEffect(() => {
    const timer = setInterval(() => {
      if (getParticlesRef.current) {
        setParticleCount(getParticlesRef.current().length);
      }
    }, 250);
    return () => clearInterval(timer);
  }, []);

  const handleAshSpawn = useCallback((x: number, y: number) => {
    if (onAshSpawnRef.current) {
      onAshSpawnRef.current(x, y);
    }
  }, []);

  const handleErase = useCallback((x: number, y: number) => {
    if (onEraseRef.current) {
      onEraseRef.current(x, y);
    }
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: isDark ? "#000000" : "#FFFFFF",
        transition: "background-color 0.4s ease",
      }}
    >
      {/* Grain overlay */}
      <div className="grain-overlay" style={{ opacity: isDark ? 0.04 : 0.02 }} />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          background: isDark
            ? "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)"
            : "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      {/* Main canvas */}
      <AshCanvas
        isDark={isDark}
        brushSize={brushSize}
        onAshSpawnRef={onAshSpawnRef}
        onClearRef={onClearRef}
        getParticlesRef={getParticlesRef}
        onEraseRef={onEraseRef}
      />

      {/* Cigarette or Eraser widget */}
      {mode === "drawing" ? (
        <CigaretteWidget onAshSpawn={handleAshSpawn} isDark={isDark} />
      ) : (
        <EraserWidget onErase={handleErase} isDark={isDark} />
      )}

      {/* Toolbar */}
      <Toolbar
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
        brushSize={brushSize}
        onBrushSize={setBrushSize}
        particleCount={particleCount}
        mode={mode}
        onToggleMode={() => setMode((m) => (m === "drawing" ? "eraser" : "drawing"))}
      />
    </div>
  );
}
