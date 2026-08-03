"use client";

import Image from "next/image";
import { useState } from "react";
import { asWarna, warnaIsi, warnaJudul, warnaKotak } from "./warna";

export type ProgramIntensifItem = {
  gambar?: string;
  judul: string;
  deskripsi: string;
  warna?: string | null;
  kolaborator: string[];
};

/**
 * Kartu program yang digeser satu-per-satu — dipakai bagian "Program
 * Intensif" di halaman Belajar Bersama.
 *
 * Pola tata letak (foto di kiri, kotak berwarna di kanan, panah di kedua
 * ujung) sengaja disamakan dengan `TestimonialCarousel` supaya perilaku geser
 * di ponsel/desktop konsisten satu situs, bukan dua carousel dengan aturan
 * berbeda.
 */
export function ProgramIntensifCarousel({ items }: { items: ProgramIntensifItem[] }) {
  const [i, setI] = useState(0);
  if (items.length === 0) return null;

  const it = items[i];
  const warna = asWarna(it.warna);
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);

  return (
    <>
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          onClick={() => go(-1)}
          aria-label="Program sebelumnya"
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 text-brand-navy transition-colors hover:bg-brand-navy hover:text-white sm:inline-flex"
        >
          ‹
        </button>

        <div className="grid flex-1 items-stretch gap-5 md:grid-cols-[minmax(0,320px)_1fr]">
          <div className="relative min-h-[240px] overflow-hidden rounded-card bg-surface">
            {it.gambar ? (
              <Image src={it.gambar} alt={it.judul} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl text-brand-navy/20">
                &#9679;
              </div>
            )}
          </div>

          <div
            className={`flex flex-col justify-center rounded-card p-7 sm:p-9 ${warnaKotak[warna]}`}
          >
            <h3 className={`text-lg font-bold sm:text-xl ${warnaJudul[warna]}`}>{it.judul}</h3>
            <p className={`mt-3 text-sm leading-relaxed sm:text-base ${warnaIsi[warna]}`}>
              {it.deskripsi}
            </p>

            <div className="mt-6">
              <p className={`text-xs font-semibold uppercase tracking-wide ${warnaJudul[warna]}`}>
                Kolaborator:
              </p>
              <div className="mt-2 min-h-[3rem] rounded-lg bg-white p-2">
                {it.kolaborator.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    {it.kolaborator.map((logo, idx) => (
                      <div key={idx} className="relative h-8 w-16">
                        <Image src={logo} alt="" fill className="object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Program berikutnya"
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 text-brand-navy transition-colors hover:bg-brand-navy hover:text-white sm:inline-flex"
        >
          ›
        </button>
      </div>

      {/* Kontrol di ponsel: panah + titik */}
      <div className="mt-5 flex items-center justify-center gap-4 sm:hidden">
        <button
          onClick={() => go(-1)}
          aria-label="Program sebelumnya"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-brand-navy"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Program ${idx + 1} dari ${items.length}`}
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
          aria-label="Program berikutnya"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-brand-navy"
        >
          ›
        </button>
      </div>
    </>
  );
}
