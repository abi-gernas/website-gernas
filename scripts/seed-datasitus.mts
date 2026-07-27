/**
 * Isi awal koleksi "Data Situs" — Penggerak, Mitra, Video, Modul Pelatihan.
 *
 * Jalankan:  npm run seed:datasitus   (jalankan seed:media lebih dulu)
 *
 * Datanya disalin ke dalam berkas ini, bukan diimpor dari `src/data/*.ts`,
 * karena berkas-berkas itu dihapus setelah migrasi selesai. Skrip seed harus
 * tetap bisa dijalankan ulang di basis data kosong (mis. saat pindah server)
 * lama setelah sumber aslinya tidak ada lagi.
 *
 * Aman diulang: koleksi yang sudah berisi dilewati seluruhnya. Ini disengaja —
 * setelah tim konten menyunting isinya, menambahkan ulang baris dari sini akan
 * menghasilkan duplikat yang harus dibersihkan manual. Untuk mengisi ulang dari
 * nol, kosongkan dulu koleksinya lewat dasbor.
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

// ── Pemetaan gambar ────────────────────────────────────────────────────────
// Nama berkas sudah berubah menjadi .webp saat impor media, jadi path lama di
// WordPress (`Media.legacyPath`) adalah satu-satunya penghubung yang tersisa.

const mediaCache = new Map<string, number | string | null>();

async function findMedia(legacyPath: string) {
  if (mediaCache.has(legacyPath)) return mediaCache.get(legacyPath)!;
  const res = await payload.find({
    collection: "media",
    where: { legacyPath: { equals: legacyPath } },
    limit: 1,
    pagination: false,
  });
  const id = res.docs[0]?.id ?? null;
  if (id === null) console.warn(`  ⚠ media tidak ditemukan: ${legacyPath}`);
  mediaCache.set(legacyPath, id);
  return id;
}

const M = (berkas: string) => `/media/${berkas}`;

/** Benar bila koleksi masih kosong dan aman diisi. */
async function kosong(collection: Parameters<typeof payload.find>[0]["collection"]) {
  const res = await payload.find({ collection, limit: 0, depth: 0 });
  if (res.totalDocs > 0) {
    console.log(`⏭  ${collection} — sudah berisi ${res.totalDocs} dokumen, dilewati`);
    return false;
  }
  return true;
}

/** Urutan tampil diberi kelipatan 10 agar staf bisa menyisipkan di antaranya. */
const urutan = (i: number) => (i + 1) * 10;

// ── Penggerak ──────────────────────────────────────────────────────────────

const penggerak: { nama: string; peran: string[]; foto: string | null }[] = [
  {
    nama: "Ahmad Rizali",
    peran: ["Ketua Dewan Pembina Yayasan Penggerak Indonesia Cerdas"],
    foto: M("16bac3b636f01c02752f7e5279f316bf5dd13e53-scaled.jpg"),
  },
  {
    nama: "Sururi Aziz",
    peran: ["Ketua Yayasan Penggerak Indonesia Cerdas"],
    foto: M("817598c2c86c9e9695f0c6cb29f3b8f4e4a07862.jpg"),
  },
  {
    nama: "Habe Arifin",
    peran: ["Dewan Pembina Yayasan Penggerak Indonesia Cerdas"],
    foto: M("e280d02d5bdf7af5bfc4670112d6bf0f3ffe546c-scaled.jpg"),
  },
  {
    nama: "Muhammad Fathii",
    peran: [
      "Trainer Gernas Tastaka",
      "Sekretaris Yayasan Penggerak Indonesia Cerdas",
    ],
    foto: M("0d733b2540769ac38411a68641ee389d0822464d-scaled.jpg"),
  },
  {
    nama: "Dhitta Puti Sarasvati",
    peran: [
      "Direktur BAJIK",
      "Trainer Gernas Tastaka",
      "Trainer Gernas Tastaba",
      "Peneliti PRPIC",
    ],
    foto: M("4ff17bb83f9fdef1277f340eb1ddf41627c1bfe8-scaled.jpg"),
  },
  {
    nama: "Regina Nurashari",
    peran: ["Koordinator PRPIC", "Trainer Gernas Tastaka"],
    foto: M("165016e4b982dee165d2d0e82dbba371c2fcc117-scaled.jpg"),
  },
  {
    nama: "Rina Octavia",
    peran: ["Koordinator Gernas Tastaba", "Trainer Gernas Tastaba"],
    foto: M("c79d58733cd226fdd5faab6ea96fc9f0a53e6f20.png"),
  },
  {
    nama: "Hana Sofiyana",
    peran: ["Trainer Gernas Tastaka", "Peneliti PRPIC"],
    foto: M("8fde3c35d85062af502620402f2dd6b16182f913-scaled.jpg"),
  },
  {
    nama: "Trimadona B. W.",
    peran: [
      "Trainer Gernas Tastaka",
      "Trainer Gernas Tastaba",
      "Peneliti PRPIC",
    ],
    foto: M("dc7861e0e78edc2d61519646d1d35ea7cf42b55c-scaled.jpg"),
  },
  {
    nama: "Setiawan Agung",
    peran: [
      "Trainer Gernas Tastaka",
      "Trainer Gernas Tastaba",
      "Peneliti BAJIK",
      "Peneliti PRPIC",
    ],
    foto: M("2dce3678063d2b82ff50316b29def3a1563b71fa.jpg"),
  },
];

async function seedPenggerak() {
  if (!(await kosong("penggerak"))) return;
  for (const [i, p] of penggerak.entries()) {
    await payload.create({
      collection: "penggerak",
      data: {
        nama: p.nama,
        foto: p.foto ? await findMedia(p.foto) : null,
        peran: p.peran.map((nama) => ({ nama })),
        urutan: urutan(i),
      },
    });
  }
  console.log(`✓ penggerak — ${penggerak.length} dokumen`);
}

// ── Mitra ──────────────────────────────────────────────────────────────────
// `tampilDiBeranda` menandai logo yang ikut pada barisan berjalan di beranda;
// di situs lama daftar itu ditulis terpisah (`homePartners`).

const mitra: {
  nama: string;
  logo: string;
  kelompok: "pemerintah" | "korporasi" | "pendidikan";
  beranda?: boolean;
}[] = [
  { nama: "Kemendikbud Ristek", logo: M("Kemendikbud.png"), kelompok: "pemerintah", beranda: true },
  { nama: "Pemerintah Daerah", logo: M("1-1-150x150.png"), kelompok: "pemerintah" },
  { nama: "Pemerintah Daerah", logo: M("3-1-266x300.png"), kelompok: "pemerintah" },
  { nama: "Pemerintah Daerah", logo: M("6-241x300.png"), kelompok: "pemerintah" },
  { nama: "Pemerintah Daerah", logo: M("10-222x300.png"), kelompok: "pemerintah" },
  { nama: "Pemerintah Daerah", logo: M("5-205x300.png"), kelompok: "pemerintah" },
  { nama: "Pemerintah Daerah", logo: M("7-250x300.png"), kelompok: "pemerintah" },

  {
    nama: "PT Bukit Asam (PTBA)",
    logo: M("516e3222f6b4954c0461b4eb0d924d8becd97a85-e1766749522698.png"),
    kelompok: "korporasi",
    beranda: true,
  },
  {
    nama: "ParagonCorp",
    logo: M("1deefc02027d5af12086f79640e09df8bd67d596-300x71.png"),
    kelompok: "korporasi",
    beranda: true,
  },
  { nama: "PT Timah", logo: M("Timah-300x85.png"), kelompok: "korporasi", beranda: true },
  { nama: "LP Ma'arif NU", logo: M("NU.png"), kelompok: "korporasi", beranda: true },

  { nama: "Universitas Indonesia", logo: M("UI.png"), kelompok: "pendidikan", beranda: true },
  { nama: "SEAMOLEC", logo: M("logo-seamolec-png-3.png"), kelompok: "pendidikan", beranda: true },
  { nama: "PSPK", logo: M("pspk.png"), kelompok: "pendidikan" },
  { nama: "SDIT Wahid Hasyim", logo: M("SDITWahidHasyim-300x247.png"), kelompok: "pendidikan" },
  { nama: "Top Karir", logo: M("Top-Karir-.png"), kelompok: "pendidikan" },
  { nama: "Perguruan Tinggi Mitra", logo: M("24.png"), kelompok: "pendidikan" },
  { nama: "Perguruan Tinggi Mitra", logo: M("23-242x300.png"), kelompok: "pendidikan" },
  { nama: "Perguruan Tinggi Mitra", logo: M("25-300x293.png"), kelompok: "pendidikan" },
];

async function seedMitra() {
  if (!(await kosong("mitra"))) return;
  let dilewati = 0;
  for (const [i, m] of mitra.entries()) {
    const logo = await findMedia(m.logo);
    // Logo wajib di skema — mitra tanpa berkas tidak bisa dibuat.
    if (!logo) {
      dilewati++;
      continue;
    }
    await payload.create({
      collection: "mitra",
      data: {
        nama: m.nama,
        logo,
        kelompok: m.kelompok,
        tampilDiBeranda: Boolean(m.beranda),
        urutan: urutan(i),
      },
    });
  }
  console.log(
    `✓ mitra — ${mitra.length - dilewati} dokumen` +
      (dilewati ? ` (${dilewati} dilewati, logo tidak ditemukan)` : ""),
  );
}

// ── Video ──────────────────────────────────────────────────────────────────
// Tautan sengaja kosong: di situs lama sampulnya pun tidak bisa diklik, dan
// menebak URL YouTube-nya bukan keputusan yang boleh diambil sepihak.

const video: { judul: string; thumb: string }[] = [
  {
    judul: "Geliat Numerasi di Bukit Salero",
    thumb: M("d920fde16fc2cecdd919853d2dc0780b04b6d561-1024x683.jpg"),
  },
  {
    judul: "Bincang Gernas 20: Strategi Visualisasi untuk Memaknai Bacaan",
    thumb: M("3cd58ec130639eead362c8aa7add291a98125026-1024x576.png"),
  },
  {
    judul: "Svara: Guru Pembaca Muara Enim",
    thumb: M("9d4731faa1d3cfcb4cf090a671d59dcee2548d63-1024x461.jpg"),
  },
  {
    judul: "Bincang Gernas Tastaba #3 — Program Literasi TK–SD",
    thumb: M("a62478c69373dac00744305b53d073eec68b42c1-1024x461.jpg"),
  },
];

async function seedVideo() {
  if (!(await kosong("video"))) return;
  let dilewati = 0;
  for (const [i, v] of video.entries()) {
    const thumbnail = await findMedia(v.thumb);
    if (!thumbnail) {
      dilewati++;
      continue;
    }
    await payload.create({
      collection: "video",
      data: { judul: v.judul, thumbnail, urutan: urutan(i) },
    });
  }
  console.log(
    `✓ video — ${video.length - dilewati} dokumen` +
      (dilewati ? ` (${dilewati} dilewati, sampul tidak ditemukan)` : ""),
  );
}

// ── Modul Pelatihan ────────────────────────────────────────────────────────
// Warna kartu tidak ikut disimpan: urutannya bergilir merah–biru–kuning
// mengikuti posisi (lihat src/components/TrainingModules.tsx).

type Modul = { nomor: number; judul: string; tujuan: string[] };

const modulMatematika: Modul[] = [
  {
    nomor: 1,
    judul: "Prinsip-Prinsip Dasar Mengajar & Belajar Matematika",
    tujuan: [
      "Merefleksikan pengalaman belajar matematika sehingga bisa melihat pengalaman belajar secara lebih kritis dan merefleksikannya pada praktik belajar dan mengajar saat ini.",
      "Membangun kesadaran bahwa tujuan utama siswa belajar matematika di SD adalah mengembangkan rasa ingin tahu, menumbuhkan penalaran, mengasah keterampilan berpikir (logis, sistematis, kreatif), menerapkan matematika dalam kehidupan sehari-hari, dan menumbuhkan cinta anak kepada ilmu pengetahuan.",
      "Membangun kesadaran mengenai pentingnya standar proses (NCTM, 2000) ketika mengajarkan matematika di SD/MI.",
      "Membangun kesadaran mengenai pentingnya pendekatan Konkret–Gambar–Abstrak (KGA) saat mengajarkan matematika di SD/MI.",
    ],
  },
  {
    nomor: 2,
    judul: "Bilangan",
    tujuan: [
      "Membangun kesadaran mengenai pentingnya membangun kepekaan bilangan (number sense).",
      "Mengetahui dan dapat merencanakan berbagai kegiatan pembelajaran untuk meningkatkan kepekaan bilangan siswa.",
      "Mengetahui bagaimana pendekatan KGA bisa digunakan untuk mempelajari beberapa konsep bilangan.",
      "Memecahkan masalah bilangan menggunakan tahapan G. Polya.",
    ],
  },
  {
    nomor: 3,
    judul: "Geometri",
    tujuan: [
      "Membangun kesadaran terkait pentingnya penalaran spasial saat belajar geometri dan contoh kegiatan yang dapat meningkatkan penalaran spasial siswa SD/MI.",
      "Mengenal teori Van Hiele (tahapan perkembangan geometri dan tahapan pembelajaran geometri).",
      "Memiliki bayangan pengaplikasian tahapan pembelajaran geometri Van Hiele di SD/MI.",
      "Merancang kegiatan pembelajaran geometri menggunakan tahapan pembelajaran geometri Van Hiele.",
    ],
  },
  {
    nomor: 4,
    judul: "Pengukuran",
    tujuan: [
      "Mendiskusikan prinsip dasar pengukuran.",
      "Mereview beberapa konsep pengukuran menggunakan pendekatan konkret–gambar–abstrak.",
      "Memecahkan masalah pengukuran menggunakan tahapan G. Polya.",
    ],
  },
  {
    nomor: 5,
    judul: "Probabilitas & Statistika",
    tujuan: [
      "Membandingkan keterampilan berpikir probabilistik (memprediksi kemungkinan terjadinya sesuatu) dan keterampilan berpikir statistik (mengolah data dan mengambil keputusan berdasarkan data).",
      "Mempraktikkan kegiatan untuk mereview konsep probabilitas dan melatih keterampilan berpikir probabilistik siswa.",
      "Mempraktikkan kegiatan untuk mereview konsep statistika dan melatih keterampilan berpikir statistik siswa.",
      "Membuat pertanyaan mengenai data statistika menggunakan Taksonomi Bloom.",
    ],
  },
  {
    nomor: 6,
    judul: "Asesmen Di Kelas Matematika",
    tujuan: [
      "Mendiskusikan jenis-jenis asesmen berdasarkan tujuannya.",
      "Mendiskusikan bentuk asesmen.",
      "Menganalisis contoh rancangan pembelajaran (yang dirancang dengan desain mundur).",
      "Berlatih merancang pembelajaran matematika menggunakan desain mundur.",
    ],
  },
];

const modulMembaca: Modul[] = [
  {
    nomor: 1,
    judul: "Menjadi Pembaca Aktif",
    tujuan: [
      "Memaknai apa yang dimaksud sebagai pembaca aktif.",
      "Mendiskusikan beberapa strategi untuk menjadi “Membaca Aktif”.",
      "Membuat rencana pribadi untuk menjadi pembaca yang lebih aktif.",
    ],
  },
  {
    nomor: 2,
    judul: "Membaca Dasar",
    tujuan: [
      "Membahas empat aspek literasi / keterampilan berbahasa (mendengar, berbicara, membaca, menulis).",
      "Mendiskusikan 6 komponen literasi (kesadaran cetak, fonologi, pengetahuan alfabet, fonik, kosa kata, pemahaman) dan merefleksikan hubungannya.",
      "Mendiskusikan dasar-dasar untuk melakukan diagnostik kemampuan membaca.",
    ],
  },
  {
    nomor: 3,
    judul: "Membaca Bermakna",
    tujuan: [
      "Berlatih menggunakan beberapa strategi “literasi aktif”.",
      "Berlatih membuat pertanyaan yang bisa memfasilitasi anak dalam memaknai bacaan.",
      "Membandingkan kegiatan membaca bersama (shared reading), membaca terbimbing (guided reading), dan close reading (membaca mendalam).",
      "Berlatih menggunakan grafis pengatur untuk memaknai teks dan merefleksikan bagaimana menggunakan grafis pengatur untuk mengajar membaca di kelas.",
      "Berlatih merancang kegiatan sebelum membaca, kegiatan saat membaca, dan setelah membaca.",
      "Membuat rencana aksi.",
    ],
  },
];

async function seedModul() {
  if (!(await kosong("modul-pelatihan"))) return;
  const semua: [Modul[], "matematika" | "membaca"][] = [
    [modulMatematika, "matematika"],
    [modulMembaca, "membaca"],
  ];
  let jumlah = 0;
  for (const [daftar, program] of semua) {
    for (const [i, m] of daftar.entries()) {
      await payload.create({
        collection: "modul-pelatihan",
        data: {
          judul: m.judul,
          program,
          nomor: m.nomor,
          tujuan: m.tujuan.map((teks) => ({ teks })),
          urutan: urutan(i),
        },
      });
      jumlah++;
    }
  }
  console.log(`✓ modul-pelatihan — ${jumlah} dokumen`);
}

// ── Jalankan ───────────────────────────────────────────────────────────────

await seedPenggerak();
await seedMitra();
await seedVideo();
await seedModul();

console.log("\nSelesai. Cek dasbor → Data Situs.");
process.exit(0);
