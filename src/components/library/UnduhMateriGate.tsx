"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { bukaMateri, type DataPengunjung } from "@/lib/actions/unduh-materi";
import { TombolBagikan } from "./TombolBagikan";
import { FormUlasan } from "./FormUlasan";

/**
 * Gerbang pendataan sebelum unduh/pratinjau materi gratis (FR-104).
 *
 * Alur: pengunjung baru lihat tombol "Unduh Gratis" dulu (meniru pola
 * referensi produk — harga + tombol aksi menonjol, tanpa formulir kelihatan)
 * → baru sesudah diklik formulir nama + asal instansi (kontak opsional)
 * muncul sbg pop-up → data masuk ke Pesan Masuk → tombol Unduh & Pratinjau muncul,
 * ditemani CTA donasi dan tombol berbagi. Pengunjung yang datanya sudah
 * tersimpan melewati tombol gate ini — satu klik langsung membuka materi.
 *
 * Data pengunjung diingat di `localStorage` supaya materi berikutnya tidak
 * menuntut isi ulang — tapi **tiap pembukaan tetap dicatat** sbg lead baru,
 * jadi staf tetap tahu materi mana saja yang diambil, bukan cuma bahwa
 * orangnya pernah mengunduh sesuatu (keputusan user 7 Sep 2026).
 *
 * Tautan Drive-nya tidak pernah ikut ter-render di HTML halaman — baru datang
 * dari server sesudah `bukaMateri()` dipanggil. Lihat catatan soal batas
 * gerbang ini di `src/lib/actions/unduh-materi.ts`.
 */

const KUNCI_SIMPAN = "gernas-pengunjung";

const text = {
  id: {
    ajakan: "Isi data singkat untuk membuka materi",
    alasan:
      "Materi ini gratis. Data ini membantu kami tahu materi mana yang paling dibutuhkan guru — kami tidak mengirim spam.",
    nama: "Nama",
    namaPlaceholder: "Nama lengkap",
    instansi: "Asal instansi/sekolah/daerah",
    instansiPlaceholder: "mis. SDN 5 Semende Darat Ulu",
    kontak: "Email atau nomor HP",
    kontakOpsional: "opsional",
    kontakPlaceholder: "nama@email.com atau +62…",
    kirim: "Buka Materi",
    mengirim: "Membuka…",
    tutup: "Tutup",
    sebagai: (nama: string) => `Anda mengisi data sebagai ${nama}.`,
    ganti: "Ganti data",
    bukaLagi: "Unduh Gratis",
    membuka: "Menyiapkan…",
    unduh: "Unduh Gratis",
    pratinjau: "Pratinjau",
    tutupPratinjau: "Tutup pratinjau",
    siap: "Materi siap diunduh.",
    donasiJudul: "Materi ini gratis berkat dukungan donatur",
    donasiTeks:
      "Kalau materi ini bermanfaat, dukungan Anda membantu kami menyusun dan membagikan materi berikutnya.",
    belumAdaTautan: "Tautan unduhan belum tersedia. Silakan hubungi tim kami.",
    galat: {
      "data-kurang": "Nama dan asal instansi wajib diisi.",
      "tidak-ditemukan": "Materi tidak ditemukan. Coba muat ulang halaman.",
      "tanpa-tautan": "Tautan unduhan belum tersedia. Silakan hubungi tim kami.",
      gagal: "Gagal membuka materi. Coba lagi sebentar lagi.",
    },
  },
  en: {
    ajakan: "Fill in a few details to unlock this material",
    alasan:
      "This material is free. These details help us learn which materials teachers need most — we don't send spam.",
    nama: "Name",
    namaPlaceholder: "Full name",
    instansi: "School/institution/region",
    instansiPlaceholder: "e.g. SDN 5 Semende Darat Ulu",
    kontak: "Email or phone number",
    kontakOpsional: "optional",
    kontakPlaceholder: "name@email.com or +62…",
    kirim: "Unlock Material",
    mengirim: "Unlocking…",
    tutup: "Close",
    sebagai: (nama: string) => `You filled this in as ${nama}.`,
    ganti: "Change details",
    bukaLagi: "Download Free",
    membuka: "Preparing…",
    unduh: "Download Free",
    pratinjau: "Preview",
    tutupPratinjau: "Close preview",
    siap: "The material is ready to download.",
    donasiJudul: "This material is free thanks to our donors",
    donasiTeks:
      "If you found it useful, your support helps us create and share the next one.",
    belumAdaTautan: "The download link isn't available yet. Please contact our team.",
    galat: {
      "data-kurang": "Name and institution are required.",
      "tidak-ditemukan": "Material not found. Try reloading the page.",
      "tanpa-tautan": "The download link isn't available yet. Please contact our team.",
      gagal: "Couldn't unlock the material. Please try again shortly.",
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;

type Status = "idle" | "mengirim";

function bacaSimpanan(): DataPengunjung | null {
  try {
    const mentah = localStorage.getItem(KUNCI_SIMPAN);
    if (!mentah) return null;
    const data = JSON.parse(mentah) as Partial<DataPengunjung>;
    if (!data.nama || !data.asalInstansi) return null;
    return { nama: data.nama, asalInstansi: data.asalInstansi, kontak: data.kontak };
  } catch {
    // Mode penyamaran / storage diblokir — perlakukan sbg pengunjung baru.
    return null;
  }
}

export function UnduhMateriGate({
  slug,
  judul,
  punyaTautan,
  urlHalaman,
  donasi,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  judul: string;
  punyaTautan: boolean;
  urlHalaman: string;
  donasi: { label: string; href: string } | null;
  locale?: Locale;
}) {
  const t = text[locale];
  const [tersimpan, setTersimpan] = useState<DataPengunjung | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [galat, setGalat] = useState<string | null>(null);
  const [hasil, setHasil] = useState<{ tautanDrive: string; driveId: string | null } | null>(null);
  const [pratinjau, setPratinjau] = useState(false);
  const [modalBuka, setModalBuka] = useState(false);
  const [f, setF] = useState({ nama: "", asalInstansi: "", kontak: "" });
  const inputPertama = useRef<HTMLInputElement>(null);

  // localStorage cuma ada di browser — dibaca sesudah hidrasi supaya HTML
  // server & klien tetap sama (kalau tidak, React akan protes hydration).
  useEffect(() => {
    setTersimpan(bacaSimpanan());
  }, []);

  const mengirim = status === "mengirim";

  // Pop-up formulir: kunci scroll halaman, fokus ke kolom pertama, Esc menutup,
  // dan fokus dikembalikan ke tombol pemicu sesudah ditutup.
  useEffect(() => {
    if (!modalBuka) return;
    const pemicu = document.activeElement as HTMLElement | null;
    const overflowLama = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputPertama.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalBuka(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflowLama;
      window.removeEventListener("keydown", onKey);
      pemicu?.focus();
    };
  }, [modalBuka]);

  if (!punyaTautan) {
    return <p className="text-sm text-muted">{t.belumAdaTautan}</p>;
  }

  const kirim = async (data: DataPengunjung) => {
    setStatus("mengirim");
    setGalat(null);

    const res = await bukaMateri(slug, data, locale);

    if (!res.ok) {
      setStatus("idle");
      setGalat(t.galat[res.pesan]);
      return;
    }

    try {
      localStorage.setItem(KUNCI_SIMPAN, JSON.stringify(data));
    } catch {
      // Tidak apa-apa — cuma berarti materi berikutnya minta isi ulang.
    }
    setTersimpan(data);
    setModalBuka(false);
    setStatus("idle");
    setHasil({ tautanDrive: res.tautanDrive, driveId: res.driveId });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void kirim({ nama: f.nama, asalInstansi: f.asalInstansi, kontak: f.kontak });
  };

  const field =
    "mt-1 w-full min-h-[44px] rounded-lg border border-brand-navy/20 bg-white px-3 py-2 text-sm text-brand-navy placeholder-muted outline-none focus:border-brand-navy disabled:opacity-60";

  // ── Sudah terbuka: tombol aksi + donasi + bagikan ─────────────────────────
  if (hasil) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted">{t.siap}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={hasil.tautanDrive}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red"
            >
              {t.unduh}
            </a>
            {hasil.driveId && (
              <button type="button" onClick={() => setPratinjau(true)} className="btn-outline">
                {t.pratinjau}
              </button>
            )}
          </div>
        </div>

        {donasi && (
          <div className="rounded-card bg-brand-yellow/15 p-5">
            <p className="text-sm font-bold text-brand-navy">{t.donasiJudul}</p>
            <p className="mt-1 text-sm text-body">{t.donasiTeks}</p>
            <Link href={donasi.href} className="btn-yellow mt-4 inline-flex">
              {donasi.label}
            </Link>
          </div>
        )}

        <TombolBagikan url={urlHalaman} judul={judul} locale={locale} />

        <FormUlasan slug={slug} namaAwal={tersimpan?.nama} locale={locale} />

        {pratinjau && hasil.driveId && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={judul}
            className="fixed inset-0 z-50 flex flex-col bg-brand-navy/80 p-4 sm:p-8"
            onClick={() => setPratinjau(false)}
          >
            <div
              className="mx-auto flex h-full w-full max-w-4xl flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPratinjau(false)}
                className="mb-3 self-end rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-navy"
              >
                {t.tutupPratinjau}
              </button>
              <iframe
                src={`https://drive.google.com/file/d/${hasil.driveId}/preview`}
                title={judul}
                allow="autoplay"
                className="h-full w-full rounded-card bg-white"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  const bukaModal = () => {
    setGalat(null);
    setModalBuka(true);
  };

  // ── Pop-up formulir pendataan ─────────────────────────────────────────────
  // Di-portal ke <body> supaya tidak terpotong/tertimpa header yang juga z-50.
  const modal =
    modalBuka &&
    createPortal(
      <div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-brand-navy/70 p-0 sm:items-center sm:p-6"
        onClick={() => !mengirim && setModalBuka(false)}
      >
        <form
          role="dialog"
          aria-modal="true"
          aria-labelledby="ug-judul"
          onSubmit={onSubmit}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-card bg-white p-5 shadow-soft sm:max-w-md sm:rounded-card sm:p-6"
        >
          <button
            type="button"
            onClick={() => setModalBuka(false)}
            disabled={mengirim}
            aria-label={t.tutup}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-xl leading-none text-muted hover:bg-brand-navy/5 hover:text-brand-navy disabled:opacity-40"
          >
            ×
          </button>

          <p id="ug-judul" className="pr-10 text-base font-bold text-brand-navy">
            {t.ajakan}
          </p>
          <p className="mt-1 pr-6 text-xs leading-relaxed text-muted">{t.alasan}</p>

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="ug-nama" className="text-xs font-medium text-muted">
                {t.nama} <span className="text-brand-red">*</span>
              </label>
              <input
                ref={inputPertama}
                id="ug-nama"
                name="name"
                autoComplete="name"
                className={field}
                placeholder={t.namaPlaceholder}
                value={f.nama}
                onChange={(e) => setF({ ...f, nama: e.target.value })}
                disabled={mengirim}
                required
              />
            </div>

            <div>
              <label htmlFor="ug-instansi" className="text-xs font-medium text-muted">
                {t.instansi} <span className="text-brand-red">*</span>
              </label>
              <input
                id="ug-instansi"
                name="organization"
                autoComplete="organization"
                className={field}
                placeholder={t.instansiPlaceholder}
                value={f.asalInstansi}
                onChange={(e) => setF({ ...f, asalInstansi: e.target.value })}
                disabled={mengirim}
                required
              />
            </div>

            <div>
              <label htmlFor="ug-kontak" className="text-xs font-medium text-muted">
                {t.kontak} <span className="font-normal">({t.kontakOpsional})</span>
              </label>
              <input
                id="ug-kontak"
                name="email"
                autoComplete="email"
                spellCheck={false}
                className={field}
                placeholder={t.kontakPlaceholder}
                value={f.kontak}
                onChange={(e) => setF({ ...f, kontak: e.target.value })}
                disabled={mengirim}
              />
            </div>
          </div>

          <button type="submit" className="btn-red mt-5 w-full disabled:opacity-60" disabled={mengirim}>
            {mengirim ? t.mengirim : t.kirim}
          </button>

          {galat && (
            <p role="alert" className="mt-3 text-sm text-brand-red">
              {galat}
            </p>
          )}
        </form>
      </div>,
      document.body,
    );

  // ── Pernah mengisi: cukup satu tombol, tapi tetap dicatat ─────────────────
  if (tersimpan) {
    return (
      <div>
        <button
          type="button"
          onClick={() => void kirim(tersimpan)}
          disabled={mengirim}
          className="btn-red disabled:opacity-60"
        >
          {mengirim && !modalBuka ? t.membuka : t.bukaLagi}
        </button>
        <p className="mt-2 text-xs text-muted">
          {t.sebagai(tersimpan.nama)}{" "}
          <button
            type="button"
            onClick={() => {
              setF({
                nama: tersimpan.nama,
                asalInstansi: tersimpan.asalInstansi,
                kontak: tersimpan.kontak ?? "",
              });
              bukaModal();
            }}
            className="font-semibold text-brand-red underline"
          >
            {t.ganti}
          </button>
        </p>
        {galat && !modalBuka && (
          <p role="alert" className="mt-2 text-sm text-brand-red">
            {galat}
          </p>
        )}
        {modal}
      </div>
    );
  }

  // ── Pengunjung baru: tombol saja (meniru referensi — harga + tombol aksi
  // menonjol); formulir pendataan baru muncul sbg pop-up sesudah diklik.
  return (
    <>
      <button type="button" onClick={bukaModal} className="btn-red">
        {t.unduh}
      </button>
      {modal}
    </>
  );
}
