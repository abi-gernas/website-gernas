/**
 * Isi data dummy untuk QA visual 3 koleksi Library Materi Guru yang masih
 * kosong di DB: `alat-peraga`, `media-interaktif`, `video-pembelajaran`.
 * (`produk`/Buku-Bahan Ajar-Modul belum punya halaman, jadi belum diseed.)
 *
 * Jalankan:  npm run seed:library-dummy
 *   (jalankan seed:media dulu — skrip ini pakai dokumen Media yang sudah ada
 *   sbg cover/thumbnail, bukan upload berkas baru)
 *
 * Tujuan: 18 dokumen per koleksi (>12, biar `LibraryPagination` ke-test ke
 * halaman 2) dengan variasi jenjang/mapel/tags supaya filter & "Pencarian
 * Populer" bisa dicoba dgn data asli. Lihat catatan TODO di
 * docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md §5 (entri 24 Agu 2026, poin 6).
 *
 * Aman diulang: tiap dokumen dummy ditandai judul berawalan "[QA] " dan
 * dicek dulu sebelum dibuat — yang sudah ada dilewati. Hapus dokumen mana pun
 * yang judulnya diawali "[QA] " di dasbor kapan saja untuk membersihkan.
 */
import fs from "fs";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;

const payload = await getPayload({ config });

const PREFIX = "[QA] ";

// ── Media yang dipakai sbg cover/thumbnail dummy ────────────────────────────
// Skrip ini tidak upload berkas baru — pakai ulang dokumen Media yang sudah
// ada (round-robin) supaya field upload wajib (cover/thumbnail) terisi valid.

const mediaDocs = await payload.find({
  collection: "media",
  where: { mimeType: { contains: "image" } },
  limit: 50,
  pagination: false,
});

if (mediaDocs.docs.length === 0) {
  console.error(
    "Tidak ada dokumen Media (gambar) di DB. Jalankan `npm run seed:media` dulu sebelum skrip ini.",
  );
  process.exit(1);
}

const mediaIds = mediaDocs.docs.map((d) => d.id);
function mediaAt(i: number) {
  return mediaIds[i % mediaIds.length];
}

const JENJANG = ["paud", "tk", "sd", "smp", "sma"] as const;
const MAPEL = ["matematika", "membaca"] as const;

function pickJenjang(i: number): string[] {
  // variasi 1–2 jenjang per dokumen, geser berdasarkan index
  const a = JENJANG[i % JENJANG.length];
  const b = JENJANG[(i + 2) % JENJANG.length];
  return a === b ? [a] : [a, b];
}

function pickMapel(i: number): string[] {
  return i % 3 === 0 ? [...MAPEL] : [MAPEL[i % MAPEL.length]];
}

const JENJANG_LABEL: Record<string, string> = {
  paud: "PAUD",
  tk: "TK",
  sd: "SD",
  smp: "SMP",
  sma: "SMA",
};

async function sudahAda(collection: string, judul: string) {
  const res = await payload.find({
    collection: collection as never,
    where: { judul: { equals: judul } },
    limit: 1,
    pagination: false,
  });
  return res.docs.length > 0;
}

// ── 1. Alat Peraga (18 dokumen) ─────────────────────────────────────────────

let dibuatAlatPeraga = 0;
for (let i = 0; i < 18; i++) {
  const judul = `${PREFIX}Alat Peraga Dummy #${String(i + 1).padStart(2, "0")}`;
  if (await sudahAda("alat-peraga", judul)) continue;

  const jenjang = pickJenjang(i);
  await payload.create({
    collection: "alat-peraga",
    data: {
      judul,
      subjudul: `Untuk jenjang ${jenjang.map((j) => JENJANG_LABEL[j]).join("/")}`,
      jenjang,
      mapel: pickMapel(i),
      cover: mediaAt(i),
      deskripsi: `Deskripsi dummy alat peraga #${i + 1} untuk keperluan QA tampilan grid, filter, dan pagination.`,
      isiPaket: [
        { teks: "Item contoh 1" },
        { teks: "Item contoh 2" },
        { teks: "Item contoh 3" },
      ],
      urutan: i,
    },
  });
  dibuatAlatPeraga++;
}

// ── 2. Media Digital Interaktif (18 dokumen) ────────────────────────────────

const TAG_POOL = [
  "Numerasi",
  "Literasi",
  "Interaktif",
  "Game",
  "Kuis",
  "SD",
  "SMP",
  "Simulasi",
];

let dibuatMediaInteraktif = 0;
for (let i = 0; i < 18; i++) {
  const judul = `${PREFIX}Media Interaktif Dummy #${String(i + 1).padStart(2, "0")}`;
  if (await sudahAda("media-interaktif", judul)) continue;

  const tags = [TAG_POOL[i % TAG_POOL.length], TAG_POOL[(i + 3) % TAG_POOL.length]];
  await payload.create({
    collection: "media-interaktif",
    data: {
      judul,
      deskripsi: `Deskripsi dummy media interaktif #${i + 1} untuk keperluan QA tampilan list, tag populer, dan pagination.`,
      thumbnail: mediaAt(i + 5),
      tags: tags.map((label) => ({ label })),
      tautan: `https://example.com/media-interaktif-dummy-${i + 1}`,
      urutan: i,
    },
  });
  dibuatMediaInteraktif++;
}

// ── 3. Video Pembelajaran (18 dokumen) ──────────────────────────────────────

const YOUTUBE_CONTOH = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

let dibuatVideoPembelajaran = 0;
for (let i = 0; i < 18; i++) {
  const judul = `${PREFIX}Video Pembelajaran Dummy #${String(i + 1).padStart(2, "0")}`;
  if (await sudahAda("video-pembelajaran", judul)) continue;

  const jenjang = pickJenjang(i);
  const menit = 5 + (i % 20);
  const detik = (i * 7) % 60;
  await payload.create({
    collection: "video-pembelajaran",
    data: {
      judul,
      thumbnail: mediaAt(i + 10),
      jenjang,
      mapel: pickMapel(i),
      sumberTipe: "youtube",
      tautanYoutube: YOUTUBE_CONTOH,
      durasi: `${menit}:${String(detik).padStart(2, "0")}`,
      urutan: i,
    },
  });
  dibuatVideoPembelajaran++;
}

console.log(`Alat Peraga: dibuat ${dibuatAlatPeraga} (lewati ${18 - dibuatAlatPeraga} sudah ada)`);
console.log(
  `Media Interaktif: dibuat ${dibuatMediaInteraktif} (lewati ${18 - dibuatMediaInteraktif} sudah ada)`,
);
console.log(
  `Video Pembelajaran: dibuat ${dibuatVideoPembelajaran} (lewati ${18 - dibuatVideoPembelajaran} sudah ada)`,
);
console.log("\nSelesai. Hapus data ini kapan saja lewat dasbor — cari judul berawalan “[QA] ”.");

process.exit(0);
