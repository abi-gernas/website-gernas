import type { Locale } from "@/lib/i18n";

/**
 * Form pencarian GET biasa (tanpa JS) — submit menulis ulang query param `q`
 * di URL saat ini, atau di `action` bila diisi. Dipakai 4 halaman Library, hero
 * Pencarian Cepat, dan halaman hasil pencarian Pojok Guru — lihat
 * `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §2.3 & §4.5.
 *
 * Dua tampilan:
 * - `pill` (bawaan) — input pil + tombol teks "Cari", dipakai 3 halaman lama.
 * - `kotak` — input kotak + tombol persegi berikon kaca pembesar, mengikuti
 *   mockup Buku/Bahan Ajar/Modul. Tiga halaman lama belum ikut diubah ke
 *   tampilan ini karena mockup masing-masing belum ditinjau ulang (lihat
 *   temuan QA 26 Agu di §5 rencana eksekusi).
 *
 * `inputId` perlu dibedakan bila dua form ini tampil di satu halaman, supaya
 * `<label htmlFor>` tidak menunjuk input yang salah.
 */
export function LibrarySearchBar({
  defaultValue = "",
  placeholder,
  locale = "id",
  variant = "pill",
  action,
  inputId = "library-search-q",
  tombol = "navy",
  className = "max-w-xl",
}: {
  defaultValue?: string;
  placeholder: string;
  locale?: Locale;
  variant?: "pill" | "kotak";
  /** Alamat tujuan submit. Kosong = halaman saat ini. */
  action?: string;
  inputId?: string;
  /** Warna tombol varian `kotak` — `kuning` untuk di atas latar gelap. */
  tombol?: "navy" | "kuning";
  /** Lebar maksimum form. */
  className?: string;
}) {
  const buttonLabel = locale === "en" ? "Search" : "Cari";

  if (variant === "kotak") {
    return (
      <form method="get" action={action} role="search" className={`flex w-full gap-3 ${className}`}>
        <label className="sr-only" htmlFor={inputId}>
          {placeholder}
        </label>
        <input
          id={inputId}
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="off"
          className="min-h-[48px] w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-sm text-ink shadow-soft placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        />
        <button
          type="submit"
          aria-label={buttonLabel}
          className={`flex h-12 w-12 shrink-0 touch-manipulation items-center justify-center rounded-xl transition-colors ${
            tombol === "kuning"
              ? "bg-brand-yellow text-brand-navy hover:bg-white"
              : "bg-brand-navy text-white hover:bg-brand-navy-dark"
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </form>
    );
  }

  return (
    <form method="get" action={action} role="search" className={`flex w-full gap-2 ${className}`}>
      <label className="sr-only" htmlFor={inputId}>
        {placeholder}
      </label>
      <input
        id={inputId}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete="off"
        className="min-h-[44px] w-full rounded-pill border border-brand-navy/15 bg-white px-5 text-sm text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
      />
      <button type="submit" className="btn-red shrink-0">
        {buttonLabel}
      </button>
    </form>
  );
}
