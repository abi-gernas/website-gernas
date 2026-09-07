"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { VideoPembelajaranView } from "@/lib/videoPembelajaran";
import type { Locale } from "@/lib/i18n";
import { JENJANG_LABELS, MAPEL_LABELS } from "@/lib/library";
import { videoPembelajaranPath } from "@/lib/routes";

/**
 * Blok "Video Pilihan" di antara hero dan daftar "Semua Video".
 *
 * Sejak revisi mockup 7 Sep 2026 bentuknya **satu video sorotan per geseran**
 * (thumbnail besar di kiri, judul + tag + deskripsi + tombol "Tonton Video" di
 * kanan) — bukan lagi deretan 3 kartu kecil yang isinya sama persis dengan
 * grid "Semua Video" di bawahnya. Videonya diambil dari urutan terkecil
 * (`getVideoPembelajaranPilihan`), staf menentukan isinya lewat kolom Urutan.
 *
 * Digeser lewat `scrollBy` + scroll-snap, bukan transform berindeks seperti
 * `ProgramIntensifCarousel`: satu slide = satu lebar trek, jadi biarkan
 * browser yang menghitung posisinya dan sapuan jari di HP ikut jalan gratis.
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
    el.scrollBy({ left: arah * el.clientWidth, behavior: "smooth" });
  };

  const t =
    locale === "en"
      ? { kategori: "Learning", tonton: "Watch Video", sebelumnya: "Previous video", berikutnya: "Next video" }
      : { kategori: "Pembelajaran", tonton: "Tonton Video", sebelumnya: "Video sebelumnya", berikutnya: "Video berikutnya" };

  return (
    <div className="relative">
      <div
        ref={trek}
        onScroll={perbaruiPosisi}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const href = videoPembelajaranPath(item.slug, locale);
          const tags = [
            ...item.jenjang.map((j) => JENJANG_LABELS[j] ?? j),
            ...item.mapel.map((m) => MAPEL_LABELS[m] ?? m),
          ];

          return (
            <article
              key={item.id}
              className="grid w-full shrink-0 snap-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-10 lg:pr-16"
            >
              <Link
                href={href}
                className="group relative block aspect-video overflow-hidden rounded-card bg-surface"
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail.url}
                    alt={item.judul}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-brand-navy/10 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-soft">
                    <IkonPutar className="h-5 w-5 translate-x-[1px] text-brand-red" />
                  </span>
                </span>
                {item.durasi && (
                  <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                    {item.durasi}
                  </span>
                )}
              </Link>

              <div>
                <h3 className="text-xl font-bold leading-snug text-brand-navy sm:text-2xl">
                  <Link href={href} className="hover:text-brand-red">
                    {item.judul}
                  </Link>
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-pill bg-brand-blue/[0.08] px-3 py-1 text-xs font-semibold text-brand-blue">
                    {t.kategori}
                  </span>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-pill bg-surface px-3 py-1 text-xs font-semibold text-body"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {item.deskripsi && (
                  <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-body">
                    {item.deskripsi}
                  </p>
                )}

                <Link href={href} className="btn-navy mt-6 rounded-xl">
                  <IkonPutar className="h-4 w-4" />
                  {t.tonton}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {items.length > 1 && (
        <>
          <TombolGeser
            arah="kiri"
            label={t.sebelumnya}
            tersembunyi={posisi.diAwal}
            onClick={() => geser(-1)}
          />
          <TombolGeser
            arah="kanan"
            label={t.berikutnya}
            tersembunyi={posisi.diAkhir}
            onClick={() => geser(1)}
          />
        </>
      )}
    </div>
  );
}

function IkonPutar({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 14" fill="currentColor" className={className}>
      <path d="M11.5 6.13a1 1 0 0 1 0 1.74l-9.5 5.5A1 1 0 0 1 .5 12.5v-11A1 1 0 0 1 2 .63l9.5 5.5Z" />
    </svg>
  );
}

/**
 * Tombol panah bulat di tepi blok. Disembunyikan lewat `invisible` (bukan
 * dilepas dari DOM) supaya lebar trek tidak ikut bergeser saat mencapai ujung.
 */
function TombolGeser({
  arah,
  label,
  tersembunyi,
  onClick,
}: {
  arah: "kiri" | "kanan";
  label: string;
  tersembunyi: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-[28%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-brand-navy shadow-soft transition-colors hover:bg-brand-navy hover:text-white sm:flex lg:top-1/2 ${
        arah === "kiri" ? "-left-3 lg:-left-5" : "-right-3 lg:-right-5"
      } ${tersembunyi ? "invisible" : ""}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d={arah === "kiri" ? "m14.5 5-7 7 7 7" : "m9.5 5 7 7-7 7"} />
      </svg>
    </button>
  );
}
