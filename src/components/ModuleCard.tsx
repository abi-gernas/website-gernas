"use client";

import { useState } from "react";
import type { TrainingModule } from "@/data/training";

export function ModuleCard({ module: m }: { module: TrainingModule }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className="rounded-card bg-surface p-6 text-left"
    >
      <span className="flex items-center justify-between gap-3 text-base font-bold text-brand-navy">
        <span>
          Modul {m.no}: {m.subtitle}
        </span>
        <span
          className={`shrink-0 text-brand-red transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </span>
      {open && (
        <ol className="mt-3 space-y-2 text-sm text-body">
          {m.points.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-semibold text-brand-red">{i + 1}.</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      )}
    </button>
  );
}
