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
      className="rounded-card bg-surface p-6 text-left"
    >
      <span className="flex items-center justify-between gap-3 text-base font-bold text-brand-navy">
        <span>
          Modul {modul.nomor}: {modul.judul}
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-brand-red transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </span>
      {open && modul.tujuan.length > 0 && (
        <ol className="mt-3 space-y-2 text-sm text-body">
          {modul.tujuan.map((p, i) => (
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
