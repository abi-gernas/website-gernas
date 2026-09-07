/**
 * Ambil daftar berkas dari folder Google Drive "Konten" dan tulis hasilnya ke
 * `scripts/data-produk-drive.json`.
 *
 * Jalankan:  npm run drive:fetch
 *
 * Kenapa dipisah dari skrip seed: hasil crawl-nya di-commit sebagai JSON,
 * jadi `npm run seed:produk-drive` bisa jalan tanpa jaringan dan perubahan isi
 * Drive terlihat sebagai diff yang bisa ditinjau sebelum masuk ke database.
 *
 * CATATAN PENTING — endpoint `embeddedfolderview` bukan API resmi Google.
 * Dia dipakai di sini karena tidak butuh OAuth (folder Drive-nya berbagi
 * "siapa saja yang punya tautan"), cocok sebagai jalan pintas sampai
 * integrasi Drive API resmi (OI-108) selesai. Kalau suatu saat endpoint ini
 * berubah/berhenti, ganti `ambilIsiFolder()` dengan
 * `files.list?q='<folderId>' in parents` dari Drive API v3 — bentuk
 * keluarannya sengaja dibuat sama. Lihat docs/RENCANA-INTEGRASI-DRIVE.md.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(DIR, "data-produk-drive.json");

/** Folder "Konten" milik gernastastaka.online@gmail.com (akses: siapa saja yang punya tautan). */
const FOLDER_AKAR = "1ucyEM7NXmqJhQyNtnuNqZCePno37VF86";

/**
 * Pemetaan nama folder di Drive -> nilai field `topik` di koleksi `produk`.
 *
 * Sengaja eksplisit, bukan di-slugify otomatis dari nama folder: nama folder
 * di Drive diawali nomor ("1. Geometri") dan bisa diubah pemiliknya kapan
 * saja, sedangkan nilai `topik` terikat kontrak dengan `options` di
 * `src/payload/collections/Produk.ts` dan dengan URL `?topik=` di situs.
 * Kalau ada folder baru di Drive, tambahkan barisnya di sini dulu — skrip
 * akan berhenti dengan pesan jelas kalau menemukan folder yang belum dipetakan.
 */
const PETA_TOPIK: Record<string, string> = {
  "1. Geometri": "geometri",
  "2. Bilangan Cacah": "bilangan-cacah",
  "3. Pecahan": "pecahan",
  "4. Bilangan Bulat": "bilangan-bulat",
  "5. Statistika": "statistika",
  "6. Pengukuran": "pengukuran",
};

/**
 * Berkas di folder akar yang sengaja tidak ikut jadi produk.
 *
 * "Pak Yadi.pdf" isinya #CeritaKelas (pengalaman Pak Oktoriyadi, SDN 10
 * Sengkuang Kuning) — itu bahan artikel, bukan bahan ajar, jadi tidak boleh
 * masuk katalog. Kalau nanti dijadikan artikel, hapus barisnya dari sini.
 */
const DILEWATI = new Set(["Pak Yadi.pdf"]);

type BerkasDrive = { id: string; nama: string };

async function ambilIsiFolder(folderId: string): Promise<BerkasDrive[]> {
  const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${folderId}#list`);
  if (!res.ok) {
    throw new Error(`Gagal membaca folder ${folderId}: HTTP ${res.status}`);
  }
  const html = await res.text();

  const hasil: BerkasDrive[] = [];
  const pola = /id="entry-([^"]+)"[\s\S]*?flip-entry-title">([^<]*)</g;
  let cocok: RegExpExecArray | null;
  while ((cocok = pola.exec(html))) {
    hasil.push({ id: cocok[1], nama: decodeEntity(cocok[2]).trim() });
  }
  return hasil;
}

/** Judul berkas di HTML Drive di-escape (`&amp;`, `&#39;`, dst.). */
function decodeEntity(teks: string): string {
  return teks
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, kode: string) => String.fromCharCode(Number(kode)));
}

/** "10. Membuat Kubus.pdf" -> { nomor: 10, judul: "Membuat Kubus" }. */
function uraikanNama(nama: string): { nomor: number; judul: string } {
  const tanpaEkstensi = nama.replace(/\.pdf$/i, "");
  const cocok = tanpaEkstensi.match(/^(\d+)\.\s*(.+)$/);
  if (!cocok) return { nomor: 999, judul: tanpaEkstensi.trim() };
  return { nomor: Number(cocok[1]), judul: cocok[2].trim() };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Crawl ───────────────────────────────────────────────────────────────────

const isiAkar = await ambilIsiFolder(FOLDER_AKAR);
if (isiAkar.length === 0) {
  console.error(
    `Folder akar ${FOLDER_AKAR} terbaca kosong. Pastikan aksesnya masih "siapa saja yang punya tautan".`,
  );
  process.exit(1);
}

const belumDipetakan = isiAkar
  .filter((f) => !f.nama.toLowerCase().endsWith(".pdf"))
  .filter((f) => !(f.nama in PETA_TOPIK))
  .map((f) => f.nama);

if (belumDipetakan.length > 0) {
  console.error(
    `Folder berikut belum ada di PETA_TOPIK — tambahkan dulu di skrip ini (dan di options field "topik" pada Produk.ts):\n  - ${belumDipetakan.join("\n  - ")}`,
  );
  process.exit(1);
}

const berkasAkarTerlewat = isiAkar
  .filter((f) => f.nama.toLowerCase().endsWith(".pdf") && !DILEWATI.has(f.nama))
  .map((f) => f.nama);

if (berkasAkarTerlewat.length > 0) {
  console.warn(
    `Peringatan: ada PDF di folder akar yang tidak masuk topik mana pun dan tidak ada di daftar DILEWATI:\n  - ${berkasAkarTerlewat.join("\n  - ")}`,
  );
}

type EntriProduk = {
  topik: string;
  namaFolder: string;
  driveId: string;
  namaBerkas: string;
  judul: string;
  slug: string;
  urutan: number;
  tautanDrive: string;
  thumbnail: string;
};

const entri: EntriProduk[] = [];
const slugTerpakai = new Set<string>();

for (const [namaFolder, topik] of Object.entries(PETA_TOPIK)) {
  const folder = isiAkar.find((f) => f.nama === namaFolder);
  if (!folder) {
    console.error(`Folder "${namaFolder}" tidak ditemukan di Drive. Sudah dihapus/diganti nama?`);
    process.exit(1);
  }

  const berkas = await ambilIsiFolder(folder.id);
  const pdf = berkas.filter((b) => b.nama.toLowerCase().endsWith(".pdf"));

  const bukanPdf = berkas.filter((b) => !b.nama.toLowerCase().endsWith(".pdf"));
  if (bukanPdf.length > 0) {
    console.warn(
      `Peringatan: "${namaFolder}" berisi ${bukanPdf.length} item non-PDF yang dilewati (${bukanPdf.map((b) => b.nama).join(", ")}).`,
    );
  }

  for (const b of pdf) {
    const { nomor, judul } = uraikanNama(b.nama);

    // Slug diberi awalan topik: judul kegiatan tidak dijamin unik antar topik
    // (mis. ada "Alat Peraga.pdf" yang namanya generik), sedangkan `slug` di
    // koleksi `produk` bertanda `unique`.
    let slug = `${topik}-${slugify(judul)}`;
    if (slugTerpakai.has(slug)) slug = `${slug}-${nomor}`;
    slugTerpakai.add(slug);

    entri.push({
      topik,
      namaFolder,
      driveId: b.id,
      namaBerkas: b.nama,
      judul,
      slug,
      urutan: nomor,
      tautanDrive: `https://drive.google.com/file/d/${b.id}/view?usp=sharing`,
      // Halaman pertama PDF sbg gambar — dipakai skrip seed jadi sampul produk.
      thumbnail: `https://drive.google.com/thumbnail?id=${b.id}&sz=w1000`,
    });
  }
}

entri.sort((a, b) => a.topik.localeCompare(b.topik) || a.urutan - b.urutan);

const keluaran = {
  _catatan:
    "Dibuat otomatis oleh scripts/fetch-drive-konten.mts — jangan diedit tangan, jalankan `npm run drive:fetch` untuk memperbarui.",
  folderAkar: FOLDER_AKAR,
  diambilPada: new Date().toISOString(),
  jumlah: entri.length,
  entri,
};

fs.writeFileSync(OUTPUT, `${JSON.stringify(keluaran, null, 2)}\n`);

const perTopik = entri.reduce<Record<string, number>>((acc, e) => {
  acc[e.topik] = (acc[e.topik] ?? 0) + 1;
  return acc;
}, {});

console.log(`Tersimpan ke ${path.relative(process.cwd(), OUTPUT)} — ${entri.length} berkas:`);
for (const [topik, jumlah] of Object.entries(perTopik)) console.log(`  ${topik}: ${jumlah}`);
