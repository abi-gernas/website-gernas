import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getUlasanByProduk } from "@/lib/ulasan";
import { RatingBintang } from "./RatingBintang";

const text = {
  id: { judul: "Apa Kata Mereka" },
  en: { judul: "What Others Say" },
} satisfies Record<Locale, Record<string, string>>;

/** Daftar ulasan yang sudah disetujui staf — kosong sama sekali kalau belum ada. */
export async function UlasanList({
  produkId,
  locale = DEFAULT_LOCALE,
}: {
  produkId: string;
  locale?: Locale;
}) {
  const t = text[locale];
  const { docs, jumlah } = await getUlasanByProduk(produkId);

  if (jumlah === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy">{t.judul}</h2>
      <ul className="mt-3 space-y-4">
        {docs.map((ulasan) => (
          <li key={ulasan.id} className="rounded-card bg-surface p-4">
            <RatingBintang rating={ulasan.rating} size="sm" />
            {ulasan.komentar && (
              <p className="mt-2 text-sm leading-relaxed text-body">&ldquo;{ulasan.komentar}&rdquo;</p>
            )}
            <p className="mt-2 text-xs font-semibold text-muted">{ulasan.nama}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
