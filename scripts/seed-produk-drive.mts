/**
 * Isi koleksi `produk` (Buku, Bahan Ajar & Modul) dari folder Google Drive
 * "Konten" — menggantikan data dummy "[QA] …" hasil `seed:library-dummy`.
 *
 * Jalankan:  npm run drive:fetch   (perbarui daftar berkas dari Drive)
 *            npm run seed:produk-drive
 *
 * Yang dilakukan:
 *   1. Hapus semua dokumen `produk` yang judulnya diawali "[QA] ".
 *   2. Untuk tiap PDF di data-produk-drive.json: unduh gambar halaman pertama
 *      dari Drive, unggah jadi dokumen Media (jadi sampul), lalu buat/perbarui
 *      dokumen `produk`-nya.
 *
 * Aman diulang: dokumen dikenali lewat file id Drive-nya (`tautanDrive` untuk
 * produk, `legacyPath` untuk media), yang sudah ada diperbarui/dipakai ulang,
 * bukan diduplikasi. `slug` hanya ditulis saat dokumen dibuat.
 *
 * Pilihan:
 *   --tanpa-hapus-qa   biarkan dokumen "[QA] …" tetap ada
 *   --hanya=<n>        proses n entri pertama saja (untuk uji cepat)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Muat .env sebelum payload.config di-import.
for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(DIR, "data-produk-drive.json");

const argv = process.argv.slice(2);
const hapusQa = !argv.includes("--tanpa-hapus-qa");
const hanya = Number(argv.find((a) => a.startsWith("--hanya="))?.split("=")[1] ?? 0);

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

if (!fs.existsSync(DATA)) {
  console.error(`${path.relative(process.cwd(), DATA)} belum ada. Jalankan \`npm run drive:fetch\` dulu.`);
  process.exit(1);
}

const { entri } = JSON.parse(fs.readFileSync(DATA, "utf8")) as { entri: EntriProduk[] };
const daftar = hanya > 0 ? entri.slice(0, hanya) : entri;

/**
 * Urutan topik di halaman = urutan folder di Drive. `urutan` dibuat
 * `indeksTopik * 1000 + nomor berkas` supaya katalog (yang di-`sort: "urutan"`)
 * mengelompok per topik dengan sendirinya, tanpa perlu mengubah sort di
 * `src/lib/produk.ts`.
 */
const URUTAN_TOPIK = [
  "geometri",
  "bilangan-cacah",
  "pecahan",
  "bilangan-bulat",
  "statistika",
  "pengukuran",
];

/**
 * Metadata yang belum bisa dibaca dari Drive dan sengaja diseragamkan.
 *
 * Seluruh berkas di folder "Konten" adalah lembar kegiatan matematika terbitan
 * Gernas Tastaka. `jenjang: ["sd"]` adalah asumsi — sebagian materi (bilangan
 * bulat, diagonal ruang, mean/median/modus) sebetulnya jenjang SMP. Betulkan
 * per dokumen lewat dasbor; skrip ini tidak menimpanya lagi setelah dibuat
 * (lihat FIELD_SEKALI_ISI di bawah).
 */
const KATEGORI = "bahan-ajar";
const JENJANG = ["sd"];
const MAPEL = ["matematika"];

/**
 * Field yang hanya diisi saat dokumen pertama kali dibuat.
 *
 * Sekali staf membetulkan jenjang/ringkasan/jenis materi lewat dasbor,
 * menjalankan ulang skrip ini tidak boleh menghapus suntingan itu. Yang tetap
 * disinkronkan tiap kali jalan hanyalah data yang memang berasal dari Drive:
 * judul, topik, urutan, tautan, dan sampul.
 */
const FIELD_SEKALI_ISI = ["kategoriProduk", "jenjang", "mapel", "status", "format"] as const;

const payload = await getPayload({ config });

// ── 1. Bersihkan data dummy ─────────────────────────────────────────────────

if (hapusQa) {
  const qa = await payload.find({
    collection: "produk",
    where: { judul: { like: "[QA] %" } },
    limit: 500,
    pagination: false,
    depth: 0,
  });

  for (const doc of qa.docs) {
    await payload.delete({ collection: "produk", id: doc.id });
  }
  console.log(`Menghapus ${qa.docs.length} dokumen dummy "[QA] …" dari koleksi produk.\n`);
}

// ── 2. Sampul: unduh halaman pertama PDF dari Drive ─────────────────────────

/**
 * `legacyPath` dipakai sebagai kunci idempoten ("drive:<fileId>"), bukan
 * hanya untuk migrasi WordPress: field itu satu-satunya kolom `unique` di
 * koleksi Media, jadi paling murah untuk mengenali sampul yang sudah pernah
 * diunggah tanpa menambah field + migrasi baru. Nama berkas tidak dipakai
 * karena Payload mengubah ekstensinya jadi .webp saat konversi.
 */
async function pastikanSampul(e: EntriProduk): Promise<number | string> {
  const legacyPath = `drive:${e.driveId}`;

  const ada = await payload.find({
    collection: "media",
    where: { legacyPath: { equals: legacyPath } },
    limit: 1,
    pagination: false,
    depth: 0,
  });
  if (ada.docs.length > 0) return ada.docs[0].id;

  const res = await fetch(e.thumbnail);
  if (!res.ok) throw new Error(`unduh sampul gagal: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const tipe = res.headers.get("content-type") ?? "image/png";
  if (!tipe.startsWith("image/")) {
    // Drive membalas halaman HTML (bukan gambar) kalau izin berkasnya berubah.
    throw new Error(`sampul bukan gambar (content-type: ${tipe}) — cek izin berbagi berkasnya`);
  }

  const doc = await payload.create({
    collection: "media",
    data: { alt: `Halaman pertama materi ${e.judul}`, legacyPath },
    file: {
      data: buf,
      name: `sampul-${e.slug}.png`,
      mimetype: tipe,
      size: buf.length,
    },
  });
  return doc.id;
}

// ── 3. Buat/perbarui dokumen produk ─────────────────────────────────────────

let dibuat = 0;
let diperbarui = 0;
let gagal = 0;

for (const [i, e] of daftar.entries()) {
  const nomor = `[${String(i + 1).padStart(2)}/${daftar.length}]`;
  const indeksTopik = URUTAN_TOPIK.indexOf(e.topik);
  const urutan = (indeksTopik < 0 ? URUTAN_TOPIK.length : indeksTopik) * 1000 + e.urutan;

  try {
    const cover = await pastikanSampul(e);

    const dariDrive = {
      judul: e.judul,
      topik: e.topik,
      cover,
      tautanDrive: e.tautanDrive,
      urutan,
    };

    // Dicocokkan lewat file id Drive yang ada DI DALAM `tautanDrive`
    // (`contains`, bukan `equals`), lalu slug sbg cadangan.
    //
    // `contains` penting karena satu berkas Drive punya banyak bentuk tautan:
    // `/view?usp=sharing`, `/view?usp=drivesdk`, `/view` polos, atau tautan
    // hasil tombol "Bagikan". Staf yang menambahkan materi manual lewat dasbor
    // (lihat docs/RENCANA-INTEGRASI-DRIVE.md §2.2 opsi A) hampir pasti menempel
    // bentuk yang berbeda dari yang dihasilkan skrip — dengan `equals`,
    // dokumen mereka tidak akan dikenali dan skrip membuat duplikatnya.
    // Membandingkan file id-nya saja membuat semua bentuk tautan itu setara.
    const ada = await payload.find({
      collection: "produk",
      where: {
        or: [{ tautanDrive: { contains: e.driveId } }, { slug: { equals: e.slug } }],
      },
      limit: 1,
      pagination: false,
      depth: 0,
    });

    if (ada.docs.length > 0) {
      await payload.update({
        collection: "produk",
        id: ada.docs[0].id,
        data: dariDrive,
      });
      diperbarui++;
      console.log(`${nomor} ↻  ${e.topik} / ${e.judul}`);
    } else {
      await payload.create({
        collection: "produk",
        data: {
          ...dariDrive,
          slug: e.slug,
          kategoriProduk: KATEGORI,
          jenjang: JENJANG,
          mapel: MAPEL,
          status: "gratis",
          format: ["pdf"],
        } as never,
      });
      dibuat++;
      console.log(`${nomor} ✓  ${e.topik} / ${e.judul}`);
    }
  } catch (err) {
    gagal++;
    console.log(`${nomor} ✗  ${e.topik} / ${e.judul} — ${(err as Error).message}`);
  }
}

console.log(`\n${"─".repeat(52)}`);
console.log(`Dibuat: ${dibuat}   Diperbarui: ${diperbarui}   Gagal: ${gagal}`);
console.log(
  `Field yang tidak ditimpa saat menjalankan ulang: ${FIELD_SEKALI_ISI.join(", ")}, ringkasan, fiturUnggulan, harga.`,
);

process.exit(gagal > 0 ? 1 : 0);
