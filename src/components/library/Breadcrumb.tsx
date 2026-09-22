import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { pojokGuruPath } from "@/lib/routes";

/** Satu langkah jejak halaman. Tanpa `href` = halaman yang sedang dibuka. */
export type Remah = { label: string; href?: string };

/**
 * Nama keempat katalog Library, dipakai breadcrumb halaman daftar maupun
 * detail supaya penyebutannya sama persis dengan judul halaman katalognya.
 */
export const labelKatalogGuru = {
  produk: { id: "Buku, Bahan Ajar & Modul", en: "Books, Teaching Materials & Modules" },
  videoPembelajaran: { id: "Video Pembelajaran", en: "Learning Videos" },
  mediaInteraktif: { id: "Media Digital Interaktif", en: "Interactive Digital Media" },
} satisfies Record<string, Record<Locale, string>>;

const text = {
  id: { akar: "Pojok Guru", label: "Lokasi halaman" },
  en: { akar: "Teacher's Corner", label: "Breadcrumb" },
} satisfies Record<Locale, { akar: string; label: string }>;

/**
 * Jejak "Pojok Guru › Katalog › Judul" di halaman Library.
 *
 * URL katalog sengaja tetap datar (`/video-pembelajaran`, bukan
 * `/pojok-guru/video-pembelajaran`) — hubungan ke Pojok Guru cukup ditunjukkan di
 * sini dan di menu, lihat §4.5 `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md`.
 */
export function Breadcrumb({
  items,
  locale,
  className = "",
}: {
  items: Remah[];
  locale: Locale;
  className?: string;
}) {
  const t = text[locale];
  const semua: Remah[] = [{ label: t.akar, href: pojokGuruPath(locale) }, ...items];

  return (
    <nav aria-label={t.label} className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {semua.map((remah, i) => {
          const terakhir = i === semua.length - 1;
          return (
            <li key={i} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && (
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-muted"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.17 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {remah.href && !terakhir ? (
                <Link
                  href={remah.href}
                  className="py-1 font-semibold text-brand-navy/80 underline-offset-4 transition-colors hover:text-brand-red hover:underline"
                >
                  {remah.label}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  title={remah.label}
                  className="max-w-[14rem] truncate py-1 text-muted sm:max-w-md"
                >
                  {remah.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
