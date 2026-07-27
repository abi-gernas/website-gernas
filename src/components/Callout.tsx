import Image from "next/image";
import Link from "next/link";
import { asWarna, warnaIsi, warnaJudul, warnaKotak } from "./warna";

/**
 * Kotak sorot berwarna serbaguna.
 *
 * Menggantikan tiga kotak yang di situs lama ditulis terpisah: "Program
 * Intensif" (biru tua), "Rangkaian produk pilihan" (kuning, dengan deretan
 * gambar), dan blok penutup berisi ajakan.
 */
export function Callout({
  judul,
  isi,
  warna: warnaMentah,
  gambar = [],
  cta,
  tautanTambahan = [],
  rataTengah = false,
}: {
  judul: string;
  isi?: string;
  warna?: string | null;
  gambar?: { url: string; alt: string }[];
  cta?: { label: string; href: string };
  tautanTambahan?: { awalan?: string; label: string; href?: string }[];
  rataTengah?: boolean;
}) {
  const warna = asWarna(warnaMentah);
  const rata = rataTengah ? "text-center" : "";

  return (
    <div
      className={`rounded-card p-8 sm:p-12 ${warnaKotak[warna]} ${
        warna === "putih" ? "shadow-soft" : ""
      }`}
    >
      <div className={`mx-auto max-w-4xl ${rata}`}>
        <h2 className={`text-xl font-bold sm:text-2xl ${warnaJudul[warna]}`}>
          {judul}
        </h2>

        {isi && (
          <p className={`mt-4 text-sm leading-relaxed sm:text-base ${warnaIsi[warna]}`}>
            {isi}
          </p>
        )}

        {gambar.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {gambar.map((g, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-xl bg-white"
              >
                <Image
                  src={g.url}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {cta && (
          <div className={rataTengah ? "mt-6 flex justify-center" : "mt-6"}>
            <Link
              href={cta.href}
              className={warna === "navy" ? "btn-yellow" : "btn-red"}
            >
              {cta.label}
            </Link>
          </div>
        )}

        {tautanTambahan.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-brand-navy">
            {tautanTambahan[0]?.awalan && <span>{tautanTambahan[0].awalan}</span>}
            {tautanTambahan.map((t, i) =>
              t.href ? (
                <a
                  key={i}
                  href={t.href}
                  className="rounded-full bg-white px-4 py-2 hover:underline"
                >
                  {t.label}
                </a>
              ) : (
                <span key={i} className="rounded-full bg-white px-4 py-2">
                  {t.label}
                </span>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
