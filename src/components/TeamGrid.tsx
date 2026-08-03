"use client";

import Image from "next/image";
import { useState } from "react";
import { DEFAULT_LOCALE, uiText, type Locale } from "@/lib/i18n";

/** Satu penggerak, sudah diratakan dari dokumen Payload. */
export type AnggotaTim = {
  nama: string;
  foto?: string;
  peran: string[];
};

/**
 * Grid foto penggerak. Anggota tanpa foto tetap tampil dengan kotak kosong —
 * lebih baik daripada menghilangkan orangnya dari daftar hanya karena
 * fotonya belum diunggah.
 *
 * Daftar dilipat ke `batasAwal` orang pertama supaya grid tidak kepanjangan
 * seiring jumlah penggerak terus bertambah — sisanya muncul lewat tombol
 * "Lihat Semua".
 */
export function TeamGrid({
  anggota,
  locale = DEFAULT_LOCALE,
  batasAwal,
}: {
  anggota: AnggotaTim[];
  locale?: Locale;
  batasAwal?: number;
}) {
  const [terbuka, setTerbuka] = useState(false);

  if (anggota.length === 0) {
    return (
      <p className="text-center text-sm text-muted">{uiText[locale].teamEmpty}</p>
    );
  }

  const batas = batasAwal && batasAwal > 0 ? batasAwal : anggota.length;
  const tampil = terbuka ? anggota : anggota.slice(0, batas);
  const sisa = anggota.length - batas;
  const t = uiText[locale];

  return (
    <div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {tampil.map((m, i) => (
          <div key={`${m.nama}-${i}`} className="text-center">
            <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-card bg-surface">
              {m.foto && (
                <Image
                  src={m.foto}
                  alt={m.nama}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
            <h4 className="mt-3 text-sm font-bold text-brand-navy">{m.nama}</h4>
            {m.peran.length > 0 && (
              <p className="mt-1 text-xs leading-snug text-muted">
                {m.peran.join(" · ")}
              </p>
            )}
          </div>
        ))}
      </div>

      {sisa > 0 && (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={() => setTerbuka((v) => !v)} className="btn-outline">
            {terbuka ? t.teamShowLess : `${t.teamShowMore} (+${sisa})`}
          </button>
        </div>
      )}
    </div>
  );
}
