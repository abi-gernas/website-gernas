"use client";

import { useId } from "react";
import type { ModulTampil } from "./TrainingModuleCard";
import { uiText, type Locale } from "@/lib/i18n";

/**
 * Kartu topik pelatihan yang bisa dibuka-tutup.
 *
 * Bawaannya tertutup — yang terlihat hanya kartu berwarna berisi nomor dan nama
 * pelatihan. Saat diklik, rincian tujuan pembelajaran muncul di bawah kartunya
 * sebagai grid-item terpisah yang melebar penuh satu baris (`col-span-full`),
 * bukan menyatu di kolom yang sama — supaya saat dibuka, hanya baris kartu itu
 * yang terdorong turun, tidak membuat kolom tetangga jadi renggang. State buka
 * dikontrol dari luar (lihat TrainingTopicGrid) supaya hanya satu kartu yang
 * bisa terbuka dalam satu waktu (accordion).
 *
 * Kartu tanpa tujuan pembelajaran sengaja dirender sebagai kotak biasa, bukan
 * tombol: memberi tanda "bisa diklik" pada sesuatu yang tidak punya isi hanya
 * membuat pengunjung menekan kartu yang tidak merespons.
 */
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
      className={`h-5 w-5 shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        terbuka ? "rotate-180" : ""
      }`}
    >
      <path d="M5 7.5 10 12.5 15 7.5" />
    </svg>
  );
}

export function TrainingTopicCard({
  modul,
  warna,
  locale,
  terbuka,
  onToggle,
}: {
  modul: ModulTampil;
  /** Kelas latar + warna teks, bergilir merah–biru–kuning menurut posisi. */
  warna: string;
  locale: Locale;
  terbuka: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  const adaRincian = modul.tujuan.length > 0;
  const judulTerang = warna.includes("yellow") ? "text-brand-navy" : "text-white";

  const isiKartu = (
    <>
      <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {uiText[locale].training} {modul.nomor}
      </span>
      <span className={`mt-1 flex items-start justify-between gap-3 ${judulTerang}`}>
        <span className="text-lg font-bold">{modul.judul}</span>
        {adaRincian && <ChevronBawah terbuka={terbuka} />}
      </span>
    </>
  );

  return (
    <>
      {adaRincian ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={terbuka}
          aria-controls={terbuka ? panelId : undefined}
          className={`flex min-h-36 flex-col rounded-card p-6 text-left transition-shadow duration-200 ease-out hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2 motion-reduce:transition-none ${warna}`}
        >
          {isiKartu}
        </button>
      ) : (
        <div className={`flex min-h-36 flex-col rounded-card p-6 ${warna}`}>{isiKartu}</div>
      )}

      {adaRincian && terbuka && (
        <div id={panelId} className="panel-rincian col-span-full">
          <div className="mt-3 rounded-card bg-surface p-5">
            <p className="text-sm font-bold text-brand-navy">
              {uiText[locale].module} {modul.nomor}: {modul.judul}
            </p>
            <ol className="mt-3 space-y-2 text-sm text-body">
              {modul.tujuan.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-semibold text-brand-red">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
