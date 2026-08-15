import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import type { Article as PayloadArticle, Media } from "@/payload-types";

/**
 * Akses konten dari Payload untuk halaman publik.
 *
 * Semua query lewat Local API (bukan HTTP) — dijalankan di server component,
 * tanpa lompatan jaringan, dan tetap menghormati access control koleksi.
 */

/** Bentuk artikel yang dipakai komponen front-end. */
export type ArticleView = {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string | null;
  image: { url: string; width?: number; height?: number } | null;
  excerpt: string;
  /** Pohon Lexical; hanya diisi pada halaman detail. */
  content?: PayloadArticle["content"];
  /** Diisi staf lewat panel SEO (@payloadcms/plugin-seo); kosong bila belum diisi. */
  seo: {
    title: string | null;
    description: string | null;
    image: { url: string; width?: number; height?: number } | null;
  };
  author: string | null;
  editor: string | null;
};

/** Nama tampilan penulis/editor: teks manual > akun/penggerak terpilih > tidak ada. */
function toPersonName(
  manual: string | null | undefined,
  ref: PayloadArticle["authorRef"],
): string | null {
  if (manual) return manual;
  if (ref && typeof ref.value === "object") {
    return ref.relationTo === "users" ? ref.value.name : ref.value.nama;
  }
  return null;
}

/** Ambil URL & dimensi dari relasi Media yang sudah ter-populate. */
function toImage(value: unknown): ArticleView["image"] {
  if (!value || typeof value !== "object") return null;
  const m = value as Media;
  if (!m.url) return null;
  return {
    url: m.url,
    width: m.width ?? undefined,
    height: m.height ?? undefined,
  };
}

function toView(doc: PayloadArticle, withContent = false): ArticleView {
  const category =
    doc.category && typeof doc.category === "object" ? doc.category.title : null;

  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    date: doc.publishedAt,
    category,
    image: toImage(doc.image),
    excerpt: doc.excerpt ?? "",
    author: toPersonName(doc.authorNama, doc.authorRef),
    editor: toPersonName(doc.editorNama, doc.editorRef),
    seo: {
      title: doc.meta?.title ?? null,
      description: doc.meta?.description ?? null,
      image: toImage(doc.meta?.image),
    },
    ...(withContent ? { content: doc.content } : {}),
  };
}

/**
 * Daftar artikel terbit, terbaru lebih dulu.
 *
 * `categoryId` dipakai blok "Berita Terbaru" di koleksi Halaman, yang boleh
 * dibatasi ke satu kategori; kosongkan untuk mengambil semua kategori.
 */
export const getArticles = cache(async function getArticles(
  limit?: number,
  categoryId?: string | number,
  locale: Locale = DEFAULT_LOCALE,
): Promise<ArticleView[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "articles",
    depth: 1, // populate relasi image & category
    limit: limit ?? 100,
    sort: "-publishedAt",
    // Judul artikel punya versi Inggris; yang belum diisi jatuh ke Indonesia.
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    where: {
      _status: { equals: "published" },
      ...(categoryId ? { category: { equals: categoryId } } : {}),
    },
    pagination: false,
  });
  return res.docs.map((d) => toView(d));
});

/**
 * Satu artikel berdasarkan slug. Mengembalikan null bila tidak ada.
 *
 * `draft` mengikuti pola yang sama dengan `getPageBySlug` di `pages.ts`:
 * hanya bernilai true saat draft mode Next menyala, sehingga staf dapat
 * melihat artikel yang belum terbit lewat tombol Pratinjau.
 */
export const getArticleBySlug = cache(async function getArticleBySlug(
  slug: string,
  draft = false,
  locale: Locale = DEFAULT_LOCALE,
): Promise<ArticleView | null> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "articles",
    depth: 2, // gambar di dalam isi ikut ter-populate
    limit: 1,
    draft,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    where: {
      slug: { equals: slug },
      ...(draft ? {} : { _status: { equals: "published" } }),
    },
    pagination: false,
  });
  const doc = res.docs[0];
  return doc ? toView(doc, true) : null;
});

/** Slug seluruh artikel terbit — untuk generateStaticParams. */
export async function getArticleSlugs(locale: Locale = DEFAULT_LOCALE): Promise<string[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "articles",
    depth: 0,
    limit: 1000,
    where: { _status: { equals: "published" } },
    pagination: false,
    select: { slug: true },
  });
  return res.docs.map((d) => d.slug);
}

/**
 * Slug + tanggal terbit seluruh artikel — untuk sitemap.
 *
 * Terpisah dari `getArticles` karena sitemap tidak merender apa pun: `depth: 0`
 * melewatkan populate relasi gambar & kategori yang di sini tidak terpakai.
 */
export async function getArticleSitemapEntries(): Promise<
  { slug: string; publishedAt: string }[]
> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "articles",
    depth: 0,
    limit: 1000,
    where: { _status: { equals: "published" } },
    pagination: false,
    select: { slug: true, publishedAt: true },
  });
  return res.docs.map((d) => ({ slug: d.slug, publishedAt: d.publishedAt }));
}
