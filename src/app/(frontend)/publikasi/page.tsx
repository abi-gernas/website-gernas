import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { NewsCard } from "@/components/NewsCard";
import { getArticles } from "@/lib/content";
import { heroImages } from "@/data/site";

export const metadata: Metadata = {
  title: "Publikasi",
  description:
    "Publikasi riset, kajian kebijakan, dan kabar terbaru Gernas Tastaka seputar pembelajaran matematika dan membaca di pendidikan dasar.",
};

const pubImage = "/media/33150d8200cfff8fe19622359c178182cfc8e089-edited-scaled.jpg";
const publications = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  title: "Kami Lahir dari Kegelisahan & Harapan",
  subtitle: "Publikasi Riset",
}));

export default async function PublikasiPage() {
  const articles = await getArticles();

  return (
    <>
      <PageHero
        title="Publikasi & Riset"
        description="Karya ilmiah, kajian kebijakan, dan diseminasi hasil penelitian dari Pusat Riset Penggerak Indonesia Cerdas (PRPIC) dan BAJIK."
        image={heroImages.tentang}
        tint="dark"
      />

      <Section title="Publikasi Riset">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publications.map((p) => (
            <div
              key={p.id}
              className="flex flex-col overflow-hidden rounded-card bg-white shadow-soft"
            >
              <div className="relative aspect-[16/10]">
                <Image src={pubImage} alt={p.title} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="eyebrow">{p.subtitle}</span>
                <h3 className="mt-2 flex-1 text-base font-bold text-brand-navy">
                  {p.title}
                </h3>
                <button className="btn-outline mt-4 self-start !py-2 text-xs">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Kabar Terbaru" className="bg-surface">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      </Section>
    </>
  );
}
