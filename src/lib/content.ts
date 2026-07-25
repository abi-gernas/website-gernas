import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
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
};

const payloadPromise = getPayload({ config });

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
    seo: {
      title: doc.meta?.title ?? null,
      description: doc.meta?.description ?? null,
      image: toImage(doc.meta?.image),
    },
    ...(withContent ? { content: doc.content } : {}),
  };
}

/** Daftar artikel terbit, terbaru lebih dulu. */
export async function getArticles(limit?: number): Promise<ArticleView[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "articles",
    depth: 1, // populate relasi image & category
    limit: limit ?? 100,
    sort: "-publishedAt",
    where: { _status: { equals: "published" } },
    pagination: false,
  });
  return res.docs.map((d) => toView(d));
}

/** Satu artikel berdasarkan slug. Mengembalikan null bila tidak ada. */
export async function getArticleBySlug(slug: string): Promise<ArticleView | null> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "articles",
    depth: 2, // gambar di dalam isi ikut ter-populate
    limit: 1,
    where: {
      slug: { equals: slug },
      _status: { equals: "published" },
    },
    pagination: false,
  });
  const doc = res.docs[0];
  return doc ? toView(doc, true) : null;
}

/** Slug seluruh artikel terbit — untuk generateStaticParams. */
export async function getArticleSlugs(): Promise<string[]> {
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
