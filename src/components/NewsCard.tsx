import Image from "next/image";
import Link from "next/link";
import type { ArticleView } from "@/lib/content";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function NewsCard({ article }: { article: ArticleView }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-card bg-white shadow-soft transition-shadow hover:shadow-card">
      <Link href={`/berita/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        {article.image && (
          <Image
            src={article.image.url}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time className="text-xs text-muted">{formatDate(article.date)}</time>
        <h3 className="mt-2 line-clamp-2 text-base font-bold text-brand-navy">
          <Link href={`/berita/${article.slug}`} className="hover:text-brand-red">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{article.excerpt}</p>
        <Link
          href={`/berita/${article.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-red"
        >
          Baca Selengkapnya →
        </Link>
      </div>
    </article>
  );
}
