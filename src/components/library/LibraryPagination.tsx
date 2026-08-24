import Link from "next/link";
import { withParam, type LibrarySearchParams } from "@/lib/library";

/** Nomor halaman + elipsis: selalu tampilkan halaman 1, halaman terakhir, dan 1 tetangga tiap sisi dari halaman aktif. */
function pageWindow(page: number, totalPages: number): (number | "...")[] {
  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("...");
    result.push(p);
    prev = p;
  }
  return result;
}

export function LibraryPagination({
  page,
  totalPages,
  searchParams,
  locale = "id",
}: {
  page: number;
  totalPages: number;
  searchParams: LibrarySearchParams;
  locale?: "id" | "en";
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => withParam(searchParams, { page: p === 1 ? undefined : String(p) }) || "?";
  const prevLabel = locale === "en" ? "Previous" : "Sebelumnya";
  const nextLabel = locale === "en" ? "Next" : "Berikutnya";

  return (
    <nav aria-label={locale === "en" ? "Pagination" : "Navigasi halaman"} className="flex items-center justify-center gap-1.5">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`flex h-10 min-w-[44px] items-center justify-center rounded-pill px-3 text-sm font-semibold ${
          page <= 1
            ? "pointer-events-none text-muted/50"
            : "text-brand-navy hover:bg-brand-navy/5"
        }`}
      >
        {prevLabel}
      </Link>

      {pageWindow(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-10 min-w-[44px] items-center justify-center rounded-pill px-3 text-sm font-semibold ${
              p === page
                ? "bg-brand-red text-white"
                : "text-brand-navy hover:bg-brand-navy/5"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`flex h-10 min-w-[44px] items-center justify-center rounded-pill px-3 text-sm font-semibold ${
          page >= totalPages
            ? "pointer-events-none text-muted/50"
            : "text-brand-navy hover:bg-brand-navy/5"
        }`}
      >
        {nextLabel}
      </Link>
    </nav>
  );
}
