import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { RatingBintang } from "./RatingBintang";

const text = {
  id: {
    jumlah: (n: number) => `(${n} ulasan)`,
    kosong: "Jadi yang pertama menilai materi ini",
  },
  en: {
    jumlah: (n: number) => `(${n} ratings)`,
    kosong: "Be the first to rate this material",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export function RatingRingkas({
  rataRata,
  jumlah,
  locale = DEFAULT_LOCALE,
}: {
  rataRata: number | null;
  jumlah: number;
  locale?: Locale;
}) {
  const t = text[locale];

  if (rataRata == null || jumlah === 0) {
    return <p className="mt-2 text-sm text-muted">{t.kosong}</p>;
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <RatingBintang rating={rataRata} />
      <span className="text-sm font-semibold text-brand-navy">{rataRata.toFixed(1)}</span>
      <span className="text-sm text-muted">{t.jumlah(jumlah)}</span>
    </div>
  );
}
