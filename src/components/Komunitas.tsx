import Image from "next/image";
import Link from "next/link";
import { Ikon, type NamaIkon } from "./ikon";

export type KartuKomunitas = {
  nama: string;
  deskripsi?: string;
  warna: "navy" | "merah";
  ikon: NamaIkon;
  ilustrasi?: string;
  cta?: { label: string; href: string };
};

const gaya = {
  navy: { ikon: "bg-brand-navy", judul: "text-brand-navy", tombol: "bg-brand-navy hover:bg-brand-navy-dark" },
  merah: { ikon: "bg-brand-red", judul: "text-brand-red", tombol: "bg-brand-red hover:bg-brand-red-dark" },
} as const;

/**
 * Blok `komunitas` — "Bergabung dengan Komunitas" di Pojok Guru: maks. 2
 * kartu berikon bulat, tombol isi-penuh sewarna, ilustrasi opsional di pojok.
 *
 * Ilustrasi dekoratif (`alt=""`) dan disembunyikan di bawah `sm` karena di
 * layar sempit mendesak teks. Tombol hilang bila tautannya kosong.
 */
export function Komunitas({
  judul,
  subjudul,
  kartu,
}: {
  judul?: string;
  subjudul?: string;
  kartu: KartuKomunitas[];
}) {
  return (
    <section className="container-page py-12 sm:py-16">
      {(judul || subjudul) && (
        <div className="mb-6 max-w-3xl">
          {judul && (
            <h2 className="text-xl font-bold text-brand-navy [text-wrap:balance] sm:text-2xl">{judul}</h2>
          )}
          {subjudul && <p className="mt-1.5 text-sm leading-relaxed text-body">{subjudul}</p>}
        </div>
      )}

      <ul className={`grid gap-5 ${kartu.length > 1 ? "md:grid-cols-2" : ""}`}>
        {kartu.map((k, i) => {
          const g = gaya[k.warna];
          return (
            <li
              key={i}
              className={`relative flex flex-col overflow-hidden rounded-card border border-black/5 bg-white p-6 shadow-card sm:p-7 ${
                k.ilustrasi ? "sm:pr-44" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-white ${g.ikon}`}>
                  <Ikon nama={k.ikon} className="h-6 w-6" />
                </span>
                <h3 className={`min-w-0 break-words text-lg font-bold leading-snug [text-wrap:balance] ${g.judul}`}>
                  {k.nama}
                </h3>
              </div>

              {k.deskripsi && <p className="mt-3 text-sm leading-relaxed text-body">{k.deskripsi}</p>}

              {k.cta && (
                <div className="mt-auto pt-5">
                  <Link href={k.cta.href} className={`btn !py-2 !text-xs text-white ${g.tombol}`}>
                    {k.cta.label}
                  </Link>
                </div>
              )}

              {k.ilustrasi && (
                <div className="pointer-events-none absolute bottom-0 right-4 hidden h-32 w-36 sm:block">
                  <Image src={k.ilustrasi} alt="" fill sizes="144px" className="object-contain object-bottom" />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
