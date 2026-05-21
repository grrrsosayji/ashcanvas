/**
 * ASH CANVAS — CigaretteWidget
 * Lo-Fi Noir Canvas design system
 * 
 * Cigarette that:
 * - Follows mouse cursor
 * - Spawns ash particles on left-click and drag
 * - Shows rising smoke wisps
 */

import { useEffect, useRef, useState } from "react";

interface CigaretteWidgetProps {
  onAshSpawn: (x: number, y: number) => void;
  isDark: boolean;
}

interface SmokeWisp {
  id: number;
  offsetX: number;
  duration: number;
  size: number;
}

const CIGARETTE_IMG = "/manus-storage/30550-removebg-preview_8e566fa1.png";

export default function CigaretteWidget({ onAshSpawn, isDark }: CigaretteWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smokeWisps, setSmokeWisps] = useState<SmokeWisp[]>([]);
  const wispIdRef = useRef(0);
  const isMouseDownRef = useRef(false);
  const lastAshPosRef = useRef({ x: 0, y: 0 });

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // If mouse is down, spawn ash along the path
      if (isMouseDownRef.current) {
        const dx = e.clientX - lastAshPosRef.current.x;
        const dy = e.clientY - lastAshPosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Spawn ash every ~4 pixels for denser line
        if (distance > 4) {
          const steps = Math.ceil(distance / 4);
          for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = lastAshPosRef.current.x + dx * t;
            const y = lastAshPosRef.current.y + dy * t;
            
            // Spawn 2-4 ash particles per step for higher density
            const count = 2 + Math.floor(Math.random() * 3);
            for (let j = 0; j < count; j++) {
              const angle = Math.random() * Math.PI * 2;
              const r = Math.random() * 4;
              onAshSpawn(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
            }
          }
          lastAshPosRef.current = { x: e.clientX, y: e.clientY };
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [onAshSpawn]);

  // Handle mouse down/up
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click only
        isMouseDownRef.current = true;
        lastAshPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        isMouseDownRef.current = false;
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Periodic smoke wisps
  useEffect(() => {
    const smokeTimer = setInterval(() => {
      const newWisp: SmokeWisp = {
        id: wispIdRef.current++,
        offsetX: (Math.random() - 0.5) * 10,
        duration: 2.2 + Math.random() * 1.4,
        size: 8 + Math.random() * 8,
      };
      setSmokeWisps((prev) => [...prev.slice(-8), newWisp]);
    }, 600);
    return () => clearInterval(smokeTimer);
  }, []);

  const smokeColor = isDark ? "180,175,170" : "100,95,90";
  const smokeOpacity = isDark ? 0.25 : 0.18;

  // Offset cigarette position slightly from cursor
  const offsetX = mousePos.x - 40;
  const offsetY = mousePos.y - 100;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 select-none pointer-events-none"
      style={{
        left: `${offsetX}px`,
        top: `${offsetY}px`,
        width: 80,
        height: 200,
      }}
    >
      {/* Smoke wisps */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: 20,
          top: -30,
          width: 40,
          height: 120,
        }}
      >
        {smokeWisps.map((wisp) => (
          <div
            key={wisp.id}
            className="absolute rounded-full"
            style={{
              width: wisp.size,
              height: wisp.size,
              left: 15 + wisp.offsetX,
              bottom: 0,
              background: `rgba(${smokeColor},${smokeOpacity})`,
              filter: "blur(6px)",
              animation: `smoke-rise ${wisp.duration}s ease-out forwards`,
            }}
          />
        ))}
      </div>

      {/* Cigarette image */}
      <img
        src={CIGARETTE_IMG}
        alt="cigarette"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: isDark ? "brightness(0.95)" : "brightness(1)",
          transition: "filter 0.3s ease",
        }}
      />
    </div>
  );
}
