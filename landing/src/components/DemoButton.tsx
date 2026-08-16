"use client";

import { useState } from "react";
import DemoModal from "./DemoModal";

type Props = {
  variant?: "hero" | "cta";
  label?: string;
  icon?: string;
};

export default function DemoButton({ variant = "hero", label, icon }: Props) {
  const [open, setOpen] = useState(false);

  const defaultLabel = variant === "hero" ? "Solicitar Demostración" : "Solicitar una Demo";
  const defaultIcon = variant === "hero" ? "rocket_launch" : "arrow_forward";
  const displayLabel = label ?? defaultLabel;
  const displayIcon = icon ?? defaultIcon;

  if (variant === "hero") {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00a8ff] to-[#00d4aa] text-[#003352] font-bold text-base hover:opacity-95 transition-all shadow-xl shadow-[#00a8ff]/25 flex items-center justify-center gap-3"
        >
          <span>{displayLabel}</span>
          <span className="material-symbols-outlined text-xl">{displayIcon}</span>
        </button>
        <DemoModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  // CTA bottom variant
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00a8ff] to-[#00d4aa] text-[#003352] font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-[#00a8ff]/20"
      >
        <span>{displayLabel}</span>
        <span className="material-symbols-outlined">{displayIcon}</span>
      </button>
      <DemoModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
