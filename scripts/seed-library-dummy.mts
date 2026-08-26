/**
 * Isi data dummy untuk QA visual 4 koleksi Library Materi Guru yang masih
 * kosong di DB: `alat-peraga`, `media-interaktif`, `video-pembelajaran`,
 * dan `produk` (Buku, Bahan Ajar & Modul).
 *
 * Jalankan:  npm run seed:library-dummy
 *   (jalankan seed:media dulu — skrip ini pakai dokumen Media yang sudah ada
 *   sbg cover/thumbnail, bukan upload berkas baru)
 *
 * Tujuan: 18 dokumen per koleksi (>12, biar `LibraryPagination` ke-test ke
 * halaman 2) dengan variasi jenjang/mapel/tags/kategori supaya filter,
 * "Pencarian Populer", dan kartu kategori bisa dicoba dgn data asli. Lihat catatan TODO di
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

// Sampul dummy koleksi `produk` (Buku, Bahan Ajar & Modul) dikecualikan dari
// round-robin di atas: sejak 26 Agu 2026 semuanya dipaksa memakai satu berkas
// logo Gernas Tastaka atas permintaan user, supaya sampul data QA seragam dan
// jelas terbaca sbg dummy — bukan foto acak yang bisa disalahsangka konten asli.
const LOGO_DUMMY_FILENAME = "cropped-Logo_GernasTastaka-01-300x124.webp";

const logoDocs = await payload.find({
  collection: "media",
  where: { filename: { equals: LOGO_DUMMY_FILENAME } },
  limit: 1,
  pagination: false,
  depth: 0,
});

if (logoDocs.docs.length === 0) {
  console.error(
    `Dokumen Media "${LOGO_DUMMY_FILENAME}" tidak ditemukan di DB — sampul dummy produk butuh berkas itu. Unggah dulu lewat dasbor.`,
  );
  process.exit(1);
}

const coverProduk = logoDocs.docs[0].id;

/** Sama seperti `sudahAda`, tapi mengembalikan dokumennya supaya bisa ditambal. */
async function cariDoc(collection: string, judul: string) {
  const res = await payload.find({
    collection: collection as never,
    where: { judul: { equals: judul } },
    limit: 1,
    pagination: false,
    depth: 0,
  });
  return res.docs[0] as { id: number | string; cover?: unknown } | undefined;
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
      deskripsi: `Deskripsi dummy video pembelajaran #${i + 1} untuk keperluan QA halaman detail (pemutar video, tag, dan video lainnya).`,
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

// Tambal dokumen video lama: `deskripsi` baru ditambahkan ke skema 26 Agu
// 2026 (bersama `slug`), jadi 18 dokumen QA yang sudah ada belum punya isinya
// dan halaman detailnya tampil tanpa teks apa pun.
let ditambalVideoPembelajaran = 0;
{
  const lama = await payload.find({
    collection: "video-pembelajaran",
    where: { judul: { like: PREFIX } },
    limit: 100,
    pagination: false,
    depth: 0,
  });
  for (const doc of lama.docs) {
    if (doc.deskripsi) continue;
    await payload.update({
      collection: "video-pembelajaran",
      id: doc.id,
      data: {
        deskripsi: `Deskripsi dummy untuk ${doc.judul} — keperluan QA halaman detail (pemutar video, tag, dan video lainnya).`,
      },
    });
    ditambalVideoPembelajaran++;
  }
}

// ── 4. Buku, Bahan Ajar & Modul / `produk` (18 dokumen) ─────────────────────
// Variasi kategori (4 kartu kategori), format, dan gratis/berbayar supaya
// kartu katalog & filter `?kategori=` di halaman Buku ke-test semua cabangnya.

const KATEGORI = ["modul", "buku", "bahan-ajar", "lks"] as const;

const JUDUL_PRODUK: Record<(typeof KATEGORI)[number], string[]> = {
  modul: ["Modul Numerasi Dasar", "Modul Literasi Awal", "Modul Pembelajaran Bermakna"],
  buku: ["Buku Aku Seorang Qari", "Buku Panduan Guru Tastaka", "Buku Cerita Bergambar"],
  "bahan-ajar": ["Bahan Ajar Pecahan", "Bahan Ajar Fonik", "Bahan Ajar Bangun Datar"],
  lks: ["LKS Fonik", "LKS Operasi Hitung", "Worksheet Membaca Nyaring"],
};

let dibuatProduk = 0;
let sampulProdukDiperbarui = 0;
for (let i = 0; i < 18; i++) {
  const kategori = KATEGORI[i % KATEGORI.length];
  const daftarJudul = JUDUL_PRODUK[kategori];
  const judul = `${PREFIX}${daftarJudul[i % daftarJudul.length]} #${String(i + 1).padStart(2, "0")}`;

  // Dokumen dummy yang sudah ada dari sesi sebelumnya tetap ditambal sampulnya
  // ke logo — kalau tidak, aturan sampul baru cuma berlaku di DB yang kosong.
  const lama = await cariDoc("produk", judul);
  if (lama) {
    if (lama.cover !== coverProduk) {
      await payload.update({ collection: "produk", id: lama.id, data: { cover: coverProduk } });
      sampulProdukDiperbarui++;
    }
    continue;
  }

  const jenjang = pickJenjang(i);
  // i === 0 dipaksa berbayar: itu produk sematan yang tampil di panel "Produk
  // Terbaru", dan mockup memperlihatkan tombol "Beli Sekarang!" di sana.
  const berbayar = i === 0 || i % 3 !== 0;
  const format = i % 2 === 0 ? ["pdf"] : ["pdf", "cetak"];

  await payload.create({
    collection: "produk",
    data: {
      judul,
      kategoriProduk: kategori,
      jenjang,
      mapel: pickMapel(i),
      cover: coverProduk,
      ringkasan: `untuk jenjang ${jenjang.map((j) => JENJANG_LABEL[j]).join("/")} — deskripsi dummy produk #${i + 1} untuk QA tampilan katalog.`,
      // Cuma produk sematan (urutan terkecil) yang butuh daftar fitur: itu
      // satu-satunya yang tampil di panel "Produk Terbaru".
      fiturUnggulan:
        i === 0
          ? [
              { teks: "40 kegiatan bertahap" },
              { teks: "Panduan guru lengkap" },
              { teks: "Ilustrasi menarik & berwarna" },
              { teks: "Siap digunakan di kelas" },
            ]
          : [],
      format,
      status: berbayar ? "berbayar" : "gratis",
      harga: berbayar ? 20000 + (i % 5) * 5000 : undefined,
      tautanDrive: berbayar ? undefined : `https://drive.google.com/drive/folders/dummy-produk-${i + 1}`,
      urutan: i,
    },
  });
  dibuatProduk++;
}

console.log(`Alat Peraga: dibuat ${dibuatAlatPeraga} (lewati ${18 - dibuatAlatPeraga} sudah ada)`);
console.log(
  `Media Interaktif: dibuat ${dibuatMediaInteraktif} (lewati ${18 - dibuatMediaInteraktif} sudah ada)`,
);
console.log(
  `Video Pembelajaran: dibuat ${dibuatVideoPembelajaran} (lewati ${18 - dibuatVideoPembelajaran} sudah ada), deskripsi ditambal ${ditambalVideoPembelajaran}`,
);
console.log(
  `Produk (Buku/Bahan Ajar/Modul): dibuat ${dibuatProduk} (lewati ${18 - dibuatProduk} sudah ada, sampul ditambal ke logo ${sampulProdukDiperbarui})`,
);
console.log("\nSelesai. Hapus data ini kapan saja lewat dasbor — cari judul berawalan “[QA] ”.");

process.exit(0);
