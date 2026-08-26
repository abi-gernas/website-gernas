import Image from "next/image";
import Link from "next/link";
import type { AlatPeragaView } from "@/lib/alatPeraga";
import type { Locale } from "@/lib/i18n";
import { JENJANG_LABELS, MAPEL_LABELS } from "@/lib/library";
import { alatPeragaPath } from "@/lib/routes";

/**
 * Kartu Alat Peraga. Susunannya mengikuti mockup Figma: gambar, judul,
 * subjudul, lalu tag jenjang/mapel, dan tombol "Detail" rata kanan di dasar
 * kartu (sebelumnya tag ditaruh di atas judul & tombol rata kiri).
 */
export function AlatPeragaCard({
  item,
  locale = "id",
}: {
  item: AlatPeragaView;
  locale?: Locale;
}) {
  const href = alatPeragaPath(item.slug, locale);
  const detailLabel = "Detail";
  const tags = [
    ...item.jenjang.map((j) => JENJANG_LABELS[j] ?? j),
    ...item.mapel.map((m) => MAPEL_LABELS[m] ?? m),
  ];

  return (
    <article className="flex flex-col overflow-hidden rounded-card bg-white shadow-soft transition-shadow hover:shadow-card">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-surface">
        {item.cover && (
          <Image
            src={item.cover.url}
            alt={item.judul}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-bold text-brand-navy">
          <Link href={href} className="hover:text-brand-red">
            {item.judul}
          </Link>
        </h3>
        {item.subjudul && (
          <p className="mt-0.5 line-clamp-2 text-base text-brand-navy">{item.subjudul}</p>
        )}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
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

        <div className="mt-4 flex flex-1 items-end justify-end">
          <Link
            href={href}
            className="rounded-pill bg-brand-navy/[0.06] px-4 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
          >
            {detailLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
