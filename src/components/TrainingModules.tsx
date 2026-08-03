import Link from "next/link";
import { TrainingModuleCard, type ModulTampil } from "./TrainingModuleCard";
import { TrainingTopicGrid } from "./TrainingTopicGrid";
import { DEFAULT_LOCALE, uiText, type Locale } from "@/lib/i18n";

/**
 * Dua tampilan modul pelatihan yang dipakai halaman Belajar Bersama.
 *
 * "Ringkas" — kartu berwarna berisi nomor + nama modul, dengan kotak
 * pengantar opsional di kolom kiri. Kartunya tertutup secara bawaan dan bisa
 * diklik untuk memunculkan tujuan pembelajaran di bawahnya, jadi bagian ini
 * sudah memuat rincian modul tanpa perlu blok "Rincian" terpisah.
 * "Rincian" — kartu yang bisa dibuka untuk melihat tujuan pembelajaran.
 */
export function TrainingModules({
  modul,
  tampilan,
  locale = DEFAULT_LOCALE,
  sidebar,
}: {
  modul: ModulTampil[];
  tampilan: "topik" | "rincian";
  locale?: Locale;
  sidebar?: {
    teks?: string;
    ajakan?: string;
    cta?: { label: string; href: string };
  };
}) {
  if (modul.length === 0) {
    return (
      <p className="text-center text-sm text-muted">{uiText[locale].modulesEmpty}</p>
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

  const grid = <TrainingTopicGrid modul={modul} locale={locale} />;

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
