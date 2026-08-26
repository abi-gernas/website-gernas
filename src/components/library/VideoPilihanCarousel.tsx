"use client";

import { useRef, useState } from "react";
import type { VideoPembelajaranView } from "@/lib/videoPembelajaran";
import type { Locale } from "@/lib/i18n";
import { VideoPembelajaranCard } from "./VideoPembelajaranCard";

/**
 * Deretan "Video Pilihan" yang bisa digeser mendatar — bagian di antara hero
 * dan daftar "Semua Video" pada mockup Figma halaman ini (di mockup hanya
 * terlihat tombol panah di tepi kanan; kartunya kosong karena gambarnya tidak
 * ikut ter-render).
 *
 * Digeser lewat `scrollBy` + scroll-snap, bukan transform berindeks seperti
 * `ProgramIntensifCarousel`, karena jumlah kartu yang muat per layar di sini
 * berubah menurut lebar (1 → 2 → 3) dan biarkan browser yang menghitungnya.
 */
export function VideoPilihanCarousel({
  items,
  locale = "id",
}: {
  items: VideoPembelajaranView[];
  locale?: Locale;
}) {
  const trek = useRef<HTMLDivElement>(null);
  const [posisi, setPosisi] = useState({ diAwal: true, diAkhir: false });

  if (items.length === 0) return null;

  const perbaruiPosisi = () => {
    const el = trek.current;
    if (!el) return;
    setPosisi({
      diAwal: el.scrollLeft <= 8,
      diAkhir: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  };

  const geser = (arah: 1 | -1) => {
    const el = trek.current;
    if (!el) return;
    el.scrollBy({ left: arah * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const labelSebelumnya = locale === "en" ? "Previous videos" : "Video sebelumnya";
  const labelBerikutnya = locale === "en" ? "Next videos" : "Video berikutnya";

  return (
    <div className="relative">
      <div
        ref={trek}
        onScroll={perbaruiPosisi}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <VideoPembelajaranCard item={item} locale={locale} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => geser(-1)}
        aria-label={labelSebelumnya}
        className={`absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-brand-navy shadow-soft transition-colors hover:bg-brand-navy hover:text-white lg:flex ${
          posisi.diAwal ? "invisible" : ""
        }`}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => geser(1)}
        aria-label={labelBerikutnya}
        className={`absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-brand-navy shadow-soft transition-colors hover:bg-brand-navy hover:text-white lg:flex ${
          posisi.diAkhir ? "invisible" : ""
        }`}
      >
        ›
      </button>
    </div>
  );
}
