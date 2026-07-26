import { HeroCarousel, PageHero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { StatCounterRow } from "@/components/StatCounterRow";
import { ValueCards } from "@/components/ValueCards";
import { CTABanner } from "@/components/CTABanner";
import { NewsCard } from "@/components/NewsCard";
import { ArticleBody } from "@/components/ArticleBody";
import { getArticles } from "@/lib/content";
import type { Page } from "@/payload-types";

/**
 * Menerjemahkan `layout` koleksi Halaman menjadi komponen Design System v2.0.
 *
 * Ini bagian yang menutup rantai US-002: tanpanya staf bisa menyusun blok di
 * dasbor tetapi halamannya tidak ter-render di mana pun. Setiap blok di
 * `src/payload/blocks/index.ts` wajib punya cabang di sini — bila tidak, blok
 * itu dilewati diam-diam agar satu blok yang belum didukung tidak menjatuhkan
 * seluruh halaman.
 */

/** Satu elemen di dalam field `layout`. */
type Block = NonNullable<Page["layout"]>[number];

/**
 * Relasi upload bisa berupa ID (depth 0) atau dokumen Media (depth >= 1).
 * Halaman publik selalu meminta depth 2, jadi bentuk kedua yang diharapkan;
 * pengecekan ini menjaga agar perubahan depth tidak berujung runtime error.
 */
function mediaURL(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const url = (value as { url?: string | null }).url;
  return url ?? undefined;
}

/**
 * Grup CTA dari dasbor selalu ada sebagai objek, tetapi label & tautannya
 * opsional. Komponen hanya menerima CTA yang lengkap.
 */
function toCTA(
  cta: { label?: string | null; href?: string | null } | null | undefined,
): { label: string; href: string } | undefined {
  if (!cta?.label || !cta?.href) return undefined;
  return { label: cta.label, href: cta.href };
}

/** Lebar konten standar — blok non-full-bleed dibungkus ini. */
function Contained({ children }: { children: React.ReactNode }) {
  return <div className="container-page py-12 sm:py-16">{children}</div>;
}

async function LatestNews({
  block,
}: {
  block: Extract<Block, { blockType: "latestNews" }>;
}) {
  const categoryId =
    block.category && typeof block.category === "object"
      ? block.category.id
      : (block.category ?? undefined);

  const articles = await getArticles(block.limit ?? 3, categoryId ?? undefined);
  if (articles.length === 0) return null;

  return (
    <Section title={block.heading ?? "Kabar Terbaru"}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <NewsCard key={a.id} article={a} />
        ))}
      </div>
    </Section>
  );
}

async function RenderBlock({ block }: { block: Block }) {
  switch (block.blockType) {
    case "hero": {
      const slides = (block.slides ?? []).flatMap((s) => {
        const image = mediaURL(s.image);
        // Gambar wajib di skema; slide tanpa gambar berarti relasinya terputus.
        if (!image) return [];
        return [
          {
            title: s.title,
            highlight: s.highlight ?? undefined,
            description: s.description ?? undefined,
            image,
            cta: toCTA(s.cta),
          },
        ];
      });
      return slides.length > 0 ? <HeroCarousel slides={slides} /> : null;
    }

    case "pageHero": {
      const image = mediaURL(block.image);
      if (!image) return null;
      return (
        <PageHero
          title={block.title}
          description={block.description ?? undefined}
          image={image}
          tint={block.tint ?? "navy"}
        />
      );
    }

    case "statCounter": {
      const stats = (block.stats ?? []).map((s) => ({
        value: s.value,
        suffix: s.suffix ?? undefined,
        label: s.label,
      }));
      return stats.length > 0 ? (
        <Contained>
          <StatCounterRow stats={stats} />
        </Contained>
      ) : null;
    }

    case "valueCards": {
      const cards = (block.cards ?? []).map((c) => ({
        title: c.title,
        body: c.body,
        tone: c.tone,
        cta: toCTA(c.cta),
        links: (c.links ?? []).flatMap((l) =>
          l.label && l.href ? [{ label: l.label, href: l.href }] : [],
        ),
      }));
      return cards.length > 0 ? (
        <Contained>
          <ValueCards cards={cards} />
        </Contained>
      ) : null;
    }

    case "ctaBanner":
      return (
        <Contained>
          <CTABanner
            title={block.title}
            body={block.body ?? undefined}
            cta={toCTA(block.cta)}
            image={mediaURL(block.image)}
          />
        </Contained>
      );

    case "latestNews":
      return <LatestNews block={block} />;

    case "richText":
      return (
        <Section title={block.heading ?? undefined}>
          <ArticleBody content={block.content} />
        </Section>
      );

    default:
      // Blok baru yang belum punya komponen — sengaja tidak menggagalkan render.
      return null;
  }
}

export function RenderBlocks({ blocks }: { blocks: Page["layout"] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, i) => (
        <RenderBlock key={block.id ?? `${block.blockType}-${i}`} block={block} />
      ))}
    </>
  );
}
