/**
 * Isi koleksi `video-pembelajaran` dengan video asli kanal YouTube Gernas
 * Tastaka — menggantikan 18 data dummy "[QA] …" hasil `seed:library-dummy`.
 *
 * Sumber data: Google Sheet "Konten Youtube - Website"
 * (18w9EEZhi6A6EZ5THG0n1Xkzkz0LeqPEtDX43r0Llunk, milik admin@gernastastaka.org),
 * kolom no/Judul/Link/Deskripsi. Isinya disalin apa adanya ke DATA di bawah —
 * skrip ini tidak membaca Sheet-nya langsung karena aksesnya lewat akun Google
 * staf, bukan service account. Kalau baris di Sheet bertambah, tambahkan di
 * sini lalu jalankan ulang.
 *
 * Jalankan:  npm run seed:video-youtube
 *
 * Yang dilakukan:
 *   1. Hapus semua dokumen `video-pembelajaran` berjudul awalan "[QA] ".
 *   2. Untuk tiap video: unduh thumbnail dari YouTube, unggah jadi dokumen
 *      Media, lalu buat/perbarui dokumen `video-pembelajaran`-nya.
 *
 * Aman diulang: dokumen dikenali lewat id video YouTube-nya (`tautanYoutube`
 * dicocokkan longgar, bukan string persis) dan `legacyPath` untuk Media —
 * yang sudah ada diperbarui, bukan diduplikasi.
 *
 * Catatan isi:
 * - `jenjang` tidak ada di Sheet. Semua diisi ["sd"] karena topiknya (KPK,
 *   FPB, faktor, pecahan, nilai tempat) materi SD; staf bisa mengoreksinya per
 *   video di dasbor tanpa perlu menyentuh skrip ini.
 * - Baris "Bernalar-Kontekstual-Sederhana-Mendasar" di akhir sebagian
 *   deskripsi Sheet sengaja tidak ikut — itu tag pilar, bukan kalimat, dan
 *   koleksi ini belum punya field tag. Kalau nanti mau dicari, tambahkan
 *   field `tags` seperti di koleksi `media-interaktif`.
 * - Video "Kepekaan Menjumlah Pecahan" memang kosong deskripsinya di Sheet;
 *   dibiarkan kosong, bukan dikarang.
 */
import fs from "fs";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;

type EntriVideo = {
  id: string; // id video YouTube
  judul: string;
  deskripsi: string;
};

const DATA: EntriVideo[] = [
  {
    id: "JWCyb-R7In8",
    judul: "Menemukan Konsep KPK",
    deskripsi: `Ketika mempelajari bilangan, kita akan membahas salah satu konsep matematika, yaitu kelipatan atau yang sering kita kenal dengan KPK (kelipatan persekutuan terkecil). Apa itu KPK? Dan bagaimana cara mencari KPK dari dua bilangan atau lebih?

Pastinya menjadi tantangan tersendiri kita sebagai guru / orang tua untuk mendesain materi ini sehingga anak-anak paham konsep KPK. Nah, permasalahan dalam video ini bisa lho dijadikan salah satu kegiatan untuk diskusi di kelas. Semoga menginspirasi!

Apakah kamu punya ide lain untuk mengajarkan konsep KPK ini di kelas? Tulis di kolom komentar ya....`,
  },
  {
    id: "oDwL2HyrMXM",
    judul: "Memaknai Faktor Bilangan",
    deskripsi: `Berapa faktor dari 16?
Di pikiran kita pasti terlintas 1, 2, 4, dan apa lagi ya.... Tak sedikit dari kita langsung mengingat-ingat berapa kali berapa hasilnya 16, kan? Siapa yang seperti itu? Ayo ngaku!

Bisa jadi anak-anak juga berpikiran yang sama dengan kita saat diminta menemukan faktor dari 16 itu. Bahkan untuk beberapa anak, cara "berapa kali berapa hasilnya 16" atau "... X ... = 16" ini semakin sulit dimengerti karena anak-anak langsung ke tahap abstrak tanpa tahu bentuk konkret faktor dari 16 tersebut sebenarnya bermakna apa.

Nah, video kali ini, kita bisa menggunakan salah satu aktivitas sederhana untuk membantu anak-anak memahami makna Faktor Bilangan. Pendekatan KGA (Konkret - Gambar - Abstrak) bisa kita terapkan lho! Jadi anak-anak belajar tentang Faktor Bilangan tidak melulu dengan cara 'ujug-ujug' "berapa kali berapa", tetapi ada proses memahami bentuk konkret konsep faktor bilangan terlebih dahulu.

Wah, menarik ya! Semoga menginspirasi! Apakah kamu punya ide lain untuk mengajarkan konsep Faktor Bilangan di kelas? Tulis di kolom komentar ya....`,
  },
  {
    id: "Y3LXMg6JjdI",
    judul: "Aktivitas Sederhana Untuk Memahami Pecahan Campuran",
    deskripsi: `Matematika dapat kita temui di kehidupan sehari-hari lho! Seperti permasalahan Ana dan Taka berikut tentang berapa jumlah pizza yang harus dipesan jika yang datang 9 orang dan setiap orang mendapat 1/4 potong pizza. Ada yang bisa tebak? Berapa pizza yang harus dipesan Taka?

Silakan menonton video ini ya....
Wah, menarik ya! Ternyata, jumlah pizza yang dibutuhkan Taka ada 2 1/4 potong pizza. Kok bentuk pecahannya ada bilangan di depan pecahannya? Nah, 2 1/4 disebut pecahan campuran karena terdiri dari bilangan bulat dan pecahan. Di video ini kita bisa belajar dari Bu Nas tentang bagaimana cara sederhana mengajarkan anak-anak memahami pecahan campuran.

Kira-kira ada cara lain nggak ya? Yuk tulis caramu belajar pecahan campuran di kolom komentar ya!`,
  },
  {
    id: "OHsXWL1hjzI",
    judul: "Aktivitas Sederhana Memahami Pohon Faktor",
    deskripsi: `Kali ini Ana dan Taka kebingungan menentukan jumlah kelompok yang bisa dibentuk dari 72 orang dengan catatan jumlah anggota setiap kelompok sama. Awalnya, Taka dan Ana menggunakan cara coba-coba membagi bilangan 72 dengan bilangan yang lebih kecil seperti 2 dan 3. Namun, cara tersebut sepertinya membutuhkan lebih banyak perhitungan untuk coba-coba bilangan lain. Hmm, kira-kira ide apa ya yang akan diajukan Bu Nas untuk permasalahan tersebut? Apakah ada cara lain selain cara coba-coba seperti yang Taka dan Ana lakukan? Penasaran? Tonton videonya sampai selesai ya....

Nah, permasalahan dalam video ini bisa lho dijadikan salah satu kegiatan untuk mempelajari konsep faktor-faktor suatu bilangan dengan Desain Pohon Faktor dan diskusi di kelas. Dengan cara media konkret kertas berbentuk lingkaran dan tusuk gigi ini, anak-anak bisa lebih mudah menyusun dan menemukan kemungkinan-kemungkinan lain lho! Semoga menginspirasi!

Apakah kamu punya ide lain untuk mengajarkan konsep Faktor Bilangan di kelas? Tulis di kolom komentar ya....`,
  },
  {
    id: "cFUBAXfyvjQ",
    judul: "Kepekaan Menjumlah Pecahan",
    deskripsi: "",
  },
  {
    id: "7UQXufe8L70",
    judul: "Aktivitas Sederhana Untuk Memahami Nilai Tempat",
    deskripsi: `Dalam belajar tentang bilangan, kita mengenal istilah Nilai Tempat. Apa itu Nilai Tempat? Ada yang bisa menjelaskan?

Nilai tempat adalah setiap angka pada sebuah bilangan. Ada satuan, puluhan, ratusan, ribuan, dan seterusnya.

Perhatikan contoh berikut:
✅ 12 dapat diartikan 12 satuan atau 1 puluhan dan 2 satuan
✅ 10 satuan = 1 puluhan

Jadi, posisi angka pada sebuah bilangan mempengaruhi nilai tempatnya.
Nah, permasalahan sederhana pada video ini dapat menjadi salah satu pembahasan di kelas atau di rumah ya untuk belajar Nilai Tempat....`,
  },
  {
    id: "3Z3ZUwjF338",
    judul: "Faktor Bilangan Terbesar",
    deskripsi: `Wah, menarik ya! Semoga menginspirasi! Apakah kamu punya ide lain untuk mengajarkan konsep Faktor Bilangan Terbesar (FPB) di kelas? Tulis di kolom komentar ya....`,
  },
];

const payload = await getPayload({ config });

// ── 1. Bersihkan data dummy ─────────────────────────────────────────────────

const qa = await payload.find({
  collection: "video-pembelajaran",
  where: { judul: { like: "[QA] %" } },
  limit: 500,
  pagination: false,
  depth: 0,
});
for (const doc of qa.docs) {
  await payload.delete({ collection: "video-pembelajaran", id: doc.id });
}
console.log(
  `Menghapus ${qa.docs.length} dokumen dummy "[QA] …" dari koleksi video-pembelajaran.\n`,
);

// ── 2. Thumbnail: unduh dari YouTube ────────────────────────────────────────

/**
 * `maxresdefault` tidak selalu ada (video lama/resolusi rendah) dan YouTube
 * membalasnya 404, jadi turun bertahap sampai `hqdefault` yang selalu ada.
 */
const VARIAN_THUMBNAIL = ["maxresdefault", "sddefault", "hqdefault"];

async function pastikanThumbnail(e: EntriVideo): Promise<number | string> {
  const legacyPath = `youtube:${e.id}`;

  const ada = await payload.find({
    collection: "media",
    where: { legacyPath: { equals: legacyPath } },
    limit: 1,
    pagination: false,
    depth: 0,
  });
  if (ada.docs.length > 0) return ada.docs[0].id;

  for (const varian of VARIAN_THUMBNAIL) {
    const res = await fetch(`https://i.ytimg.com/vi/${e.id}/${varian}.jpg`);
    if (!res.ok) continue;

    const tipe = res.headers.get("content-type") ?? "image/jpeg";
    if (!tipe.startsWith("image/")) continue;

    const buf = Buffer.from(await res.arrayBuffer());
    // YouTube membalas placeholder abu-abu 1.097 byte untuk varian yang tidak
    // ada, dengan status 200 — jadi ukuran kecil ikut dianggap gagal.
    if (buf.length < 2000) continue;

    const doc = await payload.create({
      collection: "media",
      data: { alt: `Sampul video ${e.judul}`, legacyPath },
      file: { data: buf, name: `yt-${e.id}.jpg`, mimetype: tipe, size: buf.length },
    });
    return doc.id;
  }

  throw new Error(`thumbnail YouTube tidak bisa diunduh (${VARIAN_THUMBNAIL.join(", ")})`);
}

// ── 3. Buat/perbarui dokumen video-pembelajaran ─────────────────────────────

let dibuat = 0;
let diperbarui = 0;
let gagal = 0;

for (const [i, e] of DATA.entries()) {
  const nomor = `[${String(i + 1).padStart(2)}/${DATA.length}]`;

  try {
    const thumbnail = await pastikanThumbnail(e);

    const data = {
      judul: e.judul,
      deskripsi: e.deskripsi || null,
      thumbnail,
      jenjang: ["sd"],
      mapel: ["matematika"],
      sumberTipe: "youtube" as const,
      tautanYoutube: `https://youtu.be/${e.id}`,
      urutan: i,
    };

    // Cocokkan lewat id videonya, bukan tautan persis — supaya bentuk tautan
    // lain yang mungkin diketik staf (`watch?v=`, `/embed/`) tetap dikenali
    // sebagai dokumen yang sama. Pola sama dgn seed-produk-drive.mts.
    const ada = await payload.find({
      collection: "video-pembelajaran",
      where: { tautanYoutube: { contains: e.id } },
      limit: 1,
      pagination: false,
      depth: 0,
    });

    if (ada.docs.length > 0) {
      await payload.update({ collection: "video-pembelajaran", id: ada.docs[0].id, data });
      diperbarui++;
      console.log(`${nomor} ↻  ${e.judul}`);
    } else {
      await payload.create({ collection: "video-pembelajaran", data });
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
