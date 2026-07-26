import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/Hero";
import { ValueCards } from "@/components/ValueCards";
import { Section } from "@/components/Section";
import { StatCounterRow } from "@/components/StatCounterRow";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { IndonesiaMap } from "@/components/IndonesiaMap";
import { NewsCard } from "@/components/NewsCard";
import { PartnerMarquee } from "@/components/PartnerLogoGrid";
import { VideoCard } from "@/components/VideoCard";
import { CTABanner } from "@/components/CTABanner";
import {
  homeSlides,
  homeValueCards,
  homeStats,
  testimonials,
  orgTrio,
  homePartners,
  homeVideos,
  heroImages,
} from "@/data/site";
import { getArticles } from "@/lib/content";

export default async function HomePage() {
  const articles = await getArticles(3);

  return (
    <>
      <HeroCarousel slides={homeSlides} />

      {/* Value cards overlapping the hero */}
      <div className="container-page relative z-10 -mt-14 sm:-mt-24">
        <ValueCards cards={homeValueCards} />
      </div>

      {/* Tentang Gernas Tastaka */}
      <Section
        title="Tentang Gernas Tastaka"
        subtitle="Sebuah gerakan yang diinisiasi oleh masyarakat untuk meningkatkan mutu pembelajaran matematika dan membaca di Sekolah Dasar/Madrasah Ibtidaiyah di Indonesia."
      >
        <div className="mx-auto -mt-4 flex justify-center">
          <Link href="/tentang-gernas-tastaka" className="btn-yellow">
            Selengkapnya →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {orgTrio.map((o) => (
            <div
              key={o.name}
              className="grid grid-cols-1 items-center gap-5 rounded-card bg-surface p-6 sm:grid-cols-2"
            >
              <div>
                <h3 className="text-2xl font-extrabold text-brand-navy">
                  {o.name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-red">
                  {o.full}
                </p>
                <p className="mt-3 text-sm text-body">{o.body}</p>
                <Link
                  href="/tentang-gernas-tastaka"
                  className="btn-yellow mt-5 !py-2 !text-xs"
                >
                  Selengkapnya →
                </Link>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
                <Image src={o.image} alt={o.name} fill className="object-contain p-4" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Kata Mereka */}
      <Section title="Kata Mereka" className="bg-surface">
        <TestimonialCarousel items={testimonials} />
      </Section>

      {/* Peta + Statistik */}
      <Section title="Gernas Tastaka di Indonesia">
        <IndonesiaMap />
        <div className="mt-10">
          <StatCounterRow stats={homeStats} />
        </div>
      </Section>

      {/* Kabar Terbaru */}
      <Section title="Kabar Terbaru" className="bg-surface" id="kabar-terbaru">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/publikasi" className="btn-outline">
            Lihat Semua →
          </Link>
        </div>
      </Section>

      {/* Mitra Kolaborasi */}
      <Section title="Mitra Kolaborasi">
        <PartnerMarquee partners={homePartners} />
        <div className="mt-8 flex justify-center">
          <Link href="/mitra" className="btn-yellow">
            Lihat Selengkapnya!
          </Link>
        </div>
      </Section>

      {/* Video pilihan */}
      <Section title="Rekam Jejak Gernas Tastaka" className="bg-surface">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeVideos.slice(0, 3).map((v) => (
            <VideoCard key={v.title} video={v} />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Jadilah Bagian Dari Upaya Peningkatan Mutu Pendidikan Dasar Indonesia"
          body="Bergabunglah bersama para penggerak, mitra, dan dermawan untuk menghadirkan pembelajaran matematika dan membaca yang bermakna bagi anak-anak Indonesia."
          cta={{ label: "Kerja Sama", href: "/mitra" }}
          image={heroImages.mitra}
        />
      </Section>
    </>
  );
}
