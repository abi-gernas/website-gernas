import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import { Section } from "@/components/Section";
import {
  trainingIntro,
  trainingSidebar,
  trainingModules,
  readingTrainingIntro,
  readingTrainingModules,
  programIntensif,
} from "@/data/training";
import type { TrainingModule } from "@/data/training";
import { heroImages } from "@/data/site";
import { ModuleCard } from "@/components/ModuleCard";

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

function TopikPelatihan({ modules }: { modules: TrainingModule[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {modules.map((m) => (
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
  );
}

function RincianModul({ modules }: { modules: TrainingModule[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {modules.map((m) => (
        <ModuleCard key={m.no} module={m} />
      ))}
    </div>
  );
}

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

          <TopikPelatihan modules={trainingModules} />
        </div>
      </Section>

      {/* Detail modul matematika */}
      <Section title="Rincian Modul Pelatihan">
        <RincianModul modules={trainingModules} />
      </Section>

      {/* Topik Pelatihan Membaca */}
      <Section title="Topik Pelatihan Membaca" className="bg-surface">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_2fr]">
          <div className="rounded-card bg-white p-7 shadow-soft">
            <p className="text-sm font-semibold leading-relaxed text-brand-red">
              {readingTrainingIntro}
            </p>
            <p className="mt-6 text-sm font-medium text-brand-navy">
              Tertarik untuk belajar?
            </p>
            <Link href="/mitra#hubungi" className="btn-yellow mt-3">
              Gabung Sekarang
            </Link>
          </div>

          <TopikPelatihan modules={readingTrainingModules} />
        </div>
      </Section>

      {/* Detail modul membaca */}
      <Section title="Rincian Modul Pelatihan Membaca">
        <RincianModul modules={readingTrainingModules} />
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
