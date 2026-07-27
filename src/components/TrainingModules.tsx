import Link from "next/link";
import { TrainingModuleCard, type ModulTampil } from "./TrainingModuleCard";
import { giliranTone } from "./warna";

/**
 * Dua tampilan modul pelatihan yang dipakai halaman Belajar Bersama.
 *
 * "Ringkas" — kartu berwarna berisi nomor + nama modul, dengan kotak
 * pengantar opsional di kolom kiri.
 * "Rincian" — kartu yang bisa dibuka untuk melihat tujuan pembelajaran.
 *
 * Warna kartu bergilir merah–biru–kuning mengikuti posisi, bukan pilihan staf,
 * supaya pola warnanya tidak bisa rusak saat modul ditambah atau diurutkan
 * ulang.
 */
const GILIRAN_WARNA = [
  "bg-brand-red text-white",
  "bg-brand-navy text-white",
  "bg-brand-yellow text-brand-navy",
] as const;

function KartuRingkas({ modul, i }: { modul: ModulTampil; i: number }) {
  const warna = giliranTone(GILIRAN_WARNA, i);
  const judulTerang = warna.includes("yellow") ? "text-brand-navy" : "text-white";

  return (
    <div className={`flex flex-col rounded-card p-6 ${warna}`}>
      <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
        Pelatihan {modul.nomor}
      </span>
      <h3 className={`mt-1 text-lg font-bold ${judulTerang}`}>{modul.judul}</h3>
    </div>
  );
}

export function TrainingModules({
  modul,
  tampilan,
  sidebar,
}: {
  modul: ModulTampil[];
  tampilan: "topik" | "rincian";
  sidebar?: {
    teks?: string;
    ajakan?: string;
    cta?: { label: string; href: string };
  };
}) {
  if (modul.length === 0) {
    return (
      <p className="text-center text-sm text-muted">
        Modul pelatihan akan segera diperbarui.
      </p>
    );
  }

  if (tampilan === "rincian") {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modul.map((m, i) => (
          <TrainingModuleCard key={`${m.nomor}-${i}`} modul={m} />
        ))}
      </div>
    );
  }

  const grid = (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {modul.map((m, i) => (
        <KartuRingkas key={`${m.nomor}-${i}`} modul={m} i={i} />
      ))}
    </div>
  );

  const adaSidebar = Boolean(sidebar?.teks || sidebar?.cta);
  if (!adaSidebar) return grid;

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_2fr]">
      <div className="rounded-card bg-white p-7 shadow-soft">
        {sidebar?.teks && (
          <p className="text-sm font-semibold leading-relaxed text-brand-red">
            {sidebar.teks}
          </p>
        )}
        {sidebar?.ajakan && (
          <p className="mt-6 text-sm font-medium text-brand-navy">
            {sidebar.ajakan}
          </p>
        )}
        {sidebar?.cta && (
          <Link href={sidebar.cta.href} className="btn-yellow mt-3">
            {sidebar.cta.label}
          </Link>
        )}
      </div>
      {grid}
    </div>
  );
}
