/**
 * Isi field `penulis` (disusun oleh) di koleksi `produk` dgn ekstraksi
 * heuristik dari teks halaman pertama tiap PDF asli di Google Drive.
 *
 * Beda dgn `seed-produk-drive.mts`: skrip itu cuma pernah menyentuh
 * thumbnail (gambar) halaman pertama, tidak pernah membaca ISI PDF-nya.
 * Skrip ini yang pertama benar-benar mengunduh byte PDF asli & membaca
 * teksnya (lewat `unpdf`).
 *
 * Ini ekstraksi HEURISTIK, bukan 100% akurat — sebagian PDF tidak mencantumkan
 * nama penulis dgn format yang bisa ditebak, sebagian lagi bisa salah tangkap.
 * `penulis` tidak pernah ditimpa ulang skrip lain sesudah diisi (sama seperti
 * `ringkasan`), jadi hasil yang salah aman dikoreksi manual lewat dasbor kapan
 * saja — lihat docs/RENCANA-INTEGRASI-DRIVE.md §6.
 *
 * Jalankan:
 *   npm run backfill:penulis-drive -- --dry-run --batas=5   (uji dulu)
 *   npm run backfill:penulis-drive                            (jalan penuh)
 *
 * Pilihan:
 *   --dry-run     jangan tulis ke database, cuma tampilkan & laporkan hasil
 *   --batas=<n>   proses n dokumen pertama saja (untuk uji cepat)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { extractText, getDocumentProxy } from "unpdf";

// Muat .env sebelum payload.config di-import.
for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;

const DIR = path.dirname(fileURLToPath(import.meta.url));
const LAPORAN = path.join(DIR, "data-penulis-extraction-report.json");

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const batas = Number(argv.find((a) => a.startsWith("--batas="))?.split("=")[1] ?? 0);

/** Sama persis dgn `ambilDriveId()` di `src/lib/actions/unduh-materi.ts`. */
function ambilDriveId(tautan: string): string | null {
  return tautan.match(/\/d\/([A-Za-z0-9_-]{10,})/)?.[1] ?? null;
}

/**
 * Pola umum penulis di PDF materi Gernas Tastaka, mis. "Disusun oleh: Ida
 * Hariani, S. Pd" atau baris gaya "Ida Hariani, S.Pd – SDN 5 Semende Darat
 * Ulu". Kalau tidak ketemu jelas, dibiarkan kosong — jangan menebak-nebak.
 */
function bersihkanUjung(teks: string): string {
  return teks.trim().replace(/\s+/g, " ").replace(/[\s,;.\-–]+$/, "");
}

function cariPenulis(teks: string): string | null {
  const label = teks.match(/(?:disusun\s+oleh|penulis)\s*[:\-–]?\s*([^\n]{3,100})/i);
  if (label) return bersihkanUjung(label[1]);

  const gelar = teks.match(/([A-Z][A-Za-z.'\s]{2,60},\s*S\.?\s?Pd\.?[^\n]{0,80})/);
  if (gelar) return bersihkanUjung(gelar[1]);

  return null;
}

async function unduhTeksHalamanPertama(driveId: string): Promise<string> {
  const res = await fetch(`https://drive.google.com/uc?export=download&id=${driveId}`);
  if (!res.ok) throw new Error(`unduh gagal: HTTP ${res.status}`);

  const buf = new Uint8Array(await res.arrayBuffer());
  const magic = Buffer.from(buf.slice(0, 5)).toString("latin1");
  if (magic !== "%PDF-") {
    throw new Error("respons bukan PDF (kemungkinan interstitial Drive utk berkas besar)");
  }

  const pdf = await getDocumentProxy(buf);
  const { text } = await extractText(pdf, { mergePages: false });
  return text[0] ?? "";
}

type BarisLaporan = {
  slug: string;
  judul: string;
  driveId: string;
  ditemukan: boolean;
  penulis: string | null;
  gagal?: string;
};

const payload = await getPayload({ config });

const res = await payload.find({
  collection: "produk",
  where: { tautanDrive: { exists: true } },
  limit: 500,
  pagination: false,
  depth: 0,
});

const daftar = batas > 0 ? res.docs.slice(0, batas) : res.docs;
console.log(`Memproses ${daftar.length} dari ${res.docs.length} dokumen produk.${dryRun ? " (dry-run — tidak menulis ke database)" : ""}\n`);

const laporan: BarisLaporan[] = [];
let ditemukan = 0;
let gagal = 0;

for (const [i, doc] of daftar.entries()) {
  const nomor = `[${String(i + 1).padStart(2)}/${daftar.length}]`;
  const driveId = doc.tautanDrive ? ambilDriveId(doc.tautanDrive) : null;

  if (!driveId) {
    console.log(`${nomor} ✗  ${doc.judul} — tidak bisa mengambil file id dari tautanDrive`);
    laporan.push({ slug: doc.slug, judul: doc.judul, driveId: "", ditemukan: false, penulis: null, gagal: "file id tidak ditemukan" });
    gagal++;
    continue;
  }

  try {
    const teks = await unduhTeksHalamanPertama(driveId);
    const penulis = cariPenulis(teks);

    if (penulis) {
      ditemukan++;
      console.log(`${nomor} ✓  ${doc.judul} — "${penulis}"`);
      if (!dryRun) {
        await payload.update({ collection: "produk", id: doc.id, data: { penulis } });
      }
    } else {
      console.log(`${nomor} –  ${doc.judul} — tidak ada pola penulis yang cocok`);
    }

    laporan.push({ slug: doc.slug, judul: doc.judul, driveId, ditemukan: Boolean(penulis), penulis });
  } catch (err) {
    gagal++;
    const pesan = (err as Error).message;
    console.log(`${nomor} ✗  ${doc.judul} — ${pesan}`);
    laporan.push({ slug: doc.slug, judul: doc.judul, driveId, ditemukan: false, penulis: null, gagal: pesan });
  }
}

fs.writeFileSync(LAPORAN, JSON.stringify(laporan, null, 2));

console.log(`\n${"─".repeat(52)}`);
console.log(`Ditemukan: ${ditemukan}   Gagal diproses: ${gagal}   Tidak cocok: ${daftar.length - ditemukan - gagal}`);
console.log(`Laporan lengkap: ${path.relative(process.cwd(), LAPORAN)}`);

process.exit(0);
