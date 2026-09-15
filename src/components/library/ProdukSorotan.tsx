import Image from "next/image";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import type { ProdukView } from "@/lib/produk";
import { produkPath } from "@/lib/routes";
import { DaftarFormat } from "./DaftarFormat";

const text = {
  id: { heading: "Produk Terbaru", detail: "Detail Produk", beli: "Beli Sekarang!", unduh: "Unduh Gratis" },
  en: { heading: "Latest Product", detail: "Product Details", beli: "Buy Now!", unduh: "Download Free" },
} satisfies Record<Locale, { heading: string; detail: string; beli: string; unduh: string }>;

/**
 * Blok `produkSorotan` — kartu satu produk Buku/Bahan Ajar/Modul plus panel
 * alasan umum ("Mengapa Guru Memilih Perangkat Gernas?") di sampingnya.
 *
 * Tombol mengikuti "Produk Terbaru" di katalog (`ProdukTerbaru.tsx`): produk
 * berbayar → "Beli Sekarang!" ke halaman Mitra (checkout masih OI-105),
 * produk gratis → "Unduh Gratis" ke halaman detail, tempat gerbang pendataan
 * FR-104 berada.
 */
export function ProdukSorotan({
  judulBagian,
  subjudul,
  item,
  alasan,
  locale,
}: {
  judulBagian?: string;
  subjudul?: string;
  item: ProdukView;
  alasan?: { judul?: string; poin: string[] };
  locale: Locale;
}) {
  const t = text[locale];
  const href = produkPath(item.slug, locale);

  return (
    <section className="container-page py-12 sm:py-16">
      <div
        className={`grid gap-6 lg:items-center ${
          alasan ? "lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-8" : ""
        }`}
      >
        <div className="rounded-card bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-base font-bold text-brand-navy sm:text-lg">{judulBagian || t.heading}</h2>

          <div className="mt-5 grid gap-6 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center sm:gap-8">
            <div className="relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-none">
              {item.cover && (
                <Image
                  src={item.cover.url}
                  alt={item.judul}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 260px"
                  className="object-contain"
                />
              )}
            </div>

            <div>
              <h3 className="break-words text-2xl font-bold uppercase leading-tight text-brand-navy [text-wrap:balance] sm:text-3xl">
                {item.judul}
              </h3>
              {subjudul && (
                <p className="mt-3 text-lg font-semibold leading-snug text-brand-navy">{subjudul}</p>
              )}
              {item.ringkasan && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-body">{item.ringkasan}</p>
              )}

              <DaftarFormat format={item.format} locale={locale} className="mt-5" />

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={href} className="btn-outline">
                  {t.detail}
                </Link>
                {item.status === "berbayar" ? (
                  <Link href={localizedPath("/mitra", locale)} className="btn-yellow">
                    {t.beli}
                  </Link>
                ) : (
                  <Link href={href} className="btn-yellow">
                    {t.unduh}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {alasan && (
          <div className="rounded-card bg-brand-red/[0.06] p-6 shadow-card sm:p-8">
            {alasan.judul && (
              <h2 className="text-xl font-bold leading-tight text-brand-red [text-wrap:balance]">
                {alasan.judul}
              </h2>
            )}
            <ul className={`space-y-2.5 ${alasan.judul ? "mt-4" : ""}`}>
              {alasan.poin.map((teks, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-snug text-brand-red">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mt-px h-4 w-4 shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{teks}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
