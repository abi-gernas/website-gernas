import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/content";

const SITE_URL = "https://gernastastaka.org";

/**
 * Halaman statis situs. Didaftarkan manual (bukan dibaca dari filesystem)
 * karena jumlahnya kecil dan stabil — lebih mudah dirawat daripada scanning
 * folder app/(frontend) secara otomatis.
 */
const STATIC_PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/tentang-gernas-tastaka", priority: 0.8 },
  { path: "/mitra", priority: 0.6 },
  { path: "/donatur", priority: 0.6 },
  { path: "/tumbuh-bersama", priority: 0.6 },
  { path: "/belajar-bersama", priority: 0.6 },
  { path: "/publikasi", priority: 0.8 },
  { path: "/galeri", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));

  const articles = await getArticles();
  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/berita/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticEntries, ...articleEntries];
}
