import Image from "next/image";
import type { VideoPembelajaranView } from "@/lib/videoPembelajaran";
import { videoPembelajaranTontonHref } from "@/lib/videoPembelajaran";
import type { Locale } from "@/lib/i18n";
import { JENJANG_LABELS, MAPEL_LABELS } from "@/lib/library";

/**
 * Bukan `VideoCard` yang sudah ada (itu untuk koleksi `Video`/Bincang Gernas,
 * tujuan beda) — lihat catatan di `VideoPembelajaran.ts` & §2.3 rencana eksekusi.
 */
export function VideoPembelajaranCard({
  item,
  locale = "id",
}: {
  item: VideoPembelajaranView;
  locale?: Locale;
}) {
  const href = videoPembelajaranTontonHref(item);
  const tontonLabel = locale === "en" ? "Watch" : "Tonton";
  const tags = [...item.jenjang.map((j) => JENJANG_LABELS[j] ?? j), ...item.mapel.map((m) => MAPEL_LABELS[m] ?? m)];

  return (
    <article className="flex flex-col overflow-hidden rounded-card bg-white shadow-soft transition-shadow hover:shadow-card">
      <a
        href={href ?? undefined}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
        aria-disabled={!href}
        className="relative block aspect-video overflow-hidden bg-surface"
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
        <span className="absolute inset-0 flex items-center justify-center bg-brand-navy/20">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-red shadow-soft">
            ▶
          </span>
        </span>
        {item.durasi && (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white">
            {item.durasi}
          </span>
        )}
      </a>
      <div className="flex flex-1 flex-col p-5">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-pill bg-brand-navy/5 px-2.5 py-0.5 text-xs font-semibold text-brand-navy"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="mt-2 line-clamp-2 flex-1 text-base font-bold text-brand-navy">{item.judul}</h3>
        <a
          href={href ?? undefined}
          target={href ? "_blank" : undefined}
          rel={href ? "noopener noreferrer" : undefined}
          aria-disabled={!href}
          className="btn-outline mt-4 self-start !py-2 !text-xs"
        >
          {tontonLabel}
        </a>
      </div>
    </article>
  );
}
