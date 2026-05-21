/**
 * ASH CANVAS — EraserWidget
 * Eraser tool that follows mouse cursor and erases ash particles on drag
 */

import { useEffect, useRef, useState } from "react";

interface EraserWidgetProps {
  onErase: (x: number, y: number) => void;
  isDark: boolean;
}

const ERASER_IMG = "/manus-storage/eraser-hand_a6336e69.png";
const ERASER_RADIUS = 60;

export default function EraserWidget({ onErase, isDark }: EraserWidgetProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);
  const lastErasePosRef = useRef({ x: 0, y: 0 });

  // Track mouse position — only erase when mouse is down
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Only erase if mouse is explicitly down
      if (isMouseDownRef.current) {
        const dx = e.clientX - lastErasePosRef.current.x;
        const dy = e.clientY - lastErasePosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Erase every ~8 pixels for smooth erasing
        if (distance > 8) {
          const steps = Math.ceil(distance / 8);
          for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = lastErasePosRef.current.x + dx * t;
            const y = lastErasePosRef.current.y + dy * t;
            onErase(x, y);
          }
          lastErasePosRef.current = { x: e.clientX, y: e.clientY };
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [onErase]);

  // Handle mouse down/up — only when eraser mode is active
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click only
        isMouseDownRef.current = true;
        lastErasePosRef.current = { x: e.clientX, y: e.clientY };
        // Erase at initial click position
        onErase(e.clientX, e.clientY);
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
      isMouseDownRef.current = false; // Reset on unmount
    };
  }, [onErase]);

  // Offset eraser position from cursor
  const offsetX = mousePos.x - 45;
  const offsetY = mousePos.y - 45;

  return (
    <div
      className="fixed z-50 select-none pointer-events-none"
      style={{
        left: `${offsetX}px`,
        top: `${offsetY}px`,
        width: 90,
        height: 90,
      }}
    >
      {/* Eraser hand image */}
      <img
        src={ERASER_IMG}
        alt="eraser"
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
