import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Warna } from "@/components/warna";

export type SumberStatistik =
  | "produk"
  | "videoPembelajaran"
  | "mediaInteraktif"
  | "semua"
  | "manual";

export type KartuPerangkat = {
  judul: string;
  deskripsi?: string;
  href: string;
  gambar?: string;
  warna: Warna;
};

export type StatistikPerangkat = {
  angka: number;
  akhiran?: string;
  label: string;
  sumber: SumberStatistik;
};

export type PanelPerangkat = {
  statistik: StatistikPerangkat[];
  judul?: string;
  isi?: string;
  gambar: string;
  cta?: { label: string; href: string };
};

const text = {
  id: { lihat: "Lihat Produk" },
  en: { lihat: "View Resources" },
} satisfies Record<Locale, { lihat: string }>;

/** Latar muda kartu + titik & teks berwarna, menurut pilihan "Warna aksen". */
const aksen: Record<Warna, { kartu: string; titik: string; teks: string }> = {
  putih: { kartu: "bg-white shadow-card", titik: "bg-brand-navy", teks: "text-brand-navy" },
  abu: { kartu: "bg-gray-100", titik: "bg-gray-700", teks: "text-gray-800" },
  navy: { kartu: "bg-brand-navy/[0.07]", titik: "bg-brand-navy", teks: "text-brand-navy" },
  merah: { kartu: "bg-brand-red/[0.07]", titik: "bg-brand-red", teks: "text-brand-red" },
  kuning: { kartu: "bg-brand-yellow/[0.16]", titik: "bg-brand-yellow", teks: "text-brand-navy" },
};

/** Ikon garis tiap sumber angka — dipilih otomatis, bukan oleh staf. */
const ikonStatistik: Record<SumberStatistik, React.ReactNode> = {
  produk: (
    <>
      <path d="M12 6.5S10 4.5 4 4.5v13c6 0 8 2 8 2s2-2 8-2v-13c-6 0-8 2-8 2z" />
      <path d="M12 6.5v13" />
    </>
  ),
  videoPembelajaran: (
    <>
      <rect x="2.5" y="5.5" width="14" height="13" rx="2" />
      <path d="m16.5 10 5-3v10l-5-3" />
    </>
  ),
  mediaInteraktif: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8.5 20h7M12 16v4" />
    </>
  ),
  semua: (
    <>
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 12.5 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </>
  ),
  manual: <path d="M4 20V11M10 20V4M16 20v-6M2.5 20h19" />,
};

/**
 * Blok `perangkatGuru` — "Perangkat Pembelajaran untuk Guru": empat kartu
 * katalog 2×2 di kiri, panel navy (jumlah materi + ajakan "Belum menemukan…")
 * di kanan. Di bawah `lg` panel turun ke bawah kartu.
 *
 * Gambar kartu & ilustrasi panel dekoratif (`alt=""`): nama katalog sudah
 * tertulis di judul kartu, yang sekaligus menjadi teks tautannya.
 */
export function PerangkatGuru({
  judul,
  subjudul,
  kartu,
  panel,
  locale,
}: {
  judul?: string;
  subjudul?: string;
  kartu: KartuPerangkat[];
  panel?: PanelPerangkat;
  locale: Locale;
}) {
  const t = text[locale];
  const formatAngka = new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID");

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

      <div
        className={`grid gap-5 ${
          kartu.length > 0 && panel ? "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-6" : ""
        }`}
      >
        {kartu.length > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2">
            {kartu.map((k, i) => {
              const a = aksen[k.warna];
              return (
                <li key={i}>
                  <Link
                    href={k.href}
                    className={`group flex h-full min-h-[200px] flex-col rounded-card p-5 transition-shadow hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy sm:p-6 ${a.kartu}`}
                  >
                    <h3 className={`flex items-start gap-2.5 text-base font-bold leading-snug ${a.teks}`}>
                      <span aria-hidden="true" className={`mt-[3px] h-4 w-4 shrink-0 rounded-full ${a.titik}`} />
                      <span className="min-w-0 break-words [text-wrap:balance]">{k.judul}</span>
                    </h3>

                    <div className="mt-3 flex flex-1 items-end gap-3">
                      <div className="flex h-full min-w-0 flex-1 flex-col">
                        {k.deskripsi && <p className="text-sm leading-relaxed text-body">{k.deskripsi}</p>}
                        <span className={`mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold ${a.teks}`}>
                          {t.lihat}
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5"
                          >
                            <path d="M4 10h12M11 5l5 5-5 5" />
                          </svg>
                        </span>
                      </div>

                      {k.gambar && (
                        <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                          <Image
                            src={k.gambar}
                            alt=""
                            fill
                            sizes="112px"
                            className="object-contain object-bottom"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {panel && (
          <div className="relative flex flex-col overflow-hidden rounded-card bg-brand-navy p-6 text-white shadow-card sm:p-8">
            {panel.statistik.length > 0 && (
              <dl className="space-y-4">
                {panel.statistik.map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/10">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        {ikonStatistik[s.sumber]}
                      </svg>
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <dt className="order-2 text-xs leading-snug text-white/75">{s.label}</dt>
                      <dd className="order-1 text-2xl font-bold tabular-nums leading-tight">
                        {formatAngka.format(s.angka)}
                        {s.akhiran}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}

            {(panel.judul || panel.isi || panel.cta) && (
              <div
                className={`relative mt-auto sm:pr-28 lg:pr-20 ${panel.statistik.length > 0 ? "pt-8" : ""}`}
              >
                {panel.judul && (
                  <h3 className="text-xl font-bold leading-tight [text-wrap:balance]">{panel.judul}</h3>
                )}
                {panel.isi && <p className="mt-2 text-sm leading-relaxed text-white/80">{panel.isi}</p>}
                {panel.cta && (
                  <Link
                    href={panel.cta.href}
                    className="btn mt-5 border border-white/80 bg-transparent !py-2 !text-xs text-white hover:bg-white hover:text-brand-navy"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.9A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" />
                    </svg>
                    {panel.cta.label}
                  </Link>
                )}

                <div className="pointer-events-none absolute -bottom-6 -right-4 hidden h-32 w-28 sm:-bottom-8 sm:-right-6 sm:block">
                  <Image src={panel.gambar} alt="" fill sizes="112px" className="object-contain object-bottom" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
