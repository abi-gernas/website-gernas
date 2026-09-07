"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { kirimUlasan } from "@/lib/actions/kirim-ulasan";

/**
 * Formulir ulasan/rating — cuma dirender di dalam state "hasil" milik
 * `UnduhMateriGate`, jadi selalu sesudah pengunjung berhasil membuka materi.
 *
 * Status "sudah kirim" diingat per materi di `localStorage` supaya tidak
 * ditanya ulang tiap kali membuka materi yang sama (pola sama dengan
 * `gernas-pengunjung` di `UnduhMateriGate`).
 */

const KUNCI_PREFIX = "gernas-ulasan-";

const text = {
  id: {
    ajakan: "Sudah pakai materi ini? Bagikan penilaian Anda",
    nama: "Nama",
    namaPlaceholder: "Nama Anda",
    komentar: "Komentar",
    komentarOpsional: "opsional",
    komentarPlaceholder: "Bagaimana pengalaman Anda memakai materi ini?",
    kirim: "Kirim Ulasan",
    mengirim: "Mengirim…",
    terkirim: "Terima kasih! Ulasan Anda akan tampil sesudah ditinjau tim kami.",
    galat: {
      "data-kurang": "Nama dan rating bintang wajib diisi.",
      "tidak-ditemukan": "Materi tidak ditemukan. Coba muat ulang halaman.",
      gagal: "Gagal mengirim ulasan. Coba lagi sebentar lagi.",
    },
  },
  en: {
    ajakan: "Used this material? Share your rating",
    nama: "Name",
    namaPlaceholder: "Your name",
    komentar: "Comment",
    komentarOpsional: "optional",
    komentarPlaceholder: "How was your experience using this material?",
    kirim: "Submit Review",
    mengirim: "Submitting…",
    terkirim: "Thank you! Your review will appear once our team reviews it.",
    galat: {
      "data-kurang": "Name and star rating are required.",
      "tidak-ditemukan": "Material not found. Try reloading the page.",
      gagal: "Couldn't submit your review. Please try again shortly.",
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;

type Status = "idle" | "mengirim" | "terkirim";

export function FormUlasan({
  slug,
  namaAwal,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  namaAwal?: string;
  locale?: Locale;
}) {
  const t = text[locale];
  const kunci = `${KUNCI_PREFIX}${slug}`;
  const [status, setStatus] = useState<Status>("idle");
  const [galat, setGalat] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [nama, setNama] = useState(namaAwal ?? "");
  const [komentar, setKomentar] = useState("");

  useEffect(() => {
    try {
      if (localStorage.getItem(kunci)) setStatus("terkirim");
    } catch {
      // Mode penyamaran / storage diblokir — tidak apa, cuma berarti bisa ditanya lagi.
    }
  }, [kunci]);

  if (status === "terkirim") {
    return <p className="text-sm text-muted">{t.terkirim}</p>;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("mengirim");
    setGalat(null);

    const res = await kirimUlasan(slug, { nama, rating, komentar }, locale);

    if (!res.ok) {
      setStatus("idle");
      setGalat(t.galat[res.pesan]);
      return;
    }

    try {
      localStorage.setItem(kunci, "1");
    } catch {
      // Tidak apa-apa — cuma berarti bisa ditanya lagi lain kali.
    }
    setStatus("terkirim");
  };

  return (
    <form onSubmit={onSubmit} className="rounded-card bg-surface p-5">
      <p className="text-sm font-bold text-brand-navy">{t.ajakan}</p>

      <div className="mt-3 flex gap-1" role="radiogroup" aria-label={t.ajakan}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={String(n)}
            onClick={() => setRating(n)}
            disabled={status === "mengirim"}
            className={`text-2xl leading-none ${n <= rating ? "text-brand-yellow-dark" : "text-brand-navy/20"}`}
          >
            ★
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor="uf-nama" className="text-xs font-medium text-muted">
            {t.nama} <span className="text-brand-red">*</span>
          </label>
          <input
            id="uf-nama"
            className="mt-1 w-full min-h-[44px] rounded-lg border border-brand-navy/20 bg-white px-3 py-2 text-sm text-brand-navy placeholder-muted outline-none focus:border-brand-navy disabled:opacity-60"
            placeholder={t.namaPlaceholder}
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            disabled={status === "mengirim"}
            required
          />
        </div>

        <div>
          <label htmlFor="uf-komentar" className="text-xs font-medium text-muted">
            {t.komentar} <span className="font-normal">({t.komentarOpsional})</span>
          </label>
          <textarea
            id="uf-komentar"
            rows={3}
            className="mt-1 w-full rounded-lg border border-brand-navy/20 bg-white px-3 py-2 text-sm text-brand-navy placeholder-muted outline-none focus:border-brand-navy disabled:opacity-60"
            placeholder={t.komentarPlaceholder}
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            disabled={status === "mengirim"}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-outline mt-4 disabled:opacity-60"
        disabled={status === "mengirim" || rating === 0}
      >
        {status === "mengirim" ? t.mengirim : t.kirim}
      </button>

      {galat && (
        <p role="alert" className="mt-3 text-sm text-brand-red">
          {galat}
        </p>
      )}
    </form>
  );
}
