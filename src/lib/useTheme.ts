"use client";

import { useState, useEffect } from "react";

export function useTheme() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsLight(document.documentElement.classList.contains("light"));
    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return {
    isLight,
    colors: {
      grid: isLight ? "#e2e4ea" : "#2a2a4a",
      axis: isLight ? "#9ca3af" : "#6b7280",
      axisLabel: isLight ? "#4b5563" : "#a1a1aa",
      tooltipBg: isLight ? "#ffffff" : "#1a1a2e",
      tooltipBorder: isLight ? "#e2e4ea" : "#2a2a4a",
      tooltipText: isLight ? "#111827" : "#e5e7eb",
      accent: isLight ? "#0d9488" : "#2dd4bf",
      cursor: isLight ? "rgba(13, 148, 136, 0.08)" : "rgba(45, 212, 191, 0.06)",
      dotFill: isLight ? "#f0f2f7" : "#1a1a2e",
    },
  };
}
