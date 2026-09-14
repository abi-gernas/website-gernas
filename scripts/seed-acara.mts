/**
 * Isi koleksi `acara` (Jadwal Acara) dengan poster acara terdahulu — Bincang
 * Gernas, Klub Buku Gernas Tastaba, dan kegiatan PRPIC.
 *
 * Sumber: poster yang dikirim tim lewat WhatsApp (10 Sep 2026), disalin ke
 * `scripts/aset-poster-acara/`. Tanggal, waktu, format, lokasi, dan tautan
 * pendaftaran ditranskrip dari posternya.
 *
 * Jalankan:  npm run seed:acara
 *
 * Aman diulang: poster dikenali lewat `legacyPath` Media ("poster-acara:<berkas>")
 * dan acara lewat relasi ke poster itu — yang sudah ada diperbarui, bukan
 * diduplikasi.
 *
 * Catatan isi:
 * - Poster "Apakah Sudah Asin?" tertulis "Rabu, 22 April 2025", padahal
 *   22 April 2025 jatuh hari Selasa; 22 April 2026 hari Rabu, dan nomor
 *   tautannya (klubbukutastaba8) persis sebelum Klub Buku #9 (Mei 2026).
 *   Jadi dianggap salah ketik tahun dan diisi 2026.
 * - Tanggal disimpan pukul 12.00 WIB supaya tidak bergeser hari saat dibaca
 *   di zona waktu lain.
 */
import fs from "fs";
import path from "path";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;

type EntriAcara = {
  berkas: string;
  judul: string;
  judulEn: string;
  kategori: "webinar" | "pelatihan" | "workshop" | "klubBuku" | "seminar";
  tanggal: string; // YYYY-MM-DD (WIB)
  waktu: string;
  format: "online" | "offline" | "hybrid";
  lokasi?: string;
  tautanDaftar?: string;
};

const DATA: EntriAcara[] = [
  {
    berkas: "2026-04-22-klub-buku-apakah-sudah-asin.jpg",
    judul: "Klub Buku — Apakah Sudah Asin?",
    judulEn: "Book Club — Apakah Sudah Asin?",
    kategori: "klubBuku",
    tanggal: "2026-04-22",
    waktu: "19.00 - 20.30 WIB",
    format: "online",
    tautanDaftar: "https://bit.ly/klubbukutastaba8",
  },
  {
    berkas: "2026-04-27-bincang-gernas-40.jpg",
    judul: "Bincang Gernas #40 — Kesadaran Cetak dan Cara Menggunakan Buku",
    judulEn: "Bincang Gernas #40 — Print Awareness and How to Use Books",
    kategori: "webinar",
    tanggal: "2026-04-27",
    waktu: "19.00 - 21.00 WIB",
    format: "online",
    tautanDaftar: "https://bit.ly/bincangernas40",
  },
  {
    berkas: "2026-05-25-bincang-gernas-41.jpg",
    judul: "Bincang Gernas #41 — Pengenalan Bangun Datar",
    judulEn: "Bincang Gernas #41 — Introduction to Plane Shapes",
    kategori: "webinar",
    tanggal: "2026-05-25",
    waktu: "19.00 WIB",
    format: "online",
    tautanDaftar: "https://bit.ly/bincangernas41",
  },
  {
    berkas: "2026-05-30-klub-buku-pahlawan-sampah-elektronik.jpg",
    judul: "Klub Buku Gernas Tastaba & Indorelawan — Pahlawan Sampah Elektronik",
    judulEn: "Gernas Tastaba & Indorelawan Book Club — Pahlawan Sampah Elektronik",
    kategori: "klubBuku",
    tanggal: "2026-05-30",
    waktu: "10.00 - 12.00 WIB",
    format: "offline",
    lokasi: "Kantor Indorelawan, Jakarta",
    tautanDaftar: "https://bit.ly/klubbukutastaba9",
  },
  {
    berkas: "2026-06-29-bincang-gernas-42.jpg",
    judul: "Bincang Gernas #42 — Kesadaran Fonologi",
    judulEn: "Bincang Gernas #42 — Phonological Awareness",
    kategori: "webinar",
    tanggal: "2026-06-29",
    waktu: "19.00 - 21.00 WIB",
    format: "online",
    tautanDaftar: "https://bit.ly/bincangernas42",
  },
  {
    berkas: "2026-07-15-klub-buku-kaus-kaki-bebek-bercerita.jpg",
    judul: "Klub Buku — Kaus Kaki Bebek Bercerita",
    judulEn: "Book Club — Kaus Kaki Bebek Bercerita",
    kategori: "klubBuku",
    tanggal: "2026-07-15",
    waktu: "19.00 - 20.30 WIB",
    format: "online",
    tautanDaftar: "https://bit.ly/klubbukutastaba10",
  },
  {
    berkas: "2026-07-23-selapanan-prpic-ahmad-rizali.jpg",
    judul: "Selapanan PRPIC bersama Ahmad Rizali",
    judulEn: "Selapanan PRPIC with Ahmad Rizali",
    kategori: "seminar",
    tanggal: "2026-07-23",
    waktu: "19.30 - 20.30 WIB",
    format: "online",
    tautanDaftar: "https://prpic.id/selapanan",
  },
  {
    berkas: "2026-08-15-prpic-research-sharing-session.jpg",
    judul: "Research Sharing Session — Updates of Research in Mathematics Education",
    judulEn: "Research Sharing Session — Updates of Research in Mathematics Education",
    kategori: "seminar",
    tanggal: "2026-08-15",
    waktu: "10.00 - 12.00 WIB",
    format: "offline",
    lokasi: "Kantor Gernas Tastaka, Depok",
    tautanDaftar: "https://bit.ly/PRPIC1",
  },
  {
    berkas: "2026-08-24-bincang-gernas-43.jpg",
    judul: "Bincang Gernas #43 — Geometri: Simetri Lipat",
    judulEn: "Bincang Gernas #43 — Geometry: Line Symmetry",
    kategori: "webinar",
    tanggal: "2026-08-24",
    waktu: "19.00 WIB",
    format: "online",
    tautanDaftar: "https://bit.ly/bincangernas43",
  },
  {
    berkas: "2026-08-28-selapanan-prpic-deshinta.jpg",
    judul:
      "Selapanan PRPIC — Understanding the Gernastastaka's Framework of Professional Development in Geometry",
    judulEn:
      "Selapanan PRPIC — Understanding the Gernastastaka's Framework of Professional Development in Geometry",
    kategori: "seminar",
    tanggal: "2026-08-28",
    waktu: "19.00 WIB",
    format: "online",
    tautanDaftar: "https://prpic.id/selapanan",
  },
  {
    berkas: "2026-09-12-klub-buku-komponis-kecil.jpg",
    judul: "Klub Buku Gernas Tastaba — Komponis Kecil",
    judulEn: "Gernas Tastaba Book Club — Komponis Kecil",
    kategori: "klubBuku",
    tanggal: "2026-09-12",
    waktu: "10.00 - 12.00 WIB",
    format: "offline",
    lokasi: "Ruang Belajar Alex Tilaar, Jakarta Pusat",
    tautanDaftar: "https://bit.ly/klubbukutastaba11",
  },
];

const DIR = path.resolve("scripts/aset-poster-acara");
const payload = await getPayload({ config });

async function pastikanPoster(e: EntriAcara): Promise<number | string> {
  const legacyPath = `poster-acara:${e.berkas}`;
  const ada = await payload.find({
    collection: "media",
    where: { legacyPath: { equals: legacyPath } },
    limit: 1,
    pagination: false,
    depth: 0,
  });
  if (ada.docs.length > 0) return ada.docs[0].id;

  const buf = fs.readFileSync(path.join(DIR, e.berkas));
  const doc = await payload.create({
    collection: "media",
    data: { alt: `Poster ${e.judul}`, legacyPath },
    file: { data: buf, name: `poster-${e.berkas}`, mimetype: "image/jpeg", size: buf.length },
  });
  return doc.id;
}

let gagal = 0;
for (const e of DATA) {
  try {
    const poster = await pastikanPoster(e);
    const tanggal = new Date(`${e.tanggal}T12:00:00+07:00`).toISOString();
    const data = {
      judul: e.judul,
      kategori: e.kategori,
      poster,
      tanggal,
      waktu: e.waktu,
      format: e.format,
      lokasi: e.lokasi ?? null,
      tautanDaftar: e.tautanDaftar ?? null,
    };

    const ada = await payload.find({
      collection: "acara",
      where: { poster: { equals: poster } },
      limit: 1,
      pagination: false,
      depth: 0,
      locale: "id",
    });

    const id = ada.docs.length
      ? (await payload.update({ collection: "acara", id: ada.docs[0].id, data, locale: "id" })).id
      : (await payload.create({ collection: "acara", data, locale: "id" })).id;

    // Hanya field `judul` yang localized; update locale "en" tidak menyentuh versi "id".
    await payload.update({ collection: "acara", id, data: { judul: e.judulEn }, locale: "en" });
    console.log(`✓ ${e.tanggal} ${e.judul}`);
  } catch (err) {
    gagal++;
    console.error(`✗ ${e.judul}:`, err instanceof Error ? err.message : err);
  }
}

console.log(`Selesai: ${DATA.length - gagal} berhasil, ${gagal} gagal.`);
process.exit(gagal > 0 ? 1 : 0);
