/**
 * Impor aset hasil migrasi WordPress (public/media) ke koleksi Media Payload,
 * tersimpan di Supabase Storage dan dikonversi ke WebP.
 *
 * Jalankan:  npm run seed:media
 *
 * Aman diulang: berkas yang sudah pernah diimpor dilewati, dikenali lewat
 * field `legacyPath`. Berkas asli di public/media tidak diubah maupun dihapus —
 * tetap menjadi cadangan.
 */
import fs from "fs";
import path from "path";

// Muat .env sebelum payload.config di-import.
for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;

const MEDIA_DIR = "public/media";
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

/** "Program-Timah-Mengajar" -> "Program Timah Mengajar" sebagai alt awal. */
function altFromFilename(file: string): string {
  return path
    .basename(file, path.extname(file))
    .replace(/-\d+x\d+$/, "") // buang sufiks ukuran WordPress
    .replace(/^[0-9a-f]{32,}$/i, "") // hash murni -> kosongkan
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const payload = await getPayload({ config });

const files = fs
  .readdirSync(MEDIA_DIR)
  .filter((f) => MIME[path.extname(f).toLowerCase()])
  .sort();

console.log(`Ditemukan ${files.length} berkas di ${MEDIA_DIR}\n`);

let dibuat = 0;
let dilewati = 0;
let gagal = 0;
let byteSebelum = 0;
let byteSesudah = 0;

for (const [i, file] of files.entries()) {
  const legacyPath = `/media/${file}`;
  const nomor = `[${String(i + 1).padStart(3)}/${files.length}]`;

  const sudahAda = await payload.find({
    collection: "media",
    where: { legacyPath: { equals: legacyPath } },
    limit: 1,
    pagination: false,
  });

  if (sudahAda.docs.length > 0) {
    dilewati++;
    console.log(`${nomor} ⏭  ${file} — sudah ada`);
    continue;
  }

  const full = path.join(MEDIA_DIR, file);
  const buf = fs.readFileSync(full);

  try {
    const doc = (await payload.create({
      collection: "media",
      data: { alt: altFromFilename(file), legacyPath },
      file: {
        data: buf,
        name: file,
        mimetype: MIME[path.extname(file).toLowerCase()],
        size: buf.length,
      },
    })) as { filesize?: number };

    dibuat++;
    byteSebelum += buf.length;
    byteSesudah += doc.filesize ?? 0;

    const kb = (n: number) => `${(n / 1024).toFixed(0)}KB`;
    console.log(`${nomor} ✓  ${file} — ${kb(buf.length)} → ${kb(doc.filesize ?? 0)}`);
  } catch (err) {
    gagal++;
    console.log(`${nomor} ✗  ${file} — ${(err as Error).message}`);
  }
}

const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;
console.log(`\n${"─".repeat(52)}`);
console.log(`Dibuat: ${dibuat}   Dilewati: ${dilewati}   Gagal: ${gagal}`);
if (dibuat > 0) {
  const hemat = 100 - (byteSesudah / byteSebelum) * 100;
  console.log(
    `Ukuran berkas induk: ${mb(byteSebelum)} → ${mb(byteSesudah)} (hemat ${hemat.toFixed(0)}%)`,
  );
  console.log("Catatan: angka di atas belum termasuk ukuran turunan.");
}

process.exit(gagal > 0 ? 1 : 0);
