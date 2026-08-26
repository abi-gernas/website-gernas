import Image from "next/image";
import Link from "next/link";
import type { VideoPembelajaranView } from "@/lib/videoPembelajaran";
import type { Locale } from "@/lib/i18n";
import { JENJANG_LABELS, MAPEL_LABELS } from "@/lib/library";
import { videoPembelajaranPath } from "@/lib/routes";

/**
 * Kartu Video Pembelajaran — bukan `VideoCard` yang sudah ada (itu untuk
 * koleksi `Video`/Bincang Gernas, tujuan beda), lihat catatan di
 * `VideoPembelajaran.ts` & §2.3 rencana eksekusi.
 *
 * Susunannya mengikuti mockup Figma: thumbnail bersudut membulat di dalam
 * kartu, lalu tag jenjang/mapel, lalu judul — tanpa tombol "Tonton" terpisah,
 * seluruh kartu adalah tautan ke halaman detail (tempat videonya diputar).
 */
export function VideoPembelajaranCard({
  item,
  locale = "id",
}: {
  item: VideoPembelajaranView;
  locale?: Locale;
}) {
  const href = videoPembelajaranPath(item.slug, locale);
  const tags = [
    ...item.jenjang.map((j) => JENJANG_LABELS[j] ?? j),
    ...item.mapel.map((m) => MAPEL_LABELS[m] ?? m),
  ];

  return (
    <article className="group flex flex-col rounded-card bg-white p-3 shadow-soft transition-shadow hover:shadow-card">
      <Link href={href} className="relative block aspect-video overflow-hidden rounded-xl bg-surface">
        {item.thumbnail && (
          <Image
            src={item.thumbnail.url}
            alt={item.judul}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-brand-navy/10 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-red shadow-soft">
            ▶
          </span>
        </span>
        {item.durasi && (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white">
            {item.durasi}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-pill bg-brand-blue/[0.08] px-3 py-1 text-xs font-semibold text-brand-blue"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-brand-navy">
          <Link href={href} className="hover:text-brand-red">
            {item.judul}
          </Link>
        </h3>
      </div>
    </article>
  );
}
