import type { Locale } from "@/lib/i18n";
import { FORMAT_LABELS, type FormatProduk } from "@/lib/produk";

const SEMUA_FORMAT = ["pdf", "cetak"] as const satisfies readonly FormatProduk[];

const tidakTersedia = { id: "tidak tersedia", en: "not available" } satisfies Record<Locale, string>;

/**
 * Daftar centang format produk (PDF / versi cetak). Format yang tidak
 * tersedia tetap tampil tapi diredupkan — keterangannya ikut dibacakan
 * pembaca layar, karena redup saja tidak terbaca tanpa melihat warnanya.
 *
 * Dipakai "Produk Terbaru" di katalog dan blok Produk Sorotan di Pojok Guru.
 */
export function DaftarFormat({
  format,
  locale,
  className = "",
}: {
  format: FormatProduk[];
  locale: Locale;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 ${className}`.trim()}>
      {SEMUA_FORMAT.map((f) => {
        const tersedia = format.includes(f);
        return (
          <li
            key={f}
            className={`flex items-center gap-2 text-sm ${tersedia ? "text-brand-navy" : "text-muted/60"}`}
          >
            <span
              aria-hidden="true"
              className={`flex h-4 w-4 items-center justify-center rounded-[4px] ${
                tersedia ? "bg-brand-navy text-white" : "bg-brand-navy/15"
              }`}
            >
              {tersedia && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-2.5 w-2.5"
                >
                  <path d="m5 12 5 5L19 7" />
                </svg>
              )}
            </span>
            {FORMAT_LABELS[f][locale]}
            {!tersedia && <span className="sr-only"> ({tidakTersedia[locale]})</span>}
          </li>
        );
      })}
    </ul>
  );
}
