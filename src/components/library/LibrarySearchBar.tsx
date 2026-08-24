import type { Locale } from "@/lib/i18n";

/**
 * Form pencarian GET biasa (tanpa JS) — submit menulis ulang query param `q`
 * di URL saat ini. Dipakai 4 halaman Library, lihat
 * `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §2.3.
 */
export function LibrarySearchBar({
  defaultValue = "",
  placeholder,
  locale = "id",
}: {
  defaultValue?: string;
  placeholder: string;
  locale?: Locale;
}) {
  const buttonLabel = locale === "en" ? "Search" : "Cari";

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
