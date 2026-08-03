import Link from "next/link";
import { DEFAULT_LOCALE, localizedPath, uiText, type Locale } from "@/lib/i18n";

/**
 * Halaman pengganti saat isi yang diminta tidak bisa ditampilkan.
 *
 * Dua keadaan yang ditangani sengaja dibedakan, karena artinya berbeda bagi
 * pengunjung maupun mesin pencari:
 *
 *  - `segeraHadir` — halamannya ADA di CMS tapi belum diterbitkan. Ini yang
 *    terjadi pada tautan seperti "Donasi" di menu: halamannya masih draf,
 *    sehingga dulu pengunjung mendarat di 404 yang terkesan rusak.
 *  - `tidakDitemukan` — alamatnya memang tidak ada (salah ketik, tautan lama).
 *
 * Keduanya memakai kerangka yang sama supaya konsisten dengan Design System
 * v2.0: latar `surface`, judul navy, tombol merah, radius kartu.
 */
type Varian = "segeraHadir" | "tidakDitemukan";

const ikon: Record<Varian, React.ReactNode> = {
  // Jam — menandakan sesuatu yang sedang berjalan menuju terbit.
  segeraHadir: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  // Kaca pembesar — pencarian yang tidak membuahkan hasil.
  tidakDitemukan: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
};

export function StatusHalaman({
  varian,
  locale = DEFAULT_LOCALE,
}: {
  varian: Varian;
  locale?: Locale;
}) {
  const t = uiText[locale];
  const segera = varian === "segeraHadir";

  const eyebrow = segera ? t.comingSoonEyebrow : t.notFoundEyebrow;
  const judul = segera ? t.comingSoonTitle : t.notFoundTitle;
  const teks = segera ? t.comingSoonBody : t.notFoundBody;

  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <div
            aria-hidden="true"
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-card shadow-soft ${
              segera ? "bg-brand-yellow text-brand-navy" : "bg-brand-navy text-white"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-9 w-9"
            >
              {ikon[varian]}
            </svg>
          </div>

          <p className="eyebrow mt-8">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">{judul}</h1>
          <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">{teks}</p>

          <div className="mt-9 flex justify-center">
            <Link href={localizedPath("/", locale)} className="btn-red">
              {t.backHome}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
