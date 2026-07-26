"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroSlide = {
  title: string;
  highlight?: string;
  description?: string;
  image: string;
  cta?: { label: string; href: string };
};

/** Single static hero (interior pages) */
export function PageHero({
  title,
  description,
  image,
  tint = "navy",
}: {
  title: string;
  description?: string;
  image: string;
  tint?: "navy" | "dark";
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className={`absolute inset-0 ${
            tint === "dark" ? "bg-black/60" : "bg-brand-navy/75"
          }`}
        />
      </div>
      <div className="container-page flex min-h-[300px] flex-col items-center justify-center py-16 text-center text-white sm:min-h-[380px] sm:py-20">
        <h1 className="max-w-3xl text-2xl font-bold leading-tight text-white sm:text-4xl md:text-[2.75rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-sm text-white/85 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

/** Auto-rotating hero carousel (homepage) */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative isolate overflow-hidden">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}

      <div className="container-page flex min-h-[420px] flex-col items-center justify-center py-20 text-center text-white sm:min-h-[520px] sm:py-24">
        <div key={i} className="animate-fade-up">
          <h1 className="mx-auto max-w-4xl text-2xl font-bold leading-tight text-white sm:text-4xl md:text-[2.9rem]">
            {slides[i].title}{" "}
            {slides[i].highlight && (
              <span className="text-brand-yellow">{slides[i].highlight}</span>
            )}
          </h1>
          {slides[i].description && (
            <p className="mx-auto mt-6 max-w-2xl text-sm text-white/85 sm:text-base">
              {slides[i].description}
            </p>
          )}
          {slides[i].cta && (
            <Link href={slides[i].cta!.href} className="btn-yellow mt-8">
              {slides[i].cta!.label}
            </Link>
          )}
        </div>

        {/* dots — 44px hit area, small visual */}
        <div className="mt-8 flex">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Tampilkan slide ${idx + 1} dari ${slides.length}`}
              aria-current={idx === i}
              className="group flex h-11 w-8 touch-manipulation items-center justify-center"
            >
              <span
                className={`h-2 rounded-full transition-all ${
                  idx === i ? "w-6 bg-brand-yellow" : "w-2 bg-white/60 group-hover:bg-white"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
