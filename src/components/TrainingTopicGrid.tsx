"use client";

import { useState } from "react";
import { TrainingTopicCard } from "./TrainingTopicCard";
import type { ModulTampil } from "./TrainingModuleCard";
import { giliranTone } from "./warna";
import type { Locale } from "@/lib/i18n";

/**
 * Warna kartu bergilir merah–biru–kuning mengikuti posisi, bukan pilihan staf,
 * supaya pola warnanya tidak bisa rusak saat modul ditambah atau diurutkan
 * ulang.
 */
const GILIRAN_WARNA = [
  "bg-brand-red text-white",
  "bg-brand-navy text-white",
  "bg-brand-yellow text-brand-navy",
] as const;

/**
 * Grid kartu "Topik Pelatihan", dengan hanya satu kartu yang boleh terbuka
 * dalam satu waktu (accordion). `grid-flow-row-dense` dipakai supaya saat
 * panel detail (col-span-full di TrainingTopicCard) memaksa baris baru,
 * kartu-kartu berikutnya tetap mengisi slot kosong di baris sebelumnya alih-
 * alih menyisakan bolong — jadi grid tetap padat di breakpoint manapun.
 */
export function TrainingTopicGrid({
  modul,
  locale,
}: {
  modul: ModulTampil[];
  locale: Locale;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-flow-row-dense items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {modul.map((m, i) => (
        <TrainingTopicCard
          key={`${m.nomor}-${i}`}
          modul={m}
          warna={giliranTone(GILIRAN_WARNA, i)}
          locale={locale}
          terbuka={openIndex === i}
          onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
        />
      ))}
    </div>
  );
}
