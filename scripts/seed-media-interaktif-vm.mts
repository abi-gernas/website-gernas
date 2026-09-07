/**
 * Isi koleksi `media-interaktif` dengan Repositori Mesin Virtual Numerasi
 * (https://prpic.id/vmnumerasi/) — menggantikan 18 data dummy "[QA] …" hasil
 * `seed:library-dummy`.
 *
 * Jalankan:  npm run seed:media-interaktif-vm
 *
 * Yang dilakukan:
 *   1. Hapus semua dokumen `media-interaktif` yang judulnya diawali "[QA] ".
 *   2. Untuk tiap VM di DATA di bawah: unduh thumbnail dari prpic.id, unggah
 *      jadi dokumen Media; unduh HTML mesin virtualnya, tulis ulang alamat
 *      aset relatif (`assets/...`) jadi absolut ke prpic.id & buang skrip
 *      analitik Cloudflare bawaannya; lalu buat/perbarui dokumen
 *      `media-interaktif`-nya (termasuk field `kontenHtml` utk disematkan
 *      lewat iframe di halaman detail kita sendiri).
 *
 * Aman diulang: dokumen dikenali lewat `tautan` (produk) dan `legacyPath`
 * (media) — yang sudah ada diperbarui, bukan diduplikasi.
 */
import fs from "fs";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;

const BASE = "https://prpic.id/vmnumerasi";

type EntriVm = {
  file: string; // "vm15" — dipakai untuk nama berkas HTML & thumbnail
  html: string; // nama berkas HTML lengkap
  judul: string;
  fase: "A" | "B" | "C" | "D";
  deskripsi: string;
};

const DATA: EntriVm[] = [
  { file: "vm15", html: "vm15_caribuah.html", judul: "Cari Buah", fase: "A", deskripsi: "Dino lapar. Bantu Dino untuk mencari buah ya?!" },
  { file: "vm16", html: "vm16_urutannama.html", judul: "Urutan Nama", fase: "A", deskripsi: "Eh, temanmu yang namanya ini itu yang mana sih? Coba tunjukkan dia berada di mana." },
  { file: "vm17", html: "vm17_kegiatanpagi.html", judul: "Kegiatan Pagi", fase: "A", deskripsi: "Pagi hari sebelum sekolah dimulai, kira-kira Kamu ngapain aja ya?" },
  { file: "vm18", html: "vm18_tatatelur.html", judul: "Tata Telur", fase: "A", deskripsi: "Kamu punya sekeranjang telur yang kamu beli dari warung sebelah. Saatnya menyimpan telur-telur itu di karton!" },
  { file: "vm19", html: "vm19_wortelkelinci.html", judul: "Kelinci dan Wortel", fase: "A", deskripsi: "Bantu si Kelinci untuk berjalan menuju wortelnya. Coba hitung langkah dan berikan perintah yang tepat untuk si Kelinci." },
  { file: "vm20", html: "vm20_mencaribenda.html", judul: "Mencari Benda", fase: "A", deskripsi: "Salah satu anggota keluargamu sedang mencari sesuatu yang mereka perlukan. Coba bantu dia menemukan benda yang dimaksud dengan memperhatikan percakapan mereka dengan teliti." },
  { file: "vm12", html: "vm12_paracetamol_.html", judul: "Paracetamol", fase: "B", deskripsi: "Adikmu sedang sakit. Tentukan dosis aman obat turun panas untuk adikmu!" },
  { file: "vm1", html: "vm1_belanja_.html", judul: "Toko Swalayan", fase: "B", deskripsi: "Kamu diberi sejumlah uang, dan ditugaskan untuk membeli beberapa barang. Tentukan barang apa saja yang bisa kamu beli." },
  { file: "vm4", html: "vm4_labelminuman_.html", judul: "Label Minuman", fase: "B", deskripsi: "Ada gula tersembunyi dalam minuman kemasan. Yuk, cermati dengan teliti. Mana minuman yang aman diminum, dan mana yang kadar gulanya terlalu tinggi?" },
  { file: "vm6", html: "vm6_pasangkeramik_.html", judul: "Pasang Keramik", fase: "B", deskripsi: "Saatnya memasang keramik! Hitung berapa banyak keramik yang diperlukan untuk jenis ruangan yang diberikan." },
  { file: "vm11", html: "vm11_detakjantung_.html", judul: "Denyut Jantung", fase: "B", deskripsi: "Pura-puranya kamu dokter yang memeriksa denyut jantung seorang anak. Coba periksa yang teliti!" },
  { file: "vm14", html: "vm14_botolbekas_.html", judul: "Bank Sampah", fase: "B", deskripsi: "Ayo menabung di Bank Sampah! Supaya bisa membiayai keperluan sekolah, berapa banyak botol bekas yang masih perlu kita kumpulkan ya?" },
  { file: "vm13", html: "vm13_ketuaosis_.html", judul: "Ketua OSIS", fase: "C", deskripsi: "Pemilihan Ketua OSIS sudah direkapitulasi hasilnya! Siapa yang menang ya?" },
  { file: "vm9", html: "vm9_uangsaku_.html", judul: "Uang Saku", fase: "C", deskripsi: "Ceritanya kamu seorang anak SMP di sebuah Kota Besar yang mendapat uang saku mingguan. Yuk, alokasikan besaran uang sakumu sesuai persentase yang tersedia!" },
  { file: "vm5", html: "vm5_cattembok_.html", judul: "Cat Tembok", fase: "C", deskripsi: "Pilih rumah idamanmu. Dan, hitung berapa banyak kaleng cat dan biaya yang diperlukan untuk mengecat rumah itu!" },
  { file: "vm3", html: "vm3_telurdadar_.html", judul: "Telur Dadar", fase: "C", deskripsi: "Kamu punya resep telur dadar untuk 4 orang. Tapi ternyata yang ingin makan telur dadarmu tidak selalu hanya 4 orang. Bisakah kamu sesuaikan resepnya?" },
  { file: "vm2", html: "vm2_diskon_.html", judul: "Butik Kemeja", fase: "D", deskripsi: "Ada promo diskon. Ada promo beli 1 gratis 1. Mana ya yang paling murah?" },
  { file: "vm7", html: "vm7_jalandarat_.html", judul: "Jalan Darat", fase: "D", deskripsi: "Kalau kita harus sampai di tujuan pada jam tertentu, maksimal kita harus berangkat jam berapa? Ini tentu tergantung rute yang kita pilih." },
  { file: "vm8", html: "vm8_ketinggalankereta_.html", judul: "Ketinggalan Kereta", fase: "D", deskripsi: "Aduh, kamu ketinggalan kereta! Enaknya tunggu jadwal kereta berikutnya atau naik ojek ya?" },
  { file: "vm10", html: "vm10_bagibayar_.html", judul: "Bagi Bayar", fase: "D", deskripsi: "Jajan di resto pizza memang seru! Apalagi kalau patungannya dibagi adil." },
];

const payload = await getPayload({ config });

// ── 1. Bersihkan data dummy ─────────────────────────────────────────────────

const qa = await payload.find({
  collection: "media-interaktif",
  where: { judul: { like: "[QA] %" } },
  limit: 500,
  pagination: false,
  depth: 0,
});
for (const doc of qa.docs) {
  await payload.delete({ collection: "media-interaktif", id: doc.id });
}
console.log(`Menghapus ${qa.docs.length} dokumen dummy "[QA] …" dari koleksi media-interaktif.\n`);

// ── 2. Sampul: unduh thumbnail dari prpic.id ────────────────────────────────

async function pastikanSampul(e: EntriVm): Promise<number | string> {
  const legacyPath = `vmnumerasi:${e.file}`;

  const ada = await payload.find({
    collection: "media",
    where: { legacyPath: { equals: legacyPath } },
    limit: 1,
    pagination: false,
    depth: 0,
  });
  if (ada.docs.length > 0) return ada.docs[0].id;

  const url = `${BASE}/assets/${e.file}.png`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`unduh sampul gagal: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const tipe = res.headers.get("content-type") ?? "image/png";
  if (!tipe.startsWith("image/")) {
    throw new Error(`sampul bukan gambar (content-type: ${tipe})`);
  }

  const doc = await payload.create({
    collection: "media",
    data: { alt: `Sampul mesin virtual numerasi ${e.judul}`, legacyPath },
    file: {
      data: buf,
      name: `${e.file}.png`,
      mimetype: tipe,
      size: buf.length,
    },
  });
  return doc.id;
}

// ── 3. Konten HTML: unduh & tulis ulang alamat aset relatif ────────────────

const REGEX_BEACON_CLOUDFLARE =
  /\s*<script[^>]*src=["']https:\/\/static\.cloudflareinsights\.com\/[^"']*["'][^>]*><\/script>\s*/gi;

async function ambilKontenHtml(e: EntriVm): Promise<string> {
  const res = await fetch(`${BASE}/${e.html}`);
  if (!res.ok) throw new Error(`unduh HTML gagal: HTTP ${res.status}`);
  let html = await res.text();

  html = html.replace(REGEX_BEACON_CLOUDFLARE, "\n");
  // "assets/foo.png" -> "https://prpic.id/vmnumerasi/assets/foo.png" — supaya
  // tetap tampil saat disematkan lewat iframe srcDoc di domain kita sendiri.
  html = html.replace(/(["'(])assets\//g, `$1${BASE}/assets/`);

  return html;
}

// ── 4. Buat/perbarui dokumen media-interaktif ───────────────────────────────

let dibuat = 0;
let diperbarui = 0;
let gagal = 0;

for (const [i, e] of DATA.entries()) {
  const nomor = `[${String(i + 1).padStart(2)}/${DATA.length}]`;
  const tautan = `${BASE}/${e.html}`;

  try {
    const [thumbnail, kontenHtml] = await Promise.all([pastikanSampul(e), ambilKontenHtml(e)]);

    const data = {
      judul: e.judul,
      deskripsi: e.deskripsi,
      thumbnail,
      tags: [{ label: "Numerasi" }, { label: `Fase ${e.fase}` }],
      kontenHtml,
      tautan,
      urutan: i,
    };

    const ada = await payload.find({
      collection: "media-interaktif",
      where: { tautan: { equals: tautan } },
      limit: 1,
      pagination: false,
      depth: 0,
    });

    if (ada.docs.length > 0) {
      await payload.update({ collection: "media-interaktif", id: ada.docs[0].id, data });
      diperbarui++;
      console.log(`${nomor} ↻  ${e.judul}`);
    } else {
      await payload.create({ collection: "media-interaktif", data });
      dibuat++;
      console.log(`${nomor} ✓  ${e.judul}`);
    }
  } catch (err) {
    gagal++;
    console.log(`${nomor} ✗  ${e.judul} — ${(err as Error).message}`);
  }
}

console.log(`\n${"─".repeat(52)}`);
console.log(`Dibuat: ${dibuat}   Diperbarui: ${diperbarui}   Gagal: ${gagal}`);

process.exit(gagal > 0 ? 1 : 0);
