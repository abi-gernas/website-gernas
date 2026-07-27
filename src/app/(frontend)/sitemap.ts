import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/content";
import { getPageSitemapEntries } from "@/lib/pages";
import { HOME_SLUG, pagePath } from "@/lib/routes";

const SITE_URL = "https://gernastastaka.org";

/**
 * Bobot halaman-halaman utama.
 *
 * Seluruh halaman kini berasal dari koleksi Halaman, sehingga daftarnya tidak
 * lagi ditulis manual di sini — yang tersisa hanya bobot untuk slug yang
 * memang lebih penting daripada halaman baru buatan staf. Slug yang tidak
 * terdaftar memakai nilai bawaan.
 */
const PRIORITAS: Record<string, number> = {
  [HOME_SLUG]: 1,
  "tentang-gernas-tastaka": 0.8,
  publikasi: 0.8,
  mitra: 0.6,
  donatur: 0.6,
  "tumbuh-bersama": 0.6,
  "belajar-bersama": 0.6,
  galeri: 0.5,
};

const PRIORITAS_BAWAAN = 0.6;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/berita/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  // Halaman yang disusun staf dari dasbor. `pagePath` memetakan slug beranda
  // ke "/", bukan "/beranda" — alamat itu memang tidak dilayani.
  const pages = await getPageSitemapEntries();
  const pageEntries: MetadataRoute.Sitemap = pages.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}${pagePath(slug)}`,
    lastModified: new Date(updatedAt),
    changeFrequency: slug === HOME_SLUG ? "weekly" : "monthly",
    priority: PRIORITAS[slug] ?? PRIORITAS_BAWAAN,
  }));

  return [...pageEntries, ...articleEntries];
}
