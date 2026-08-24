import Image from "next/image";
import Link from "next/link";
import type { AlatPeragaView } from "@/lib/alatPeraga";
import type { Locale } from "@/lib/i18n";
import { JENJANG_LABELS, MAPEL_LABELS } from "@/lib/library";
import { alatPeragaPath } from "@/lib/routes";

export function AlatPeragaCard({
  item,
  locale = "id",
}: {
  item: AlatPeragaView;
  locale?: Locale;
}) {
  const href = alatPeragaPath(item.slug, locale);
  const detailLabel = locale === "en" ? "Detail" : "Detail";
  const tags = [...item.jenjang.map((j) => JENJANG_LABELS[j] ?? j), ...item.mapel.map((m) => MAPEL_LABELS[m] ?? m)];

  return (
    <article className="flex flex-col overflow-hidden rounded-card bg-white shadow-soft transition-shadow hover:shadow-card">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-surface">
        {item.cover && (
          <Image
            src={item.cover.url}
            alt={item.judul}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </Link>
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
        <h3 className="mt-2 line-clamp-2 text-base font-bold text-brand-navy">
          <Link href={href} className="hover:text-brand-red">
            {item.judul}
          </Link>
        </h3>
        {item.subjudul && <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">{item.subjudul}</p>}
        <Link href={href} className="btn-outline mt-4 self-start !py-2 !text-xs">
          {detailLabel}
        </Link>
      </div>
    </article>
  );
}
