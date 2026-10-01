"use client";

import React, { useEffect } from "react";

/**
 * Global lightweight ripple handler for buttons.
 * Detects clicks on primary/outline buttons and creates a subtle hydraulic ripple
 * expanding from the click origin and auto-removing after 400ms.
 */
export function HydraulicRippleProvider() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Check prefers-reduced-motion
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const btn = target.closest<HTMLElement>(
        ".btn-primary-corp, .btn-outline-corp, button:not([data-no-ripple]), [data-ripple]"
      );
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "hydraulic-ripple-circle";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      btn.appendChild(ripple);

      // Clean up after animation finishes to ensure zero DOM accumulation
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 420);
    };

    document.addEventListener("click", handleClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
