"use client";

import { useId, useState } from "react";
import { Ikon, type NamaIkon } from "./ikon";
import { kolomKe } from "./warna";

/**
 * Kartu jenis kegiatan yang bisa dibuka-tutup — bagian "Kegiatan Gernas".
 *
 * Memakai pola tata letak yang sama dengan Topik Pelatihan
 * (`TrainingTopicGrid`): hanya satu kartu yang boleh terbuka dalam satu waktu,
 * dan panel rinciannya dirender sebagai grid-item terpisah selebar satu baris
 * penuh (`col-span-full`). Tanpa itu, kartu yang dibuka hanya memanjangkan satu
 * kolom sehingga kolom tetangganya menyisakan ruang kosong besar — persis
 * masalah yang diperbaiki di section Topik Pelatihan.
 *
 * `grid-flow-row-dense` melengkapinya: saat panel full-width memaksa baris
 * baru, kartu berikutnya tetap mengisi slot kosong di baris sebelumnya, jadi
 * gridnya tidak berlubang di breakpoint manapun.
 */
export type KartuKegiatan = {
  judul: string;
  deskripsi: string;
  ikon: NamaIkon;
};

function ChevronBawah({ terbuka }: { terbuka: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        terbuka ? "rotate-180" : ""
      }`}
    >
      <path d="M5 7.5 10 12.5 15 7.5" />
    </svg>
  );
}

function Kartu({
  kartu,
  terbuka,
  onToggle,
}: {
  kartu: KartuKegiatan;
  terbuka: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={terbuka}
        aria-controls={terbuka ? panelId : undefined}
        className="flex min-h-28 flex-col items-center justify-center gap-1.5 rounded-card bg-brand-navy p-4 text-center text-white transition-shadow duration-200 ease-out hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        <Ikon nama={kartu.ikon} className="h-6 w-6 text-brand-yellow" />
        <span className="text-sm font-bold leading-tight">{kartu.judul}</span>
        <ChevronBawah terbuka={terbuka} />
      </button>

      {terbuka && (
        <div id={panelId} className="panel-rincian col-span-full">
          <div className="rounded-card bg-brand-navy p-6">
            <p className="flex items-center gap-2 text-base font-bold text-brand-yellow">
              <Ikon nama={kartu.ikon} className="h-5 w-5" />
              {kartu.judul}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85">
              {kartu.deskripsi}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export function ActivityCards({
  kartu,
  kolom = "4",
}: {
  kartu: KartuKegiatan[];
  kolom?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (kartu.length === 0) return null;

  return (
    <div className={`grid grid-flow-row-dense items-start gap-4 ${kolomKe(kolom, "4")}`}>
      {kartu.map((k, i) => (
        <Kartu
          key={i}
          kartu={k}
          terbuka={openIndex === i}
          onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
        />
      ))}
    </div>
  );
}
