import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { JENJANG_LABELS, MAPEL_LABELS } from "@/lib/library";
import { formatHarga, formatLabelPendek, type ProdukView } from "@/lib/produk";
import { produkPath } from "@/lib/routes";

/**
 * Kartu katalog Buku, Bahan Ajar & Modul.
 *
 * Sampul dipasang `object-contain` (bukan `object-cover` seperti
 * `AlatPeragaCard`): isinya mockup buku tegak yang kalau dipangkas jadi
 * terpotong judulnya.
 */
export function ProdukCard({ item, locale = "id" }: { item: ProdukView; locale?: Locale }) {
  const href = produkPath(item.slug, locale);
  const t =
    locale === "en"
      ? { detail: "Details", gratis: "Free" }
      : { detail: "Detail", gratis: "Gratis" };
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
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-brand-navy">
          <Link href={href} className="hover:text-brand-red">
            {item.judul}
          </Link>
        </h3>
        {item.ringkasan && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">{item.ringkasan}</p>
        )}

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-brand-navy/5 px-2 py-0.5 text-xs font-semibold text-brand-navy"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-end justify-between gap-3 pt-1">
          <span className="text-sm font-bold text-brand-navy">
            {formatLabelPendek(item.format, locale)}
          </span>
          {item.status === "gratis" ? (
            <span className="text-sm font-bold text-emerald-600">{t.gratis}</span>
          ) : (
            item.harga != null && (
              <span className="text-sm font-bold text-brand-red">
                {formatHarga(item.harga, locale)}
              </span>
            )
          )}
        </div>

        <Link href={href} className="btn-outline mt-3 self-end !min-h-0 !px-4 !py-1.5 !text-xs">
          {t.detail}
        </Link>
      </div>
    </article>
  );
}
