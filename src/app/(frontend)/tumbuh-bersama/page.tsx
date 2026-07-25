import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { VideoCard } from "@/components/VideoCard";
import { homeVideos, heroImages } from "@/data/site";

export const metadata: Metadata = {
  title: "Tumbuh Bersama",
  description:
    "Kompilasi bahan ajar, ide pembelajaran matematika & membaca, serta video pembelajaran Gernas Tastaka yang dapat langsung diterapkan guru di kelas.",
};

const M = (f: string) => `/media/${f}`;

type Idea = { title: string; kelas: string; topic: string; topicTone: string; image: string };

const ideaImgA = M("d96bb3c5d887eaa246973c0888c84c49d646da6c-819x1024.jpg");
const ideaImgB = M("5706175d8b9555b6cc4cb129d1c706dad90c0640-819x1024.jpg");

const matematika: Idea[] = [
  { title: "Penjumlahan Dengan Bingkai 10", kelas: "Kelas 1", topic: "Bilangan", topicTone: "bg-brand-red", image: ideaImgA },
  { title: "Pemanfaatan Tabel Absensi untuk Media Pembelajaran Nilai Tempat dan Bilangan", kelas: "Kelas 1", topic: "Bilangan", topicTone: "bg-brand-red", image: ideaImgB },
  { title: "Penjumlahan Dengan Bingkai 10", kelas: "Kelas 1", topic: "Bilangan", topicTone: "bg-brand-red", image: ideaImgA },
  { title: "Pemanfaatan Tabel Absensi untuk Media Pembelajaran Nilai Tempat dan Bilangan", kelas: "Kelas 1", topic: "Bilangan", topicTone: "bg-brand-red", image: ideaImgB },
];

const membaca: Idea[] = [
  { title: "Penjumlahan Dengan Bingkai 10", kelas: "Kelas 1", topic: "Fonik", topicTone: "bg-brand-red", image: ideaImgA },
  { title: "Pemanfaatan Tabel Absensi untuk Media Pembelajaran Nilai Tempat dan Bilangan", kelas: "Kelas 1", topic: "Bilangan", topicTone: "bg-brand-red", image: ideaImgB },
  { title: "Penjumlahan Dengan Bingkai 10", kelas: "Kelas 1", topic: "Fonik", topicTone: "bg-brand-red", image: ideaImgA },
  { title: "Pemanfaatan Tabel Absensi untuk Media Pembelajaran Nilai Tempat dan Bilangan", kelas: "Kelas 1", topic: "Bilangan", topicTone: "bg-brand-red", image: ideaImgB },
];

function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <div className="overflow-hidden rounded-card bg-white shadow-soft">
      <div className="relative aspect-[3/4]">
        <Image src={idea.image} alt={idea.title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <div className="flex gap-2">
          <span className="rounded bg-brand-yellow px-2 py-0.5 text-[11px] font-semibold text-brand-navy">
            {idea.kelas}
          </span>
          <span className={`rounded px-2 py-0.5 text-[11px] font-semibold text-white ${idea.topicTone}`}>
            {idea.topic}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm font-semibold text-brand-navy">
          {idea.title}
        </p>
      </div>
    </div>
  );
}

export default function TumbuhBersamaPage() {
  return (
    <>
      <PageHero
        title="Tumbuh Bersama dengan Kompilasi Bahan Ajar"
        description="Gernas Tastaka mengompilasi beragam materi dan ide belajar praktis yang dapat diakses para guru untuk memperkaya pembelajaran di kelas."
        image={heroImages.tumbuh}
        tint="dark"
      />

      <Section>
        <p className="mx-auto max-w-4xl text-center text-sm leading-relaxed text-body sm:text-base">
          Gernas Tastaka menghadirkan berbagai karya dan materi pembelajaran yang
          dapat langsung diterapkan oleh guru di kelas. Materi dirancang dengan
          prinsip kedekatan pada kehidupan sehari-hari, penumbuhan nalar, dan
          pembangunan rasa percaya diri murid dalam belajar matematika dan
          membaca. Tersedia juga rekaman webinar dan video pembelajaran dari
          program Bincang Gernas. Kami percaya, pengetahuan akan tumbuh lebih kuat
          ketika dibagikan dan diterapkan bersama.
        </p>
      </Section>

      <Section title="Ide Pembelajaran Matematika" className="bg-surface">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {matematika.map((i, idx) => (
            <IdeaCard key={idx} idea={i} />
          ))}
        </div>
      </Section>

      <Section title="Akses Ide Pembelajaran Membaca">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {membaca.map((i, idx) => (
            <IdeaCard key={idx} idea={i} />
          ))}
        </div>
      </Section>

      <Section
        title="Akses Video Pembelajaran Topik Matematika dan Membaca"
        className="bg-surface"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {homeVideos.map((v) => (
            <VideoCard key={v.title} video={v} />
          ))}
        </div>
      </Section>

      {/* Produk pilihan */}
      <Section>
        <div className="rounded-card bg-brand-yellow p-8 sm:p-12">
          <h2 className="text-center text-2xl font-bold text-brand-navy">
            Rangkaian produk pilihan yang kami sediakan
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              "0755ce198112836b6367fbee81181f84a895a787-Medium-1024x576.jpg",
              "2e179e5cac71ab5008e6663239b32edb18a9568e-Medium.jpg",
              "0dce58a77b3fef3575056594bb4b71433f9f8630-Medium.jpg",
              "f06abb8494c4ff902037b6a0365c737afc1425b6-Medium-300x169.jpg",
            ].map((f, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-white">
                <Image src={`/media/${f}`} alt="Produk Gernas" fill className="object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm font-semibold text-brand-navy">
            <span>Temukan Kami:</span>
            <span className="rounded-full bg-white px-4 py-2 text-[#EE4D2D]">Shopee</span>
            <span className="rounded-full bg-white px-4 py-2 text-[#42B549]">Tokopedia</span>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title">
            Berpartisipasi Untuk Menguatkan Pembelajaran
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-body">
            Di ruang kelas yang sama, setiap hari guru menemukan pengalaman baru.
            Praktik baik yang dibagikan dan dijalankan akan tumbuh dengan
            pengalaman baru, dan bila dibagikan kembali, praktik baik menjadi
            semakin kaya. Jadilah bagian dari kekayaan pembelajaran yang terus
            tumbuh.
          </p>
          <Link href="/mitra#hubungi" className="btn-red mt-6">
            Ikut Terlibat
          </Link>
        </div>
      </Section>
    </>
  );
}
