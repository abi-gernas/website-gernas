import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { NewsCard } from "@/components/NewsCard";
import { articles } from "@/data/news";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return { title: "Berita" };
  const desc = a.blocks.find((b) => b.type === "p")?.text?.slice(0, 155);
  return { title: a.title, description: desc };
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
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article>
      {/* Header */}
      <div className="bg-surface">
        <div className="container-page max-w-3xl py-12">
          <Link href="/publikasi" className="text-sm font-semibold text-brand-red">
            ← Kembali ke Publikasi
          </Link>
          <span className="mt-6 inline-block rounded-pill bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
            {article.category}
          </span>
          <h1 className="mt-4 text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
            {article.title}
          </h1>
          <time className="mt-3 block text-sm text-muted">
            {formatDate(article.date)}
          </time>
        </div>
      </div>

      {article.image && (
        <div className="container-page max-w-3xl">
          <div className="relative -mt-2 aspect-[16/9] overflow-hidden rounded-card">
            <Image src={article.image} alt={article.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="container-page max-w-3xl py-10">
        <div className="space-y-5">
          {article.blocks.map((b, i) => {
            if (b.type === "image" && b.src) {
              return (
                <div key={i} className="relative my-6 aspect-[16/9] overflow-hidden rounded-xl">
                  <Image src={b.src} alt="" fill className="object-cover" />
                </div>
              );
            }
            if (b.type === "h") {
              return (
                <h2 key={i} className="pt-4 text-xl font-bold text-brand-navy">
                  {b.text}
                </h2>
              );
            }
            return (
              <p key={i} className="text-sm leading-relaxed text-body sm:text-base">
                {b.text}
              </p>
            );
          })}
        </div>
      </div>

      {/* Related */}
      <Section title="Kabar Lainnya" className="bg-surface">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      </Section>
    </article>
  );
}
