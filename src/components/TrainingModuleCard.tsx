"use client";

import { useState } from "react";

/**
 * Satu modul pelatihan, sudah diratakan dari koleksi Modul Pelatihan.
 *
 * Tipe ini didefinisikan di sini alih-alih diimpor dari `payload-types` karena
 * komponennya hanya butuh tiga nilai — mengikatnya ke bentuk dokumen Payload
 * akan memaksa perubahan di sini setiap kali ada field baru di dasbor.
 *
 * Nama berkas sengaja beda dari `ModuleCard.tsx` (versi lama, dipakai halaman
 * Belajar Bersama yang masih membaca `src/data/training.ts`) supaya kedua
 * komponen tidak saling menimpa selagi migrasi halaman itu belum berjalan —
 * lihat catatan Tahap E di project_status_todo.
 */
export type ModulTampil = {
  nomor: number;
  judul: string;
  tujuan: string[];
};

/** Kartu rincian modul yang bisa dibuka-tutup — dipakai blok "Modul Pelatihan". */
export function TrainingModuleCard({ modul }: { modul: ModulTampil }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className="rounded-card bg-surface p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2"
    >
      <span className="flex items-start justify-between gap-3 text-base font-bold text-brand-navy">
        <span>
          Modul {modul.nomor}: {modul.judul}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-5 w-5 shrink-0 text-brand-red transition-transform duration-300 ease-out motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="M5 7.5 10 12.5 15 7.5" />
        </svg>
      </span>
      {modul.tujuan.length > 0 && (
        <span
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <span className="min-h-0">
            <ol className="mt-3 space-y-2 text-sm text-body">
              {modul.tujuan.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-semibold text-brand-red">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </span>
        </span>
      )}
    </button>
  );
}
