import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { gallery } from "@/data/gallery";
import { heroImages } from "@/data/site";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Dokumentasi kegiatan pelatihan, festival belajar, dan pendampingan guru Gernas Tastaka di berbagai daerah Indonesia.",
};

export default function GaleriPage() {
  return (
    <>
      <PageHero
        title="Galeri Kegiatan"
        description="Jejak langkah Gernas Tastaka bersama para guru, mitra, dan penggerak di berbagai penjuru Indonesia."
        image={heroImages.tumbuh}
        tint="dark"
      />

      <Section>
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {gallery.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl bg-surface break-inside-avoid"
            >
              <Image
                src={src}
                alt={`Dokumentasi kegiatan Gernas Tastaka ${i + 1}`}
                width={600}
                height={400}
                className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
