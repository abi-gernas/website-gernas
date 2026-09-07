import Image from "next/image";
import type { MediaInteraktifView } from "@/lib/mediaInteraktif";
import type { Locale } from "@/lib/i18n";

/**
 * Kartu grid Media Digital Interaktif — sampul di atas, judul/deskripsi/tag,
 * lalu tombol "Buka Link" yang langsung membuka tautan eksternalnya di tab
 * baru (tidak ada halaman detail di situs ini).
 */
export function MediaInteraktifCard({
  item,
  locale = "id",
}: {
  item: MediaInteraktifView;
  locale?: Locale;
}) {
  const label = locale === "en" ? "Open Link" : "Buka Link";

  return (
    <article className="flex flex-col overflow-hidden rounded-card bg-white shadow-soft transition-shadow hover:shadow-card">
      <a
        href={item.tautan}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[4/3] overflow-hidden bg-surface"
      >
        {item.thumbnail && (
          <Image
            src={item.thumbnail.url}
            alt={item.judul}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </a>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-brand-navy">
          <a href={item.tautan} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red">
            {item.judul}
          </a>
        </h3>
        {item.deskripsi && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">{item.deskripsi}</p>
        )}

        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-brand-navy/5 px-2 py-0.5 text-xs font-semibold text-brand-navy"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <a
          href={item.tautan}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline mt-4 self-end !min-h-0 !px-4 !py-1.5 !text-xs"
        >
          {label}
        </a>
      </div>
    </article>
  );
}
