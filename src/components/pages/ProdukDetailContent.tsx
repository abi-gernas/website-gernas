import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DEFAULT_LOCALE, localizedPath, type Locale } from "@/lib/i18n";
import { JENJANG_LABELS, MAPEL_LABELS } from "@/lib/library";
import {
  FORMAT_LABELS,
  KATEGORI_PRODUK_LABELS,
  TOPIK_PRODUK_LABELS,
  formatHarga,
  getProdukBySlug,
} from "@/lib/produk";
import { getCtaButton } from "@/lib/navigation";
import { produkListPath, produkPath } from "@/lib/routes";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { UnduhMateriGate } from "@/components/library/UnduhMateriGate";

/**
 * Halaman detail satu produk.
 *
 * Isinya sengaja masih ringkas — susunan informasi halaman ini belum ditinjau
 * terhadap mockup (temuan QA 26 Agu untuk halaman detail Alat Peraga berlaku
 * sama di sini). Yang penting sekarang: tombol "Detail" di katalog punya
 * tujuan nyata, bukan tautan mati.
 *
 * Dua tombol aksinya:
 * - Berbayar → "Beli Sekarang" diarahkan ke halaman Mitra (OI-105, mekanisme
 *   checkout belum diputuskan).
 * - Gratis → `UnduhMateriGate`: formulir pendataan pengunjung (FR-104) dulu,
 *   baru tautan Drive keluar, ditemani CTA donasi & tombol berbagi. Tautannya
 *   tidak ikut dirender di sini — halaman ini cuma tahu ADA/TIDAK tautannya
 *   (`punyaTautan`), lihat catatan di `src/lib/produk.ts`.
 */
const text = {
  id: {
    back: "← Kembali ke Buku, Bahan Ajar & Modul",
    fitur: "Fitur Unggulan",
    format: "Format tersedia",
    gratis: "Gratis",
    beli: "Beli Sekarang",
    catatanBeli: "Pembelian sementara dilayani lewat tim kami.",
  },
  en: {
    back: "← Back to Books, Teaching Materials & Modules",
    fitur: "Key Features",
    format: "Available formats",
    gratis: "Free",
    beli: "Buy Now",
    catatanBeli: "Purchases are handled by our team for now.",
  },
} satisfies Record<Locale, Record<string, string>>;

export async function ProdukDetailContent({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: Locale;
}) {
  const t = text[locale];
  const item = await getProdukBySlug(slug, locale);
  if (!item) notFound();

  // CTA donasi memakai tombol yang sama dengan navbar/footer (diatur staf di
  // global Navigasi), bukan tautan donasi terpisah — supaya kalau alamat
  // donasinya pindah, cukup diubah di satu tempat.
  const donasi = item.status === "gratis" ? await getCtaButton(locale) : null;

  // Alamat lengkap untuk tombol berbagi. `NEXT_PUBLIC_SERVER_URL` dipakai
  // (bukan `window.location` di klien) supaya tautan yang dibagikan tetap
  // alamat kanonik, bukan alamat preview/localhost yang kebetulan dibuka.
  const urlHalaman = `${process.env.NEXT_PUBLIC_SERVER_URL ?? ""}${produkPath(item.slug, locale)}`;

  const tags = [
    TOPIK_PRODUK_LABELS[item.topik][locale],
    KATEGORI_PRODUK_LABELS[item.kategoriProduk][locale],
    ...item.jenjang.map((j) => JENJANG_LABELS[j] ?? j),
    ...item.mapel.map((m) => MAPEL_LABELS[m] ?? m),
  ];

  return (
    <article>
      <div className="bg-surface">
        <div className="container-page py-12">
          <Link href={produkListPath(locale)} className="text-sm font-semibold text-brand-red">
            {t.back}
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
            <div className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-none">
              {item.cover && (
                <Image
                  src={item.cover.url}
                  alt={item.judul}
                  fill
                  sizes="(min-width: 1024px) 35vw, 384px"
                  className="object-contain"
                  priority
                />
              )}
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-brand-navy/10 px-2 py-0.5 text-xs font-semibold text-brand-navy"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
                {item.judul}
              </h1>

              {item.ringkasan && (
                <p className="mt-3 text-sm leading-relaxed text-body sm:text-base">
                  {item.ringkasan}
                </p>
              )}

              <p className="mt-5 text-xl font-bold">
                {item.status === "gratis" ? (
                  <span className="text-emerald-600">{t.gratis}</span>
                ) : (
                  item.harga != null && (
                    <span className="text-brand-red">{formatHarga(item.harga, locale)}</span>
                  )
                )}
              </p>

              {item.format.length > 0 && (
                <p className="mt-2 text-sm text-muted">
                  {t.format}: {item.format.map((f) => FORMAT_LABELS[f][locale]).join(" · ")}
                </p>
              )}

              <div className="mt-6">
                {item.status === "berbayar" ? (
                  <>
                    <Link href={localizedPath("/mitra", locale)} className="btn-yellow">
                      {t.beli}
                    </Link>
                    <p className="mt-2 text-xs text-muted">{t.catatanBeli}</p>
                  </>
                ) : (
                  <UnduhMateriGate
                    slug={item.slug}
                    judul={item.judul}
                    punyaTautan={item.punyaTautan}
                    urlHalaman={urlHalaman}
                    donasi={donasi}
                    locale={locale}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page space-y-10 py-12">
        {item.fiturUnggulan.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-brand-navy">{t.fitur}</h2>
            <ul className="mt-3 space-y-2 text-sm text-body">
              {item.fiturUnggulan.map((teks, i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden="true" className="text-brand-yellow-dark">
                    ★
                  </span>
                  <span>{teks}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <CtaBantuanBanner locale={locale} />
      </div>
    </article>
  );
}

export async function produkMetadata(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Metadata> {
  const item = await getProdukBySlug(slug, locale);
  if (!item) {
    return { title: locale === "en" ? "Books, Teaching Materials & Modules" : "Buku, Bahan Ajar & Modul" };
  }

  const description = item.ringkasan ?? undefined;

  return {
    title: item.judul,
    description,
    alternates: {
      canonical: produkPath(item.slug, locale),
      languages: { id: produkPath(item.slug), en: produkPath(item.slug, "en") },
    },
    openGraph: {
      title: item.judul,
      description,
      type: "website",
      locale: locale === "en" ? "en_US" : "id_ID",
      images: item.cover ? [{ url: item.cover.url }] : undefined,
    },
  };
}
