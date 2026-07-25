import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { PartnerLogoGrid } from "@/components/PartnerLogoGrid";
import { CTABanner } from "@/components/CTABanner";
import { ContactForm } from "@/components/ContactForm";
import { partnerGroups, heroImages } from "@/data/site";

export const metadata: Metadata = {
  title: "Mitra",
  description:
    "Selalu ada ruang partisipasi untuk pendidikan. Berkolaborasi bersama Gernas Tastaka melalui CSR, sponsorship, proyek, dan konsultasi.",
};

const partnershipTypes = [
  {
    title: "CSR",
    body: "Program CSR kami memudahkan Anda mendukung inisiatif pendidikan yang berdampak. Dari media pembelajaran hingga peningkatan kualitas guru, kami bantu Anda mencapai tujuan.",
  },
  {
    title: "Sponsorship",
    body: "Gerakan kami telah mengakar hampir di seluruh Indonesia. Melalui sponsorship, Anda membantu mewujudkan pendidikan dasar yang bermutu bagi setiap guru dan anak di Indonesia.",
  },
  {
    title: "Proyek",
    body: "Selenggarakan acara edukasi yang bermakna. Kami menyediakan platform yang memudahkan pengelolaan acara, mulai dari pendaftaran hingga evaluasi. Bersama, kita wujudkan generasi yang lebih cerdas.",
  },
  {
    title: "Konsultan & Kolaborasi",
    body: "Butuh solusi pendidikan yang disesuaikan dengan kebutuhan Anda? Kami siap memberikan konsultasi dan pendampingan untuk mencapai tujuan pendidikan yang lebih baik.",
  },
];

export default function MitraPage() {
  return (
    <>
      <PageHero
        title="Mitra Kami"
        description="Setiap langkah yang kami tempuh tak lepas dari kontribusi para mitra yang setia mendampingi. Bersama mereka, Penggerak Indonesia Cerdas terus tumbuh, memberi makna, dan membawa dampak nyata bagi pendidikan Indonesia."
        image={heroImages.mitra}
      />
      <div className="h-2 bg-brand-yellow" />

      {/* Partnership types */}
      <Section>
        <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative overflow-hidden rounded-card">
            <div className="relative aspect-[4/5]">
              <Image
                src={heroImages.donatur}
                alt="Partisipasi untuk pendidikan"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-navy/30" />
            </div>
            <div className="absolute bottom-0 p-6">
              <h3 className="text-2xl font-bold text-white">
                <span className="text-brand-yellow">Selalu Ada Ruang</span>{" "}
                Partisipasi Untuk Pendidikan
              </h3>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {partnershipTypes.map((p) => (
              <div
                key={p.title}
                className="rounded-card bg-white p-6 shadow-card"
              >
                <h4 className="text-lg font-bold text-brand-red">{p.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-body">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Logo groups */}
      <Section className="bg-surface">
        <div className="space-y-14">
          {partnerGroups.map((g) => (
            <div key={g.title}>
              <h3 className="mb-8 text-center text-lg font-bold text-brand-red sm:text-xl">
                {g.title}
              </h3>
              <PartnerLogoGrid partners={g.partners} />
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Jadilah Bagian dari Perubahan Pendidikan Indonesia"
          body="Kami percaya bahwa kemajuan pendidikan dasar membutuhkan kolaborasi yang kuat. Penggerak Indonesia Cerdas membuka peluang kerja sama bagi institusi, organisasi, perusahaan, dan individu yang memiliki visi sama: mencerdaskan generasi bangsa."
          cta={{ label: "Jadi Mitra", href: "#hubungi" }}
          image={heroImages.tentang}
        />
      </Section>

      {/* Contact */}
      <Section title="Hubungi Kami" id="hubungi" className="bg-surface">
        <ContactForm />
      </Section>
    </>
  );
}
