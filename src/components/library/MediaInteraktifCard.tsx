import Image from "next/image";
import type { MediaInteraktifView } from "@/lib/mediaInteraktif";
import type { Locale } from "@/lib/i18n";

/**
 * List horizontal per baris (bukan grid) — sesuai mockup Media Digital
 * Interaktif, lihat §2.3 rencana eksekusi.
 */
export function MediaInteraktifCard({
  item,
  locale = "id",
}: {
  item: MediaInteraktifView;
  locale?: Locale;
}) {
  const buttonLabel = locale === "en" ? "Open Link" : "Buka Link";

  return (
    <article className="flex flex-col gap-4 rounded-card bg-white p-5 shadow-soft sm:flex-row sm:items-center">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-surface sm:w-48">
        {item.thumbnail && (
          <Image
            src={item.thumbnail.url}
            alt={item.judul}
            fill
            sizes="(min-width: 640px) 192px, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-pill bg-brand-navy/5 px-2.5 py-0.5 text-xs font-semibold text-brand-navy"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-base font-bold text-brand-navy">{item.judul}</h3>
        {item.deskripsi && <p className="line-clamp-2 text-sm text-muted">{item.deskripsi}</p>}
      </div>
      <a
        href={item.tautan}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline shrink-0 self-start sm:self-center"
      >
        {buttonLabel}
      </a>
    </article>
  );
}
