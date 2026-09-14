"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, dateLocaleTag, uiText, type Locale } from "@/lib/i18n";

/** Satu acara, sudah diratakan dari dokumen Payload. */
export type AcaraTampil = {
  judul: string;
  kategori: string;
  poster?: string;
  /** ISO string dari field `tanggal`. */
  tanggal: string;
  waktu?: string;
  format: string;
  lokasi?: string;
  /** Kosong = acara eksklusif, tombol Daftar tidak dirender. */
  tautanDaftar?: string;
};

const ZONA = "Asia/Jakarta";

const labelKategori: Record<Locale, Record<string, string>> = {
  id: {
    webinar: "Webinar",
    pelatihan: "Pelatihan",
    workshop: "Workshop",
    klubBuku: "Klub Buku",
    seminar: "Seminar",
  },
  en: {
    webinar: "Webinar",
    pelatihan: "Training",
    workshop: "Workshop",
    klubBuku: "Book Club",
    seminar: "Seminar",
  },
};

const labelFormat: Record<Locale, Record<string, string>> = {
  id: { online: "Online", offline: "Tatap Muka", hybrid: "Hybrid" },
  en: { online: "Online", offline: "In-person", hybrid: "Hybrid" },
};

/** Warna pil kategori + latar kartu tanpa poster, mengikuti rujukan desain. */
const warnaKategori: Record<string, { pil: string; latar: string }> = {
  webinar: { pil: "bg-brand-navy text-white", latar: "bg-brand-navy/[0.04]" },
  pelatihan: { pil: "bg-brand-yellow text-brand-navy", latar: "bg-brand-yellow/10" },
  workshop: { pil: "bg-brand-red text-white", latar: "bg-brand-red/[0.04]" },
  klubBuku: { pil: "bg-brand-blue text-white", latar: "bg-brand-blue/[0.05]" },
  seminar: {
    pil: "border border-brand-navy bg-white text-brand-navy",
    latar: "bg-surface",
  },
};
const warnaBawaan = warnaKategori.webinar;

/**
 * Batas akhir hari acara (23:59:59 WIB) dalam milidetik. Tanggal dari Payload
 * disimpan sebagai waktu UTC, jadi harinya dibaca ulang di zona Jakarta dulu —
 * tanpa itu acara pukul 00.00 WIB bisa tergeser ke hari sebelumnya.
 */
function akhirHari(iso: string): number {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA }).format(new Date(iso));
  return Date.parse(`${ymd}T23:59:59+07:00`);
}

function TombolDaftar({ href, label }: { href: string; label: string }) {
  const kelas =
    "inline-flex items-center justify-center rounded-pill border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2";

  // Formulir situs sendiri tetap di tab yang sama; Google Form di tab baru.
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={kelas}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={kelas}>
      {label}
    </a>
  );
}

function KartuAcara({
  acara,
  selesai,
  locale,
}: {
  acara: AcaraTampil;
  selesai: boolean;
  locale: Locale;
}) {
  const t = uiText[locale];
  const warna = warnaKategori[acara.kategori] ?? warnaBawaan;
  const tanggal = new Intl.DateTimeFormat(dateLocaleTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONA,
  }).format(new Date(acara.tanggal));
  const bisaDaftar = Boolean(acara.tautanDaftar) && !selesai;

  const kepala = (
    <div className="flex items-center justify-between gap-3">
      <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${warna.pil}`}>
        {labelKategori[locale][acara.kategori] ?? acara.kategori}
      </span>
      <span className={`text-xs font-semibold ${selesai ? "text-muted" : "text-brand-red"}`}>
        {selesai ? t.eventDone : t.eventUpcoming}
      </span>
    </div>
  );

  const rincian = (
    <>
      <h3 className="mt-4 text-base font-bold leading-snug text-brand-navy">{acara.judul}</h3>
      <p className="mt-3 text-sm text-body">
        {tanggal}
        {acara.waktu && (
          <>
            <br />
            {acara.waktu}
          </>
        )}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-body">
        <span aria-hidden="true" className="text-brand-navy">
          ★
        </span>
        {labelFormat[locale][acara.format] ?? acara.format}
      </p>
      {acara.lokasi && <p className="mt-1 pl-5 text-xs text-muted">{acara.lokasi}</p>}
      {bisaDaftar && acara.tautanDaftar && (
        <div className="mt-auto pt-5">
          <TombolDaftar href={acara.tautanDaftar} label={t.eventRegister} />
        </div>
      )}
    </>
  );

  if (acara.poster) {
    return (
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-surface shadow-soft">
          <Image
            src={acara.poster}
            alt={acara.judul}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col pt-5">
          {kepala}
          {rincian}
        </div>
      </article>
    );
  }

  return (
    <article className={`flex h-full flex-col rounded-card p-6 shadow-soft ${warna.latar}`}>
      {kepala}
      {rincian}
    </article>
  );
}

/**
 * Jadwal acara di halaman Belajar Bersama — kartu berposter bila posternya
 * ada, kotak berwarna per kategori bila tidak. Keduanya bisa bercampur di satu
 * grid; kotak tanpa poster meregang setinggi barisnya supaya tombol tetap
 * sejajar.
 *
 * Status "akan datang/selesai" dihitung ulang di browser: halaman ini
 * di-render statis, sehingga patokan dari server (`patokan`) bisa berumur
 * berhari-hari. Nilai server tetap dipakai untuk render pertama agar hasil
 * hidrasi sama, lalu diganti jam pengunjung setelah mount.
 */
export function JadwalAcara({
  acara,
  patokan,
  locale = DEFAULT_LOCALE,
  batasAwal,
  sembunyikanSelesai = false,
}: {
  acara: AcaraTampil[];
  patokan: number;
  locale?: Locale;
  batasAwal?: number;
  sembunyikanSelesai?: boolean;
}) {
  const [sekarang, setSekarang] = useState(patokan);
  const [terbuka, setTerbuka] = useState(false);

  useEffect(() => setSekarang(Date.now()), []);

  const berstatus = acara.map((a) => ({ a, selesai: akhirHari(a.tanggal) < sekarang }));
  const akanDatang = berstatus
    .filter((x) => !x.selesai)
    .sort((x, y) => Date.parse(x.a.tanggal) - Date.parse(y.a.tanggal));
  const selesai = sembunyikanSelesai
    ? []
    : berstatus
        .filter((x) => x.selesai)
        .sort((x, y) => Date.parse(y.a.tanggal) - Date.parse(x.a.tanggal));
  const urut = [...akanDatang, ...selesai];

  if (urut.length === 0) return null;

  const batas = batasAwal && batasAwal > 0 ? batasAwal : urut.length;
  const tampil = terbuka ? urut : urut.slice(0, batas);
  const sisa = urut.length - batas;
  const t = uiText[locale];

  return (
    <div>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {tampil.map(({ a, selesai: s }, i) => (
          <KartuAcara key={`${a.judul}-${a.tanggal}-${i}`} acara={a} selesai={s} locale={locale} />
        ))}
      </div>

      {sisa > 0 && (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={() => setTerbuka((v) => !v)} className="btn-outline">
            {terbuka ? t.teamShowLess : `${t.eventShowMore} (+${sisa})`}
          </button>
        </div>
      )}
    </div>
  );
}
