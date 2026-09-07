"use client";

import { useState } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

/**
 * Tombol berbagi materi: WhatsApp, Facebook, dan salin tautan.
 *
 * **Yang dibagikan adalah alamat halaman materi di situs, bukan tautan
 * Drive-nya.** Itu disengaja: penerima ikut mendarat di halaman yang punya
 * formulir pendataan + CTA donasi, jadi berbagi tidak menjadi jalan pintas
 * yang melewati keduanya.
 *
 * Instagram sengaja tidak ada. Instagram tidak menyediakan alamat berbagi
 * yang bisa mengisi caption dari luar aplikasi (tidak ada padanan
 * `wa.me/?text=` atau `facebook.com/sharer`), jadi tombol berlogo Instagram
 * paling banter cuma bisa menyalin tautan diam-diam lalu membuka
 * instagram.com — kelihatan berfungsi padahal tidak. Keputusan user
 * 7 Sep 2026: lebih baik tidak ada daripada menipu.
 */
const text = {
  id: {
    judul: "Bagikan materi ini",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    salin: "Salin tautan",
    tersalin: "Tautan tersalin",
    gagalSalin: "Gagal menyalin — silakan salin manual dari alamat browser.",
  },
  en: {
    judul: "Share this material",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    salin: "Copy link",
    tersalin: "Link copied",
    gagalSalin: "Couldn't copy — please copy it from the address bar.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function TombolBagikan({
  url,
  judul,
  locale = DEFAULT_LOCALE,
}: {
  url: string;
  judul: string;
  locale?: Locale;
}) {
  const t = text[locale];
  const [salin, setSalin] = useState<"idle" | "ok" | "gagal">("idle");

  const pesan = locale === "en" ? `${judul} — free teaching material from Gernas Tastaka` : `${judul} — materi ajar gratis dari Gernas Tastaka`;

  const waHref = `https://wa.me/?text=${encodeURIComponent(`${pesan}\n${url}`)}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const onSalin = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setSalin("ok");
      setTimeout(() => setSalin("idle"), 2500);
    } catch {
      setSalin("gagal");
    }
  };

  const tombol =
    "inline-flex min-h-[40px] items-center gap-2 rounded-full border border-brand-navy/15 px-4 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-navy/40 hover:bg-brand-navy/5";

  return (
    <div>
      <p className="text-sm font-bold text-brand-navy">{t.judul}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={waHref} target="_blank" rel="noopener noreferrer" className={tombol}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.04s.87 2.37 1 2.53c.12.17 1.72 2.62 4.16 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29z" />
          </svg>
          {t.whatsapp}
        </a>

        <a href={fbHref} target="_blank" rel="noopener noreferrer" className={tombol}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z" />
          </svg>
          {t.facebook}
        </a>

        <button type="button" onClick={onSalin} className={tombol}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1 1" />
            <path d="M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l1-1" />
          </svg>
          {salin === "ok" ? t.tersalin : t.salin}
        </button>
      </div>

      {salin === "gagal" && (
        <p role="alert" className="mt-2 text-xs text-brand-red">
          {t.gagalSalin}
        </p>
      )}
    </div>
  );
}
