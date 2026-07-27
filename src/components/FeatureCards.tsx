import Image from "next/image";
import Link from "next/link";
import { ArticleBody } from "./ArticleBody";
import { asWarna, kolomKe, warnaJudul, warnaKotak } from "./warna";

export type KartuBerisi = {
  judul: string;
  subjudul?: string;
  isi?: unknown;
  gambar?: string;
  warna?: string | null;
  cta?: { label: string; href: string };
};

export type GambarSamping = {
  url: string;
  judul?: string;
  judulSorot?: string;
};

/**
 * Kartu berisi serbaguna.
 *
 * Satu komponen ini menggantikan tiga pola yang di situs lama ditulis
 * terpisah: kartu lembaga (PRPIC/BAJIK), kartu jenis kemitraan, dan kotak
 * Visi–Misi. Yang membedakan hanya warna, jumlah kolom, dan ada-tidaknya
 * gambar — bukan struktur.
 */
export function FeatureCards({
  cards,
  kolom = "2",
  gambarSamping,
}: {
  cards: KartuBerisi[];
  kolom?: string;
  gambarSamping?: GambarSamping;
}) {
  if (cards.length === 0) return null;

  const grid = (
    <div className={`grid gap-5 ${kolomKe(kolom, "2")}`}>
      {cards.map((c, i) => {
        const warna = asWarna(c.warna);
        return (
          <div
            key={i}
            className={`flex flex-col rounded-card p-6 ${warnaKotak[warna]} ${
              warna === "putih" ? "shadow-card" : ""
            }`}
          >
            {c.gambar && (
              <div className="relative mb-4 aspect-[16/6] overflow-hidden">
                <Image
                  src={c.gambar}
                  alt={c.judul}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain"
                />
              </div>
            )}

            <h3 className={`text-lg font-bold ${warnaJudul[warna]}`}>{c.judul}</h3>

            {c.subjudul && (
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-red">
                {c.subjudul}
              </p>
            )}

            {c.isi != null && (
              <div className="mt-3 flex-1 text-sm leading-relaxed">
                <ArticleBody content={c.isi} />
              </div>
            )}

            {c.cta && (
              <Link href={c.cta.href} className="btn-yellow mt-5 self-start !py-2 !text-xs">
                {c.cta.label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );

  // Tanpa gambar samping, kartu memakai seluruh lebar.
  if (!gambarSamping?.url) return grid;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="relative overflow-hidden rounded-card">
        <div className="relative aspect-[4/5]">
          <Image
            src={gambarSamping.url}
            alt={gambarSamping.judul ?? ""}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/30" />
        </div>
        {gambarSamping.judul && (
          <div className="absolute bottom-0 p-6">
            <h3 className="text-2xl font-bold text-white">
              {gambarSamping.judulSorot && (
                <span className="text-brand-yellow">{gambarSamping.judulSorot} </span>
              )}
              {gambarSamping.judul}
            </h3>
          </div>
        )}
      </div>
      {grid}
    </div>
  );
}
