import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { pojokGuruCariPath } from "@/lib/routes";
import { LibrarySearchBar } from "./LibrarySearchBar";

const text = {
  id: { populer: "Pencarian Populer", placeholder: "Cari materi, topik, kelas, atau kata kunci…" },
  en: { populer: "Popular Searches", placeholder: "Search materials, topics, grades, or keywords…" },
} satisfies Record<Locale, { populer: string; placeholder: string }>;

/**
 * Hero "Cari Kebutuhan Anda!" — blok `pencarianCepat`.
 *
 * Form dan tag populernya selalu menuju `/pojok-guru/cari`, halaman hasil
 * lintas 4 katalog Library. Tanpa JS: form GET biasa, tag = tautan biasa.
 */
export function PencarianCepat({
  judul,
  subjudul,
  gambar,
  placeholder,
  tagPopuler,
  locale,
  judulHalaman = false,
}: {
  judul: string;
  subjudul?: string;
  gambar?: string;
  placeholder?: string;
  tagPopuler: string[];
  locale: Locale;
  /** Blok pertama di halaman → judulnya jadi `<h1>`. */
  judulHalaman?: boolean;
}) {
  const t = text[locale];
  const Judul = judulHalaman ? "h1" : "h2";

  return (
    <section className="relative isolate overflow-hidden bg-brand-navy">
      {gambar && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={gambar}
            alt=""
            fill
            priority={judulHalaman}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      <div className="container-page flex min-h-[320px] flex-col items-center justify-center py-16 text-center sm:min-h-[400px] sm:py-20">
        <Judul className="max-w-3xl text-2xl font-bold leading-tight text-white sm:text-4xl">
          {judul}
        </Judul>
        {subjudul && (
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">{subjudul}</p>
        )}

        <div className="mt-8 flex w-full justify-center">
          <LibrarySearchBar
            action={pojokGuruCariPath(locale)}
            placeholder={placeholder || t.placeholder}
            locale={locale}
            variant="kotak"
            tombol="kuning"
            inputId="pencarian-cepat-q"
            className="max-w-2xl"
          />
        </div>

        {tagPopuler.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-white/80">{t.populer}:</span>
            {tagPopuler.map((tag) => (
              <Link
                key={tag}
                href={pojokGuruCariPath(locale, tag)}
                className="inline-flex min-h-[32px] items-center rounded-pill border border-white/30 bg-white/10 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-white/25"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
