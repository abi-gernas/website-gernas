import type { Locale } from "@/lib/i18n";

/**
 * Form pencarian GET biasa (tanpa JS) — submit menulis ulang query param `q`
 * di URL saat ini. Dipakai 4 halaman Library, lihat
 * `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §2.3.
 *
 * Dua tampilan:
 * - `pill` (bawaan) — input pil + tombol teks "Cari", dipakai 3 halaman lama.
 * - `kotak` — input kotak + tombol persegi berikon kaca pembesar, mengikuti
 *   mockup Buku/Bahan Ajar/Modul. Tiga halaman lama belum ikut diubah ke
 *   tampilan ini karena mockup masing-masing belum ditinjau ulang (lihat
 *   temuan QA 26 Agu di §5 rencana eksekusi).
 */
export function LibrarySearchBar({
  defaultValue = "",
  placeholder,
  locale = "id",
  variant = "pill",
}: {
  defaultValue?: string;
  placeholder: string;
  locale?: Locale;
  variant?: "pill" | "kotak";
}) {
  const buttonLabel = locale === "en" ? "Search" : "Cari";

  if (variant === "kotak") {
    return (
      <form method="get" className="flex w-full max-w-xl gap-3">
        <label className="sr-only" htmlFor="library-search-q">
          {placeholder}
        </label>
        <input
          id="library-search-q"
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="min-h-[48px] w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-sm text-ink shadow-soft placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        />
        <button
          type="submit"
          aria-label={buttonLabel}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white transition-colors hover:bg-brand-navy-dark"
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
    <form method="get" className="flex w-full max-w-xl gap-2">
      <label className="sr-only" htmlFor="library-search-q">
        {placeholder}
      </label>
      <input
        id="library-search-q"
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-h-[44px] w-full rounded-pill border border-brand-navy/15 bg-white px-5 text-sm text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
      />
      <button type="submit" className="btn-red shrink-0">
        {buttonLabel}
      </button>
    </form>
  );
}
