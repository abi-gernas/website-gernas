import { HeroCarousel, PageHero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { StatCounterRow } from "@/components/StatCounterRow";
import { ValueCards } from "@/components/ValueCards";
import { CTABanner } from "@/components/CTABanner";
import { NewsCard } from "@/components/NewsCard";
import { ArticleBody } from "@/components/ArticleBody";
import { Timeline } from "@/components/Timeline";
import { TeamGrid } from "@/components/TeamGrid";
import { Gallery } from "@/components/Gallery";
import { IdeaCards } from "@/components/IdeaCards";
import { FeatureCards } from "@/components/FeatureCards";
import { Callout } from "@/components/Callout";
import { DonationCampaigns } from "@/components/DonationCampaigns";
import { DonationTierButtons } from "@/components/DonationTierButtons";
import { TrainingModules } from "@/components/TrainingModules";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { IndonesiaMap } from "@/components/IndonesiaMap";
import { ContactForm } from "@/components/ContactForm";
import { PartnerLogoGrid, PartnerMarquee } from "@/components/PartnerLogoGrid";
import { VideoCard } from "@/components/VideoCard";
import Link from "next/link";
import { getArticles } from "@/lib/content";
import {
  getMitra,
  getModulPelatihan,
  getPenggerak,
  getVideo,
  kelompokMitraLabel,
  mediaURL,
  urutanKelompokMitra,
} from "@/lib/datasitus";
import { kolomKe } from "@/components/warna";
import type { Page } from "@/payload-types";

/**
 * Menerjemahkan `layout` koleksi Halaman menjadi komponen Design System v2.0.
 *
 * Ini bagian yang menutup rantai US-002: tanpanya staf bisa menyusun blok di
 * dasbor tetapi halamannya tidak ter-render di mana pun. Setiap blok di
 * `src/payload/blocks/` wajib punya cabang di sini — bila tidak, blok itu
 * dilewati diam-diam agar satu blok yang belum didukung tidak menjatuhkan
 * seluruh halaman.
 *
 * Blok yang isinya berasal dari koleksi "Data Situs" (Penggerak, Mitra, Video,
 * Modul Pelatihan) mengambil datanya sendiri di sini, bukan lewat props dari
 * halaman, supaya menambahkan blok itu ke halaman baru tidak menuntut
 * perubahan di route mana pun.
 */

/** Satu elemen di dalam field `layout`. */
type Block = NonNullable<Page["layout"]>[number];

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

/** Ambil URL + alt sekaligus — dipakai blok yang menampilkan banyak gambar. */
function toFoto(value: unknown): { url: string; alt: string } | null {
  if (!value || typeof value !== "object") return null;
  const m = value as { url?: string | null; alt?: string | null };
  return m.url ? { url: m.url, alt: m.alt ?? "" } : null;
}

/** Lebar konten standar — blok non-full-bleed dibungkus ini. */
function Contained({ children }: { children: React.ReactNode }) {
  return <div className="container-page py-12 sm:py-16">{children}</div>;
}

// ─── Blok yang mengambil datanya sendiri ──────────────────────────────────

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

  const cta = toCTA(block.cta);

  return (
    <Section title={block.heading ?? "Kabar Terbaru"} id={block.anchor ?? undefined}>
      <div className={`grid gap-6 ${kolomKe(block.kolom)}`}>
        {articles.map((a) => (
          <NewsCard key={a.id} article={a} />
        ))}
      </div>
      {cta && (
        <div className="mt-8 flex justify-center">
          <Link href={cta.href} className="btn-outline">
            {cta.label}
          </Link>
        </div>
      )}
    </Section>
  );
}

async function Penggerak({
  block,
}: {
  block: Extract<Block, { blockType: "teamGrid" }>;
}) {
  const docs = await getPenggerak();
  if (docs.length === 0) return null;

  const anggota = docs.map((d) => ({
    nama: d.nama,
    foto: mediaURL(d.foto),
    peran: (d.peran ?? []).map((p) => p.nama).filter(Boolean),
  }));

  return (
    <Section title={block.heading ?? undefined} id={block.anchor ?? undefined}>
      <TeamGrid anggota={anggota} />
    </Section>
  );
}

async function LogoMitra({
  block,
}: {
  block: Extract<Block, { blockType: "partnerLogos" }>;
}) {
  const barisan = block.tampilan === "barisan";
  const docs = await getMitra(barisan);
  if (docs.length === 0) return null;

  const cta = toCTA(block.cta);
  const toPartner = (d: (typeof docs)[number]) => ({
    name: d.nama,
    logo: mediaURL(d.logo) ?? "",
  });

  return (
    <Section title={block.heading ?? undefined} className="bg-surface">
      {barisan ? (
        <PartnerMarquee partners={docs.map(toPartner).filter((p) => p.logo)} />
      ) : (
        <div className="space-y-14">
          {urutanKelompokMitra.map((kelompok) => {
            const anggota = docs
              .filter((d) => d.kelompok === kelompok)
              .map(toPartner)
              .filter((p) => p.logo);
            if (anggota.length === 0) return null;

            return (
              <div key={kelompok}>
                <h3 className="mb-8 text-center text-lg font-bold text-brand-red sm:text-xl">
                  {kelompokMitraLabel[kelompok]}
                </h3>
                <PartnerLogoGrid partners={anggota} />
              </div>
            );
          })}
        </div>
      )}
      {cta && (
        <div className="mt-8 flex justify-center">
          <Link href={cta.href} className="btn-yellow">
            {cta.label}
          </Link>
        </div>
      )}
    </Section>
  );
}

async function DaftarVideo({
  block,
}: {
  block: Extract<Block, { blockType: "videoGrid" }>;
}) {
  const docs = await getVideo(block.limit);
  if (docs.length === 0) return null;

  return (
    <Section title={block.heading ?? undefined}>
      <div className={`grid gap-6 ${kolomKe(block.kolom)}`}>
        {docs.map((v) => (
          <VideoCard
            key={v.id}
            video={{
              title: v.judul,
              thumb: mediaURL(v.thumbnail) ?? "",
              href: v.tautan ?? undefined,
            }}
          />
        ))}
      </div>
    </Section>
  );
}

async function ModulPelatihanBlok({
  block,
}: {
  block: Extract<Block, { blockType: "trainingModules" }>;
}) {
  const docs = await getModulPelatihan(block.program);
  if (docs.length === 0) return null;

  const modul = docs.map((d) => ({
    nomor: d.nomor,
    judul: d.judul,
    tujuan: (d.tujuan ?? []).map((t) => t.teks).filter(Boolean),
  }));

  const sidebarCTA = toCTA(block.sidebar?.cta);

  return (
    <Section title={block.heading ?? undefined}>
      <TrainingModules
        modul={modul}
        tampilan={block.tampilan}
        sidebar={
          block.sidebar?.teks
            ? {
                teks: block.sidebar.teks,
                ajakan: block.sidebar.ajakan ?? undefined,
                cta: sidebarCTA,
              }
            : undefined
        }
      />
    </Section>
  );
}

// ─── Pemetaan blok → komponen ─────────────────────────────────────────────

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
        <>
          <PageHero
            title={block.title}
            description={block.description ?? undefined}
            image={image}
            tint={block.tint ?? "navy"}
          />
          {block.garisBawah && <div className="h-2 bg-brand-yellow" />}
        </>
      );
    }

    case "richText": {
      const lebar = block.lebar === "penuh" ? "" : "mx-auto max-w-4xl";
      const rata = block.rataTengah ? "text-center" : "";
      return (
        <Section title={block.heading ?? undefined}>
          <div className={`${lebar} ${rata}`.trim()}>
            <ArticleBody content={block.content} />
          </div>
        </Section>
      );
    }

    case "featureCards": {
      const cards = (block.cards ?? []).map((c) => ({
        judul: c.judul,
        subjudul: c.subjudul ?? undefined,
        isi: c.isi,
        gambar: mediaURL(c.gambar),
        warna: c.warna,
        cta: toCTA(c.cta),
      }));
      if (cards.length === 0) return null;

      const sampingURL = mediaURL(block.gambarSamping?.gambar);

      return (
        <Section title={block.heading ?? undefined}>
          <FeatureCards
            cards={cards}
            kolom={block.kolom ?? undefined}
            gambarSamping={
              sampingURL
                ? {
                    url: sampingURL,
                    judul: block.gambarSamping?.judul ?? undefined,
                    judulSorot: block.gambarSamping?.judulSorot ?? undefined,
                  }
                : undefined
            }
          />
        </Section>
      );
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
      if (cards.length === 0) return null;

      // Tampilan beranda: kartu naik menutupi bagian bawah hero di atasnya.
      if (block.tumpukDiAtasHero) {
        return (
          <div className="container-page relative z-10 -mt-14 sm:-mt-24">
            <ValueCards cards={cards} />
          </div>
        );
      }
      return (
        <Contained>
          <ValueCards cards={cards} />
        </Contained>
      );
    }

    case "callout":
      return (
        <Section>
          <Callout
            judul={block.judul}
            isi={block.isi ?? undefined}
            warna={block.warna}
            gambar={(block.gambar ?? [])
              .map(toFoto)
              .filter((f): f is { url: string; alt: string } => Boolean(f))}
            cta={toCTA(block.cta)}
            tautanTambahan={(block.tautanTambahan ?? []).map((t) => ({
              awalan: t.awalan ?? undefined,
              label: t.label,
              href: t.href ?? undefined,
            }))}
            rataTengah={Boolean(block.rataTengah)}
          />
        </Section>
      );

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

    case "timeline": {
      const entries = (block.entries ?? []).map((e) => ({
        tahun: e.tahun,
        teks: e.teks,
      }));
      return entries.length > 0 ? (
        <Section title={block.heading ?? undefined} className="bg-surface">
          <Timeline entries={entries} />
        </Section>
      ) : null;
    }

    case "statCounter": {
      const stats = (block.stats ?? []).map((s) => ({
        value: s.value,
        suffix: s.suffix ?? undefined,
        label: s.label,
      }));
      return stats.length > 0 ? (
        <Section title={block.heading ?? undefined}>
          <StatCounterRow stats={stats} />
        </Section>
      ) : null;
    }

    case "latestNews":
      return <LatestNews block={block} />;

    case "teamGrid":
      return <Penggerak block={block} />;

    case "partnerLogos":
      return <LogoMitra block={block} />;

    case "videoGrid":
      return <DaftarVideo block={block} />;

    case "trainingModules":
      return <ModulPelatihanBlok block={block} />;

    case "gallery": {
      const foto = (block.images ?? [])
        .map(toFoto)
        .filter((f): f is { url: string; alt: string } => Boolean(f));
      return foto.length > 0 ? (
        <Section title={block.heading ?? undefined}>
          <Gallery foto={foto} kolom={block.kolom ?? undefined} />
        </Section>
      ) : null;
    }

    case "testimonials": {
      const items = (block.items ?? []).map((t) => ({
        quote: t.kutipan,
        name: t.nama,
        role: t.peran ?? "",
        photo: mediaURL(t.foto),
      }));
      return items.length > 0 ? (
        <Section title={block.heading ?? undefined} className="bg-surface">
          <TestimonialCarousel items={items} />
        </Section>
      ) : null;
    }

    case "indonesiaMap": {
      const stats = (block.stats ?? []).map((s) => ({
        value: s.value,
        suffix: s.suffix ?? undefined,
        label: s.label,
      }));
      return (
        <Section title={block.heading ?? undefined}>
          {block.tampilkanPeta !== false && <IndonesiaMap />}
          {stats.length > 0 && (
            <div className="mt-10">
              <StatCounterRow stats={stats} />
            </div>
          )}
        </Section>
      );
    }

    case "ideaCards": {
      const items = (block.items ?? []).flatMap((i) => {
        const gambar = mediaURL(i.gambar);
        if (!gambar) return [];
        return [
          {
            judul: i.judul,
            kelas: i.kelas ?? undefined,
            topik: i.topik ?? undefined,
            gambar,
            href: i.href ?? undefined,
          },
        ];
      });
      return items.length > 0 ? (
        <Section title={block.heading ?? undefined} className="bg-surface">
          <IdeaCards items={items} kolom={block.kolom ?? undefined} />
        </Section>
      ) : null;
    }

    case "contactForm":
      return (
        <Section
          title={block.heading ?? "Hubungi Kami"}
          id={block.anchor ?? undefined}
          className="bg-surface"
        >
          <ContactForm />
        </Section>
      );

    case "donationTiers":
      return (
        <Section>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
                {block.judul}
                {block.judulSorot && (
                  <> <span className="text-brand-red">{block.judulSorot}</span></>
                )}
              </h1>
              {block.isi && (
                <p className="mt-5 text-sm leading-relaxed text-body sm:text-base">
                  {block.isi}
                </p>
              )}
            </div>
            <DonationTierButtons />
          </div>
        </Section>
      );

    case "donationCampaigns": {
      const items = (block.items ?? []).flatMap((c) => {
        const gambar = mediaURL(c.gambar);
        if (!gambar) return [];
        return [
          {
            judul: c.judul,
            gambar,
            terkumpul: c.terkumpul,
            target: c.target,
            cta: toCTA(c.cta),
          },
        ];
      });
      return items.length > 0 ? (
        <Section title={block.heading ?? undefined} className="bg-surface">
          <DonationCampaigns items={items} kolom={block.kolom ?? undefined} />
        </Section>
      ) : null;
    }

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
