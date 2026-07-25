"use client";

import Image from "next/image";
import { useState } from "react";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  photo?: string;
  tone?: "yellow" | "navy" | "red";
};

const toneMap = {
  yellow: "bg-brand-yellow text-brand-navy",
  navy: "bg-brand-navy text-white",
  red: "bg-brand-red text-white",
};

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const t = items[i];
  const tone = t.tone ?? "yellow";
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);

  return (
    <>
    <div className="flex items-center gap-3 sm:gap-5">
      <button
        onClick={() => go(-1)}
        aria-label="Testimoni sebelumnya"
        className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 text-brand-navy transition-colors hover:bg-brand-navy hover:text-white sm:inline-flex"
      >
        ‹
      </button>

      <div className="grid flex-1 items-stretch gap-5 md:grid-cols-[minmax(0,320px)_1fr]">
        <div className="relative min-h-[240px] overflow-hidden rounded-card bg-surface">
          {t.photo ? (
            <Image src={t.photo} alt={t.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl text-brand-navy/20">
              &ldquo;
            </div>
          )}
        </div>

        <div
          className={`flex flex-col justify-center rounded-card p-7 sm:p-9 ${toneMap[tone]}`}
        >
          <span className="text-4xl font-serif leading-none opacity-60">”</span>
          <p className="mt-2 text-sm leading-relaxed sm:text-base">{t.quote}</p>
          <div className="mt-5">
            <p className="font-bold">{t.name}</p>
            <p className="text-xs opacity-80">{t.role}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => go(1)}
        aria-label="Testimoni berikutnya"
        className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 text-brand-navy transition-colors hover:bg-brand-navy hover:text-white sm:inline-flex"
      >
        ›
      </button>
    </div>

    {/* Mobile controls: arrows + dots */}
    <div className="mt-5 flex items-center justify-center gap-4 sm:hidden">
      <button
        onClick={() => go(-1)}
        aria-label="Testimoni sebelumnya"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-brand-navy"
      >
        ‹
      </button>
      <div className="flex gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Testimoni ${idx + 1} dari ${items.length}`}
            aria-current={idx === i}
            className="flex h-11 w-6 items-center justify-center"
          >
            <span
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-6 bg-brand-red" : "w-2 bg-brand-navy/25"
              }`}
            />
          </button>
        ))}
      </div>
      <button
        onClick={() => go(1)}
        aria-label="Testimoni berikutnya"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-brand-navy"
      >
        ›
      </button>
    </div>
    </>
  );
}
