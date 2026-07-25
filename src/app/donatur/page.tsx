import Image from "next/image";
import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { DonationTierButtons } from "@/components/DonationTierButtons";

export const metadata: Metadata = {
  title: "Donatur",
  description:
    "Bersama-sama mendukung langkah anak Indonesia untuk lebih bernalar. Dukung program pembelajaran matematika dan membaca Gernas Tastaka.",
};

const M = (f: string) => `/media/${f}`;

const campaigns = [
  {
    title: "Pengembangan Ide Belajar Matematika dan Membaca",
    image: M("834296ea58977bb15745da9ee0c3d2385325dd99-1024x576.png"),
    raised: 270_000_000,
    goal: 800_000_000,
  },
  {
    title: "Pelatihan Guru SD/MI di Daerah 3T",
    image: M("a4d5ed53492d8bf52d5785e896bb3dadee9f0688-1024x576.png"),
    raised: 120_000_000,
    goal: 500_000_000,
  },
  {
    title: "Produksi Media Pembelajaran Numerasi",
    image: M("79e6e1305e5a1db654f94b16aa6d6ad3a0d694e9-1024x576.png"),
    raised: 85_000_000,
    goal: 300_000_000,
  },
];

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function DonaturPage() {
  return (
    <>
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
              Bersama-sama Mendukung Langkah Anak Indonesia untuk Lebih{" "}
              <span className="text-brand-red">Bernalar</span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-body sm:text-base">
              Kami menyadari bahwa membenahi pendidikan dasar Indonesia pada dua
              elemen utamanya — matematika dan membaca — adalah kerja raksasa yang
              membutuhkan keterlibatan banyak pihak. Karena itu, kami membuka
              pintu kolaborasi seluas-luasnya dengan berbagai mitra, para dermawan,
              dan segenap pemangku kepentingan. Setiap dukungan akan disalurkan
              dalam program yang dirancang Gernas Tastaka.
            </p>
          </div>
          <DonationTierButtons />
        </div>
      </Section>

      <Section title="Donasi Untuk Gernas Tastaka" className="bg-surface">
        <div className="grid gap-6 md:grid-cols-3">
          {campaigns.map((c) => {
            const pct = Math.round((c.raised / c.goal) * 100);
            return (
              <div
                key={c.title}
                className="flex flex-col overflow-hidden rounded-card bg-white shadow-soft"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={c.image} alt={c.title} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-brand-navy">
                    {c.title}
                  </h3>
                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-brand-red"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      <span className="font-semibold text-brand-navy">
                        {rupiah(c.raised)}
                      </span>{" "}
                      dari {rupiah(c.goal)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-red mt-5 w-full !py-2.5 text-xs"
                    title="Fitur donasi online akan segera hadir"
                  >
                    DONASI SEKARANG!
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
