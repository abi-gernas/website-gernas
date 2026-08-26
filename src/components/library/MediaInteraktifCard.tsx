import Image from "next/image";
import type { MediaInteraktifView } from "@/lib/mediaInteraktif";
import type { Locale } from "@/lib/i18n";

/**
 * Satu baris daftar Media Digital Interaktif (bukan kartu grid): thumbnail di
 * kiri, judul/deskripsi/tag di tengah, panel "Buka Link" di kanan. Pemisah
 * antar baris berupa garis tipis diatur induknya (`divide-y`), sesuai mockup.
 */

/** Buang skema & `www.` supaya alamat panjang tetap terbaca di panel sempit. */
function tautanRingkas(tautan: string): string {
  return tautan.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
}

export function MediaInteraktifCard({
  item,
  locale = "id",
}: {
  item: MediaInteraktifView;
  locale?: Locale;
}) {
  const buttonLabel = locale === "en" ? "Open Link" : "Buka Link";

  return (
    <article className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center">
      <div className="relative aspect-[5/3] w-full shrink-0 overflow-hidden rounded-xl bg-surface sm:w-[190px]">
        {item.thumbnail && (
          <Image
            src={item.thumbnail.url}
            alt={item.judul}
            fill
            sizes="(min-width: 640px) 190px, 100vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="text-base font-bold leading-snug text-brand-navy sm:text-lg">
          {item.judul}
        </h3>
        {item.deskripsi && (
          <p className="line-clamp-2 text-sm leading-relaxed text-body">{item.deskripsi}</p>
        )}
        {item.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-pill bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <a
        href={item.tautan}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-full shrink-0 items-center gap-3 rounded-xl bg-surface px-4 py-3 transition-colors hover:bg-brand-navy/5 sm:w-[240px]"
      >
        <span className="min-w-0 flex-1 text-center">
          <span className="block text-sm font-semibold text-brand-navy">{buttonLabel}</span>
          <span className="mt-0.5 block truncate text-xs text-muted">
            {tautanRingkas(item.tautan)}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-navy/20 bg-white text-brand-navy transition-colors group-hover:border-brand-navy group-hover:bg-brand-navy group-hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </span>
      </a>
    </article>
  );
}
