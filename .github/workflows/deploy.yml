/**
 * ASH CANVAS — Toolbar
 * Lo-Fi Noir Canvas design system
 * 
 * Minimal toolbar with:
 * - Brush size slider
 * - Dark/Light mode toggle (keyboard: D)
 * - Particle count display
 */

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

interface ToolbarProps {
  isDark: boolean;
  onToggleDark: () => void;
  brushSize: number;
  onBrushSize: (v: number) => void;
  particleCount: number;
  mode: "drawing" | "eraser";
  onToggleMode: () => void;
}

const CIGARETTE_IMG = "/manus-storage/30550-removebg-preview_8e566fa1.png";
const ERASER_IMG = "/manus-storage/eraser-hand_a6336e69.png";

export default function Toolbar({
  isDark,
  onToggleDark,
  brushSize,
  onBrushSize,
  particleCount,
  mode,
  onToggleMode,
}: ToolbarProps) {
  // Keyboard shortcut: D for dark/light toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "d" || e.key === "D") onToggleDark();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onToggleDark]);

  const glass = isDark
    ? "bg-[#0D0D12]/70 border-white/[0.08] text-[#D4C8B8]"
    : "bg-white/80 border-black/[0.08] text-[#1A1510]";

  const divider = isDark ? "bg-white/[0.1]" : "bg-black/[0.1]";

  const btnBase =
    "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] border transition-all duration-150 active:scale-[0.96] select-none";

  const btnOff = isDark
    ? "bg-transparent border-transparent hover:bg-white/[0.08] text-[#D4C8B8]/75"
    : "bg-transparent border-transparent hover:bg-black/[0.06] text-[#1A1510]/70";

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-lg border toolbar-glass ${glass} animate-fade-in-up`}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        boxShadow: isDark
          ? "0 2px 16px rgba(0,0,0,0.5)"
          : "0 2px 16px rgba(0,0,0,0.08)",
        whiteSpace: "nowrap",
      }}
    >
      {/* Title */}
      <span
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "13px",
          letterSpacing: "0.08em",
          opacity: 0.5,
          marginRight: "4px",
          fontStyle: "italic",
        }}
      >
        ash canvas
      </span>

      <div className={`w-px h-4 ${divider}`} />

      {/* Brush size */}
      <div className="flex items-center gap-2">
        <span style={{ fontSize: "10px", opacity: 0.4, letterSpacing: "0.08em" }}>radius</span>
        <input
          type="range"
          min={25}
          max={140}
          value={brushSize}
          onChange={(e) => onBrushSize(Number(e.target.value))}
          className="w-[70px]"
          style={{
            height: "2px",
            accentColor: isDark ? "#D4C8B8" : "#1A1510",
            opacity: 0.65,
            cursor: "ew-resize",
          }}
        />
        <span style={{ fontSize: "10px", opacity: 0.4, minWidth: "24px", textAlign: "right" }}>
          {brushSize}
        </span>
      </div>

      <div className={`w-px h-4 ${divider}`} />

      {/* Particle count */}
      <span
        style={{
          fontSize: "10px",
          opacity: 0.3,
          fontVariantNumeric: "tabular-nums",
          minWidth: "56px",
          letterSpacing: "0.04em",
        }}
      >
        {String(particleCount).padStart(4, "0")} ash
      </span>

      <div className={`w-px h-4 ${divider}`} />

      {/* Mode toggle button */}
      <button
        onClick={onToggleMode}
        className={`${btnBase} ${btnOff}`}
        title={mode === "drawing" ? "Switch to Eraser" : "Switch to Drawing"}
      >
        <img
          src={mode === "drawing" ? ERASER_IMG : CIGARETTE_IMG}
          alt={mode}
          style={{
            width: "16px",
            height: "16px",
            objectFit: "contain",
            filter: isDark ? "brightness(0.9)" : "brightness(1)",
          }}
        />
      </button>

      <div className={`w-px h-4 ${divider}`} />

      {/* Theme toggle */}
      <button
        onClick={onToggleDark}
        className={`${btnBase} ${btnOff}`}
        title="Toggle dark/light (D)"
      >
        {isDark ? <Sun size={11} strokeWidth={2} /> : <Moon size={11} strokeWidth={2} />}
      </button>
    </div>
  );
}
