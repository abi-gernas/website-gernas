"use client";

import { useState } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

const text = {
  id: { lebih: "Baca selengkapnya", kurang: "Tutup" },
  en: { lebih: "Read more", kurang: "Show less" },
} satisfies Record<Locale, Record<string, string>>;

/** Teks panjang (ringkasan produk) yg bisa di-collapse/expand pengunjung. */
export function DeskripsiExpandable({
  teks,
  locale = DEFAULT_LOCALE,
}: {
  teks: string;
  locale?: Locale;
}) {
  const t = text[locale];
  const [terbuka, setTerbuka] = useState(false);

  return (
    <div>
      <p
        className={`whitespace-pre-line text-sm leading-relaxed text-body sm:text-base ${
          terbuka ? "" : "line-clamp-4"
        }`}
      >
        {teks}
      </p>
      <button
        type="button"
        onClick={() => setTerbuka((v) => !v)}
        aria-expanded={terbuka}
        className="mt-2 text-sm font-semibold text-brand-red"
      >
        {terbuka ? t.kurang : t.lebih}
      </button>
    </div>
  );
}
