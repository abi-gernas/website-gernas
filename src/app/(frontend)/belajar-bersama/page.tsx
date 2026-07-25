import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import { Section } from "@/components/Section";
import {
  trainingIntro,
  trainingSidebar,
  trainingModules,
  programIntensif,
} from "@/data/training";
import { heroImages } from "@/data/site";

export const metadata: Metadata = {
  title: "Belajar Bersama",
  description:
    "Program pelatihan Gernas Tastaka untuk membekali guru SD/MI dengan keterampilan mengajar matematika dan membaca yang bernalar.",
};

const toneCard: Record<string, string> = {
  red: "bg-brand-red text-white",
  navy: "bg-brand-navy text-white",
  yellow: "bg-brand-yellow text-brand-navy",
};

export default function BelajarBersamaPage() {
  return (
    <>
      <PageHero
        title="Matematika Sebagai Fondasi Kemampuan Bernalar"
        description="Gernas Tastaka menemani guru SD/MI membelajarkan matematika yang bernalar, sederhana, mendasar, dan kontekstual melalui pelatihan tatap muka yang sarat simulasi."
        image={heroImages.belajar}
        tint="dark"
      />

      <Section>
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-brand-red">Program Pelatihan</h2>
          <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
            {trainingIntro}
          </p>
        </div>
      </Section>

      {/* Topik Pelatihan */}
      <Section title="Topik Pelatihan Matematika" className="bg-surface">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_2fr]">
          <div className="rounded-card bg-white p-7 shadow-soft">
            <p className="text-sm font-semibold leading-relaxed text-brand-red">
              {trainingSidebar}
            </p>
            <p className="mt-6 text-sm font-medium text-brand-navy">
              Tertarik untuk belajar?
            </p>
            <Link href="/mitra#hubungi" className="btn-yellow mt-3">
              Gabung Sekarang
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {trainingModules.map((m) => (
              <div
                key={m.no}
                className={`flex flex-col rounded-card p-6 ${toneCard[m.tone]}`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                  Pelatihan {m.no}
                </span>
                <h3
                  className={`mt-1 text-lg font-bold ${
                    m.tone === "yellow" ? "text-brand-navy" : "text-white"
                  }`}
                >
                  {m.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Detail modul */}
      <Section title="Rincian Modul Pelatihan">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {trainingModules.map((m) => (
            <div
              key={m.no}
              className="rounded-card bg-surface p-6"
            >
              <h3 className="text-base font-bold text-brand-navy">
                Modul {m.no}: {m.subtitle}
              </h3>
              <ol className="mt-3 space-y-2 text-sm text-body">
                {m.points.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-semibold text-brand-red">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Section>

      {/* Program Intensif */}
      <Section className="bg-surface">
        <div className="mx-auto max-w-4xl rounded-card bg-brand-navy p-8 text-white sm:p-12">
          <h2 className="text-xl font-bold text-brand-yellow">Program Intensif</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
            {programIntensif}
          </p>
          <Link href="/mitra#hubungi" className="btn-yellow mt-6">
            Jadi Mitra Program
          </Link>
        </div>
      </Section>
    </>
  );
}
