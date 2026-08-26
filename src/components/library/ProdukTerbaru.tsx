import Image from "next/image";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import { FORMAT_LABELS, type ProdukView } from "@/lib/produk";
import { produkPath } from "@/lib/routes";

/**
 * Panel "Produk Terbaru" di atas katalog — satu produk sematan, lihat
 * `getProdukTerbaru()` di `src/lib/produk.ts` soal cara memilihnya.
 *
 * Tombol aksi utamanya sengaja belum menuju alur transaksi apa pun:
 * "Beli Sekarang!" diarahkan ke halaman Mitra (fallback "Hubungi Kami")
 * karena mekanisme checkout masih OI-105 yang belum diputuskan, dan
 * "Unduh Gratis" diarahkan ke halaman detail — form pendataan pengunjung
 * (FR-104) belum dibuat. Lihat §2.4 rencana eksekusi.
 */
export function ProdukTerbaru({ item, locale = "id" }: { item: ProdukView; locale?: Locale }) {
  const href = produkPath(item.slug, locale);
  const t =
    locale === "en"
      ? {
          heading: "Latest Product",
          detail: "Product Details",
          beli: "Buy Now!",
          unduh: "Download Free",
          selengkapnya: "See product details",
        }
      : {
          heading: "Produk Terbaru",
          detail: "Detail Produk",
          beli: "Beli Sekarang!",
          unduh: "Unduh Gratis",
          selengkapnya: "Lihat detail produk",
        };

  const semuaFormat = ["pdf", "cetak"] as const;

  return (
    <section className="rounded-card bg-brand-yellow/[0.12] p-6 sm:p-8">
      <h2 className="text-base font-bold text-brand-navy">{t.heading}</h2>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.8fr)] lg:items-center">
        <div className="relative mx-auto aspect-square w-full max-w-xs lg:max-w-none">
          {item.cover && (
            <Image
              src={item.cover.url}
              alt={item.judul}
              fill
              sizes="(min-width: 1024px) 30vw, 320px"
              className="object-contain"
              priority
            />
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold uppercase leading-tight text-brand-navy sm:text-3xl">
            {item.judul}
          </h3>

          <div className="mt-3 flex items-start gap-4">
            {item.ringkasan && (
              <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-body">
                {item.ringkasan}
              </p>
            )}
            <Link
              href={href}
              aria-label={t.selengkapnya}
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-navy/25 text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {semuaFormat.map((f) => {
              const tersedia = item.format.includes(f);
              return (
                <li
                  key={f}
                  className={`flex items-center gap-2 text-sm ${
                    tersedia ? "text-brand-navy" : "text-muted/60"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 items-center justify-center rounded-[4px] ${
                      tersedia ? "bg-brand-navy text-white" : "bg-brand-navy/15"
                    }`}
                  >
                    {tersedia && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-2.5 w-2.5"
                      >
                        <path d="m5 12 5 5L19 7" />
                      </svg>
                    )}
                  </span>
                  {FORMAT_LABELS[f][locale]}
                </li>
              );
            })}
          </ul>

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

        {item.fiturUnggulan.length > 0 && (
          <ul className="space-y-3 border-brand-navy/10 lg:border-l lg:pl-8">
            {item.fiturUnggulan.map((teks, i) => (
              <li key={i} className="flex gap-2.5 text-sm font-semibold text-brand-navy">
                <span aria-hidden="true" className="text-brand-yellow-dark">
                  ★
                </span>
                <span>{teks}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
