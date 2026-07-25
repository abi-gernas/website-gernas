import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { StatCounterRow } from "@/components/StatCounterRow";
import { IndonesiaMap } from "@/components/IndonesiaMap";
import { team } from "@/data/team";
import { timeline } from "@/data/training";
import { homeStats, orgTrio, heroImages } from "@/data/site";

export const metadata: Metadata = {
  title: "Tentang Gernas Tastaka",
  description:
    "Kami lahir dari kegelisahan & harapan, hidup dan tumbuh dengan ruh kerelawanan. Sejarah, visi-misi, dan penggerak Gernas Tastaka.",
};

const misi = [
  "Menyediakan akses terhadap pendidikan guru SD/MI bermutu yang berfokus pada peningkatan kecakapan bernumerasi.",
  "Menyediakan akses terhadap pendidikan guru SD/MI bermutu yang berfokus pada peningkatan keterampilan membaca.",
  "Menghadirkan sumber belajar yang inovatif untuk mendukung pembelajaran bernalar bagi guru dan siswa.",
  "Melakukan pendekatan secara terikat sebagai kebijakan dan roh kerelawanan.",
  "Pemetaan dan menyempurnakan kompetensi guru SD dalam mengajar matematika dan membaca beserta asesmen dan pelatihannya.",
];

export default function TentangPage() {
  return (
    <>
      <PageHero
        title="Tentang Gernas Tastaka"
        image={heroImages.tentang}
        tint="dark"
      />

      {/* Narasi utama */}
      <Section>
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">
            Kami Lahir dari Kegelisahan &amp; Harapan, Hidup dan Tumbuh dengan Ruh
            Kerelawanan.
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-body sm:text-base">
            <p>
              Gernas Tastaka adalah sebuah gerakan masyarakat sipil untuk
              meningkatkan mutu pendidikan dasar, khususnya Sekolah Dasar (SD)/
              Madrasah Ibtidaiyah (MI) di Indonesia. Gernas Tastaka diluncurkan
              pada 10 November 2018 dengan satu fokus, yaitu Pemberantasan Buta
              Matematika.
            </p>
            <p>
              Gerakan ini lahir dari kegelisahan mendalam akan mutu hasil belajar
              murid Indonesia di mata pelajaran matematika. Seperti terlihat pada
              laporan PISA 2018, skor rata-rata siswa Indonesia adalah 379, di
              bawah rata-rata OECD — menempatkan Indonesia pada posisi 7 dari
              bawah dari 79 negara peserta, dan menurun dibanding PISA 2015 (386).
            </p>
            <p>
              Gernas Tastaka menemani para guru kelas di SD/MI agar mampu
              membelajarkan matematika di kelas dengan{" "}
              <strong>&ldquo;Bernalar, Sederhana, Mendasar, dan
              Kontekstual&rdquo;</strong>. Dimulai dari menghimpun sumber daya
              intelektual-akademis, menyusun rancangan pelatihan komprehensif,
              hingga menggerakkan relawan untuk membantu guru memperbaiki kualitas
              pembelajaran melalui pelatihan tatap muka yang sarat simulasi.
            </p>
          </div>

          <blockquote className="mt-10 rounded-card bg-surface p-8">
            <p className="text-lg font-medium italic text-brand-navy">
              &ldquo;Kita tak bisa menolak takdir, tapi kita dapat melakukan
              perubahan. Sekecil apapun itu. Tak ada waktu untuk berdiam diri.
              Sebab, perubahan adalah sebuah keniscayaan. Mari Bergerak!&rdquo;
            </p>
            <footer className="mt-4 text-sm font-semibold text-brand-red">
              — Ahmad Rizali, Founder Gernas Tastaka
            </footer>
          </blockquote>
        </div>
      </Section>

      {/* Timeline */}
      <Section title="Tumbuh Bersama Kami" className="bg-surface">
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-brand-navy/15 sm:left-1/2" />
          <ul className="space-y-8">
            {timeline.map((t, i) => (
              <li
                key={t.year}
                className={`relative pl-12 sm:w-1/2 sm:pl-0 ${
                  i % 2 === 0
                    ? "sm:ml-0 sm:pr-10 sm:text-right"
                    : "sm:ml-auto sm:pl-10"
                }`}
              >
                <span
                  className={`absolute left-2.5 top-1 h-3 w-3 rounded-full bg-brand-red ring-4 ring-white sm:left-auto ${
                    i % 2 === 0 ? "sm:-right-1.5" : "sm:-left-1.5"
                  }`}
                />
                <span className="text-lg font-extrabold text-brand-red">
                  {t.year}
                </span>
                <p className="mt-1 text-sm text-body">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Visi Misi */}
      <Section title="Visi &amp; Misi">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-card bg-brand-navy p-8 text-white">
            <h3 className="text-lg font-bold text-white">Visi</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Pendidikan Dasar (SD/MI) dan setangkat yang Bermutu Bagi Semua.
            </p>
          </div>
          <div className="rounded-card bg-surface p-8">
            <h3 className="text-lg font-bold text-brand-navy">Misi</h3>
            <ol className="mt-3 space-y-2.5 text-sm text-body">
              {misi.map((m, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-bold text-brand-red">{i + 1}.</span>
                  <span>{m}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* Program / lembaga */}
      <Section title="Program" className="bg-surface">
        <div className="grid gap-6 sm:grid-cols-2">
          {orgTrio.map((o) => (
            <div key={o.name} className="rounded-card bg-white p-6 shadow-soft">
              <div className="relative mb-4 aspect-[16/6] overflow-hidden">
                <Image src={o.image} alt={o.name} fill className="object-contain" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">{o.full}</h3>
              <p className="mt-2 text-sm text-body">{o.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Penggerak */}
      <Section title="Penggerak" id="penggerak">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {team.map((m) => (
            <div key={m.name} className="text-center">
              <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-card bg-surface">
                {m.photo && (
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <h4 className="mt-3 text-sm font-bold text-brand-navy">{m.name}</h4>
              <p className="mt-1 text-xs leading-snug text-muted">
                {m.roles.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Dampak */}
      <Section title="Dampak Penyebaran" className="bg-surface">
        <IndonesiaMap />
        <div className="mt-10">
          <StatCounterRow stats={homeStats} />
        </div>
      </Section>
    </>
  );
}
