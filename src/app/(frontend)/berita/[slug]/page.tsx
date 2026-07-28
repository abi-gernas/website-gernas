import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { NewsCard } from "@/components/NewsCard";
import { ArticleBody } from "@/components/ArticleBody";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PreviewBadge } from "@/components/PreviewBadge";
import { getArticleBySlug, getArticleSlugs, getArticles } from "@/lib/content";

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const article = await getArticleBySlug(slug, draft);
  if (!article) return { title: "Berita" };

  // Field SEO (diisi staf lewat panel SEO) diutamakan; jika kosong, jatuh
  // kembali ke judul/ringkasan/sampul artikel.
  const title = article.seo.title || article.title;
  const description = article.seo.description || article.excerpt || undefined;
  const ogImage = article.seo.image ?? article.image;

  return {
    title,
    description,
    alternates: { canonical: `/berita/${article.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.date,
      images: ogImage ? [{ url: ogImage.url }] : undefined,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const article = await getArticleBySlug(slug, draft);
  if (!article) notFound();

  // Ambil 4, bukan seluruh arsip: satu di antaranya bisa jadi artikel ini
  // sendiri, yang tersaring di bawah — sisanya tetap cukup untuk tiga kartu.
  const related = (await getArticles(4)).filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article>
      {draft && (
        <>
          <LivePreviewListener />
          <PreviewBadge />
        </>
      )}

      {/* Header */}
      <div className="bg-surface">
        <div className="container-page max-w-3xl py-12">
          <Link href="/publikasi" className="text-sm font-semibold text-brand-red">
            ← Kembali ke Publikasi
          </Link>
          {article.category && (
            <span className="mt-6 inline-block rounded-pill bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
              {article.category}
            </span>
          )}
          <h1 className="mt-4 text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
            {article.title}
          </h1>
          <time className="mt-3 block text-sm text-muted">{formatDate(article.date)}</time>
        </div>
      </div>

      {article.image && (
        <div className="container-page max-w-3xl">
          <div className="relative -mt-2 aspect-[16/9] overflow-hidden rounded-card">
            <Image
              src={article.image.url}
              alt={article.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Isi */}
      <div className="container-page max-w-3xl py-10">
        <ArticleBody content={article.content} />
      </div>

      {/* Terkait */}
      {related.length > 0 && (
        <Section title="Kabar Lainnya" className="bg-surface">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}
