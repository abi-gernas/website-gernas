"use server";

import { payloadPromise } from "@/lib/payload";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

/**
 * Gerbang unduhan materi gratis (PRD Fase 2 v1.2 FR-104).
 *
 * Pengunjung mengisi nama + asal instansi (kontak opsional), datanya masuk ke
 * koleksi `leads` sbg `jenis: "unduhan-materi"`, baru tautan Drive-nya
 * dikembalikan.
 *
 * **Ini gerbang longgar, dan itu disengaja.** Berkas Drive-nya publik
 * ("siapa saja yang punya tautan") — keputusan user 7 Sep 2026, ditukar dengan
 * tidak perlu memelihara kredensial Google sama sekali. Artinya siapa pun yang
 * mau repot bisa memanggil action ini dengan data karangan, dan tautan yang
 * sudah keluar bisa disebarkan ke mana saja. Yang dicegah gerbang ini cuma
 * pengambilan tanpa sengaja: tautannya tidak ada di HTML halaman, jadi jalan
 * normal menuju berkas memang lewat formulir.
 *
 * Kalau suatu saat itu tidak cukup, yang harus berubah bukan action ini
 * melainkan status berkasnya di Drive — lihat docs/RENCANA-INTEGRASI-DRIVE.md
 * §4–§5 (service account + unduhan di-stream lewat situs).
 */

export type HasilBukaMateri =
  | { ok: true; tautanDrive: string; driveId: string | null }
  | { ok: false; pesan: "data-kurang" | "tidak-ditemukan" | "tanpa-tautan" | "gagal" };

export type DataPengunjung = {
  nama: string;
  asalInstansi: string;
  kontak?: string;
};

/** Batas panjang input — bukan validasi serius, cuma pagar agar kolom teks tidak dibanjiri. */
const MAKS = 200;

function bersihkan(nilai: unknown): string {
  return typeof nilai === "string" ? nilai.trim().slice(0, MAKS) : "";
}

/** `https://drive.google.com/file/d/<id>/view?...` -> `<id>`, untuk URL pratinjau. */
function ambilDriveId(tautan: string): string | null {
  return tautan.match(/\/d\/([A-Za-z0-9_-]{10,})/)?.[1] ?? null;
}

export async function bukaMateri(
  slug: string,
  data: DataPengunjung,
  locale: Locale = DEFAULT_LOCALE,
): Promise<HasilBukaMateri> {
  const nama = bersihkan(data.nama);
  const asalInstansi = bersihkan(data.asalInstansi);
  const kontak = bersihkan(data.kontak);

  if (!slug || !nama || !asalInstansi) return { ok: false, pesan: "data-kurang" };

  try {
    const payload = await payloadPromise;

    const res = await payload.find({
      collection: "produk",
      where: { slug: { equals: slug } },
      limit: 1,
      pagination: false,
      depth: 0,
    });

    const produk = res.docs[0];
    if (!produk) return { ok: false, pesan: "tidak-ditemukan" };

    // Materi berbayar tidak lewat gerbang ini — tombolnya "Beli Sekarang",
    // dan alur pembayarannya sendiri masih menunggu OI-105.
    if (produk.status === "berbayar" || !produk.tautanDrive) {
      return { ok: false, pesan: "tanpa-tautan" };
    }

    // Kontak opsional: kalau berisi "@" diperlakukan sbg email, selain itu
    // sbg nomor telepon. Menebak begini jauh lebih ramah daripada memaksa
    // pengunjung memilih jenis kontaknya sendiri di formulir.
    const kontakEmail = kontak.includes("@");

    await payload.create({
      collection: "leads",
      data: {
        jenis: "unduhan-materi",
        name: nama,
        asalInstansi,
        email: kontakEmail ? kontak : undefined,
        phone: kontak && !kontakEmail ? kontak : undefined,
        produkRef: produk.id,
        locale: LOCALES.includes(locale) ? locale : DEFAULT_LOCALE,
        subject: `Unduhan materi: ${produk.judul}`,
      },
    });

    return {
      ok: true,
      tautanDrive: produk.tautanDrive,
      driveId: ambilDriveId(produk.tautanDrive),
    };
  } catch (err) {
    // Pencatatan lead gagal tidak boleh terlihat sbg materi rusak, tapi juga
    // tidak boleh diam-diam melewati gerbangnya — jadi dilaporkan sbg gagal
    // dan pengunjung diminta mencoba lagi.
    console.error("[bukaMateri] gagal:", err);
    return { ok: false, pesan: "gagal" };
  }
}
