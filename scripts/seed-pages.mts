/**
 * Migrasi 8 halaman statis `src/app/(frontend)/…` menjadi dokumen koleksi
 * Halaman yang tersusun dari blok.
 *
 * Jalankan:  npm run seed:pages
 *   (jalankan seed:media, seed:articles, dan seed:datasitus lebih dulu)
 *
 * Setelah skrip ini berhasil, folder route statisnya dihapus dan seluruh
 * halaman dilayani route catch-all `[...slug]` — inti dari US-002: tim konten
 * bisa menyunting halaman tanpa developer.
 *
 * Tiga hal yang sengaja TIDAK ikut dimigrasi, sesuai keputusan di sesi
 * perancangan:
 *  - 8 kartu "Ide Pembelajaran" di Tumbuh Bersama — isinya dua judul yang
 *    diulang empat kali, data contoh dari desain, bukan konten sungguhan.
 *  - Angka donasi di halaman Donatur — angka terkumpul di situs lama adalah
 *    contoh desain; menayangkan angka donasi yang tidak nyata bukan hal yang
 *    boleh diputuskan sepihak.
 *  - Grid unduhan Publikasi — 6 kartu identik; ditunda sampai PRD Fase 2
 *    beres karena bersinggungan dengan Library gated-download.
 * Bloknya tetap dibuat dalam keadaan kosong supaya tim konten tinggal mengisi.
 *
 * Aman diulang: halaman yang slug-nya sudah ada akan dilewati.
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

// ── Lexical ────────────────────────────────────────────────────────────────
// Payload menyimpan rich text sebagai pohon Lexical; hanya sebagian kecil
// jenis node yang dipakai halaman-halaman ini.

type Segmen = { teks: string; tebal?: boolean };

const textNode = (teks: string, tebal = false) => ({
  type: "text",
  text: teks,
  version: 1,
  format: tebal ? 1 : 0, // bitmask Lexical: 1 = bold
  detail: 0,
  mode: "normal",
  style: "",
});

const p = (...segmen: (string | Segmen)[]) => ({
  type: "paragraph",
  version: 1,
  format: "" as const,
  indent: 0,
  direction: "ltr" as const,
  textFormat: 0,
  textStyle: "",
  children: segmen.map((s) =>
    typeof s === "string" ? textNode(s) : textNode(s.teks, s.tebal),
  ),
});

const kutipan = (teks: string) => ({
  type: "quote",
  version: 1,
  format: "" as const,
  indent: 0,
  direction: "ltr" as const,
  children: [textNode(teks)],
});

const daftarNomor = (butir: string[]) => ({
  type: "list",
  listType: "number" as const,
  tag: "ol" as const,
  start: 1,
  version: 1,
  format: "" as const,
  indent: 0,
  direction: "ltr" as const,
  children: butir.map((teks, i) => ({
    type: "listitem",
    value: i + 1,
    version: 1,
    format: "" as const,
    indent: 0,
    direction: "ltr" as const,
    children: [textNode(teks)],
  })),
});

const richText = (...anak: object[]) => ({
  root: {
    type: "root",
    format: "" as const,
    indent: 0,
    version: 1,
    direction: "ltr" as const,
    children: anak,
  },
});

// ── Pemetaan gambar ────────────────────────────────────────────────────────

const mediaCache = new Map<string, number | string | null>();
const hilang: string[] = [];

async function media(berkas: string) {
  const legacyPath = `/media/${berkas}`;
  if (!mediaCache.has(legacyPath)) {
    const res = await payload.find({
      collection: "media",
      where: { legacyPath: { equals: legacyPath } },
      limit: 1,
      pagination: false,
    });
    const id = res.docs[0]?.id ?? null;
    if (id === null) hilang.push(legacyPath);
    mediaCache.set(legacyPath, id);
  }
  return mediaCache.get(legacyPath)!;
}

/** Beberapa gambar sekaligus, membuang yang tidak ditemukan. */
async function mediaBanyak(berkas: string[]) {
  const hasil = await Promise.all(berkas.map(media));
  return hasil.filter((id): id is number | string => id !== null);
}

// Gambar hero per halaman — nama sama seperti `heroImages` di src/data/site.ts.
const HERO = {
  mitra: "cd9ec685e814f9693bd11630a7d12d7632653fd2-1024x576.png",
  tentang: "d221fada6760065a77ff51077fa0a62a4b2eff38-1024x663.png",
  tumbuh: "WhatsApp-Image-2025-12-06-at-11.18.19-AM-1024x381.jpeg",
  belajar: "2e179e5cac71ab5008e6663239b32edb18a9568e-Medium.jpg",
  donatur: "bc60fc4e7b2ccccdfc8ca6310a9ab98bc102f86e-1024x576.jpg",
};

/** Angka dampak — dipakai beranda dan halaman Tentang. */
const STATISTIK = [
  { value: 16000, suffix: "+", label: "Total Pendidik" },
  { value: 400, suffix: "+", label: "Total Waktu Pelatihan" },
  { value: 21, label: "Jumlah Provinsi" },
  { value: 62, label: "Jumlah Kab/Kota" },
  { value: 45000, suffix: "+", label: "Total Peserta Didik" },
];

/** Dua lembaga di bawah Yayasan Penggerak Indonesia Cerdas. */
async function kartuLembaga() {
  return [
    {
      judul: "PRPIC",
      subjudul: "Pusat Riset Penggerak Indonesia Cerdas",
      isi: richText(
        p(
          "Lembaga riset akademik di bidang pendidikan dasar yang berfokus menghasilkan karya ilmiah dan diseminasi hasil penelitian.",
        ),
      ),
      gambar: await media("PRPIC-1024x296.png"),
      warna: "putih",
    },
    {
      judul: "Bajik",
      subjudul: "Barisan Pengkaji Kebijakan Pendidikan Dasar",
      isi: richText(
        p(
          "Lembaga kajian kebijakan dan edukasi publik yang berfokus pada isu-isu fundamental pendidikan dasar di Indonesia.",
        ),
      ),
      gambar: await media("Bajik-1024x392.png"),
      warna: "putih",
    },
  ];
}

// ── Susunan tiap halaman ───────────────────────────────────────────────────

type Halaman = {
  slug: string;
  title: string;
  /** Panel SEO. Dikosongkan pada beranda agar memakai bawaan di layout. */
  meta?: { title?: string; description?: string };
  layout: () => Promise<object[]>;
};

const halaman: Halaman[] = [
  // ── Beranda ──────────────────────────────────────────────────────────────
  {
    slug: "beranda",
    title: "Beranda",
    layout: async () => [
      {
        blockType: "hero",
        slides: [
          {
            title:
              "Membangun Fondasi Masa Depan Indonesia Melalui Pembelajaran Matematika dan Membaca yang",
            highlight: "Bermakna dan Bernalar",
            description:
              "Gernas Tastaka siap bermitra dengan semua elemen bangsa untuk kemajuan Pendidikan Dasar Indonesia.",
            image: await media("hero-beranda.jpg"),
            cta: { label: "Mari Belajar!", href: "/belajar-bersama" },
          },
          {
            title: "Matematika Sebagai Fondasi Kemampuan",
            highlight: "Bernalar",
            description:
              "Gernas Tastaka menemani guru SD/MI membelajarkan matematika yang bernalar, sederhana, mendasar, dan kontekstual.",
            image: await media("Gernas-Tastaka-scaled.jpg"),
            cta: { label: "Program Pelatihan", href: "/belajar-bersama" },
          },
          {
            title: "Membaca Sebagai Fondasi Kemampuan",
            highlight: "Belajar",
            description:
              "Gernas Tastaba, Gerakan Nasional Pemberantasan Buta Membaca, meningkatkan kompetensi guru dalam pembelajaran membaca bermakna.",
            image: await media("hero-membaca.jpg"),
            cta: { label: "Tumbuh Bersama", href: "/tumbuh-bersama" },
          },
        ],
      },
      {
        blockType: "valueCards",
        tumpukDiAtasHero: true,
        cards: [
          {
            title: "Belajar Bersama",
            tone: "red",
            body: "Bersama para guru dan masyarakat, kami membangun cara bernalar dan kontekstual melalui pelatihan, webinar, dan berbagai ruang berbagi ilmu.",
            cta: { label: "Mari Belajar!", href: "/belajar-bersama" },
          },
          {
            title: "Tumbuh Bersama",
            tone: "navy",
            body: "Setiap ide, buku, lembar kerja, dan produk digital adalah jejak dari proses tumbuh bersama. Di sini, pengetahuan terus hidup, berkembang, dan memberi makna bagi lebih banyak pembelajar.",
            cta: { label: "Akses Karya Gernas!", href: "/tumbuh-bersama" },
          },
          {
            title: "Kontribusi",
            tone: "yellow",
            body: "Melalui kolaborasi dengan mitra dan para dermawan, kami membuka lebih banyak ruang belajar, memperkuat peran guru, dan menyalakan harapan untuk masa depan anak-anak Indonesia.",
            links: [
              { label: "Penggerak", href: "/tentang-gernas-tastaka#penggerak" },
              { label: "Mitra", href: "/mitra" },
              { label: "Donatur", href: "/donatur" },
            ],
          },
        ],
      },
      {
        blockType: "callout",
        judul: "Tentang Gernas Tastaka",
        isi: "Sebuah gerakan yang diinisiasi oleh masyarakat untuk meningkatkan mutu pembelajaran matematika dan membaca di Sekolah Dasar/Madrasah Ibtidaiyah di Indonesia.",
        warna: "putih",
        rataTengah: true,
        cta: { label: "Selengkapnya →", href: "/tentang-gernas-tastaka" },
      },
      {
        blockType: "featureCards",
        kolom: "2",
        cards: await kartuLembaga(),
      },
      {
        blockType: "testimonials",
        heading: "Kata Mereka",
        items: [
          {
            kutipan:
              "Pemerintah tidak bisa menjadi satu-satunya yang paling tahu, paling bisa, dan paling mengerti berbagai kondisi yang ada di lapangan. Jika kita bersatu, jika kita bisa berhimpun sebagai satu kekuatan ekosistem, kita bisa melakukan berbagai hal yang berdampak sangat signifikan kepada murid — terutama terhadap kompetensi dasar. Karena itu, Gernas Tastaka memperkuat kompetensi dasar ini.",
            nama: "Dr. Iwan Syahril",
            peran:
              "Direktur Jenderal Guru dan Tenaga Kependidikan, Kemendikbud Ristek 2020–2022",
            foto: await media("6-797x1024.jpg"),
          },
          {
            kutipan:
              "Ketika saya kuliah belum ada pembelajaran seperti yang diajarkan di Gernas Tastaka; biasanya kuliah langsung teorinya saja. Ternyata di pelatihan Gernas Tastaka kami langsung menerapkan hal-hal yang nyata, dan konsep-konsepnya juga sangat mudah dipahami untuk anak-anak tingkat SD.",
            nama: "Efti Ayu Pertiwi, S.Pd.",
            peran: "Guru SDN 10 Lahat",
            foto: await media("5-1-797x1024.jpg"),
          },
          {
            kutipan:
              "Tanpa sumber daya manusia yang unggul, sulit menyebarkan kebaikan dan membangkitkan inovasi. Tadris Matematika lahir dari keinginan membangun peradaban baru Indonesia yang inovatif dan senantiasa menyebarkan kebaikan serta kebermanfaatan bagi masyarakat luas.",
            nama: "Salman Subakat",
            peran: "CEO PT. Paragon Technology and Innovation 2019–2022",
            foto: await media("4-797x1024.jpg"),
          },
        ],
      },
      {
        blockType: "indonesiaMap",
        heading: "Gernas Tastaka di Indonesia",
        tampilkanPeta: true,
        stats: STATISTIK,
      },
      {
        blockType: "latestNews",
        heading: "Kabar Terbaru",
        limit: 3,
        kolom: "3",
        cta: { label: "Lihat Semua →", href: "/publikasi" },
        // Tautan "Kabar Terbaru" di menu & footer menuju /#kabar-terbaru.
        anchor: "kabar-terbaru",
      },
      {
        blockType: "partnerLogos",
        heading: "Mitra Kolaborasi",
        tampilan: "barisan",
        cta: { label: "Lihat Selengkapnya!", href: "/mitra" },
      },
      {
        blockType: "videoGrid",
        heading: "Rekam Jejak Gernas Tastaka",
        limit: 3,
        kolom: "3",
      },
      {
        blockType: "ctaBanner",
        title:
          "Jadilah Bagian Dari Upaya Peningkatan Mutu Pendidikan Dasar Indonesia",
        body: "Bergabunglah bersama para penggerak, mitra, dan dermawan untuk menghadirkan pembelajaran matematika dan membaca yang bermakna bagi anak-anak Indonesia.",
        image: await media(HERO.mitra),
        cta: { label: "Kerja Sama", href: "/mitra" },
      },
    ],
  },

  // ── Tentang ──────────────────────────────────────────────────────────────
  {
    slug: "tentang-gernas-tastaka",
    title: "Tentang Gernas Tastaka",
    meta: {
      title: "Tentang Gernas Tastaka",
      description:
        "Kami lahir dari kegelisahan & harapan, hidup dan tumbuh dengan ruh kerelawanan. Sejarah, visi-misi, dan penggerak Gernas Tastaka.",
    },
    layout: async () => [
      {
        blockType: "pageHero",
        title: "Tentang Gernas Tastaka",
        image: await media(HERO.tentang),
        tint: "dark",
      },
      {
        blockType: "richText",
        heading:
          "Kami Lahir dari Kegelisahan & Harapan, Hidup dan Tumbuh dengan Ruh Kerelawanan.",
        lebar: "sedang",
        content: richText(
          p(
            "Gernas Tastaka adalah sebuah gerakan masyarakat sipil untuk meningkatkan mutu pendidikan dasar, khususnya Sekolah Dasar (SD)/Madrasah Ibtidaiyah (MI) di Indonesia. Gernas Tastaka diluncurkan pada 10 November 2018 dengan satu fokus, yaitu Pemberantasan Buta Matematika.",
          ),
          p(
            "Gerakan ini lahir dari kegelisahan mendalam akan mutu hasil belajar murid Indonesia di mata pelajaran matematika. Seperti terlihat pada laporan PISA 2018, skor rata-rata siswa Indonesia adalah 379, di bawah rata-rata OECD — menempatkan Indonesia pada posisi 7 dari bawah dari 79 negara peserta, dan menurun dibanding PISA 2015 (386).",
          ),
          p(
            { teks: "Gernas Tastaka menemani para guru kelas di SD/MI agar mampu membelajarkan matematika di kelas dengan " },
            { teks: "“Bernalar, Sederhana, Mendasar, dan Kontekstual”", tebal: true },
            { teks: ". Dimulai dari menghimpun sumber daya intelektual-akademis, menyusun rancangan pelatihan komprehensif, hingga menggerakkan relawan untuk membantu guru memperbaiki kualitas pembelajaran melalui pelatihan tatap muka yang sarat simulasi." },
          ),
          kutipan(
            "“Kita tak bisa menolak takdir, tapi kita dapat melakukan perubahan. Sekecil apapun itu. Tak ada waktu untuk berdiam diri. Sebab, perubahan adalah sebuah keniscayaan. Mari Bergerak!” — Ahmad Rizali, Founder Gernas Tastaka",
          ),
        ),
      },
      {
        blockType: "timeline",
        heading: "Tumbuh Bersama Kami",
        entries: [
          {
            tahun: "2018",
            teks: "Deklarasi Gerakan Nasional Pemberantasan Buta Matematika (Gernas Tastaka).",
          },
          {
            tahun: "2019",
            teks: "Pembuatan modul Training of Trainers & pelatihan perdana di MTsN 13 Jakarta Timur.",
          },
          {
            tahun: "2020",
            teks: "Lahirnya Kegiatan Gernas Mahasiswa dan Gernas Orang Tua.",
          },
          {
            tahun: "2021",
            teks: "Program Gernas Tastaba diluncurkan, Yayasan Penggerak Indonesia Cerdas berdiri.",
          },
          {
            tahun: "2022",
            teks: "Peluncuran Buku Ide Belajar Matematika dan Festival Belajar.",
          },
          {
            tahun: "2023",
            teks: "Terbentuknya Pusat Riset Penggerak Indonesia Cerdas (PRPIC).",
          },
          {
            tahun: "2024",
            teks: "Terbentuknya Barisan Pengkaji Kebijakan Pendidikan (BAJIK).",
          },
        ],
      },
      {
        blockType: "featureCards",
        heading: "Visi & Misi",
        kolom: "2",
        cards: [
          {
            judul: "Visi",
            warna: "navy",
            isi: richText(
              p("Pendidikan Dasar (SD/MI) dan setingkat yang Bermutu Bagi Semua."),
            ),
          },
          {
            judul: "Misi",
            warna: "abu",
            isi: richText(
              daftarNomor([
                "Menyediakan akses terhadap pendidikan guru SD/MI bermutu yang berfokus pada peningkatan kecakapan bernumerasi.",
                "Menyediakan akses terhadap pendidikan guru SD/MI bermutu yang berfokus pada peningkatan keterampilan membaca.",
                "Menghadirkan sumber belajar yang inovatif untuk mendukung pembelajaran bernalar bagi guru dan siswa.",
                "Melakukan pendekatan secara terikat sebagai kebijakan dan roh kerelawanan.",
                "Pemetaan dan menyempurnakan kompetensi guru SD dalam mengajar matematika dan membaca beserta asesmen dan pelatihannya.",
              ]),
            ),
          },
        ],
      },
      {
        blockType: "featureCards",
        heading: "Program",
        kolom: "2",
        cards: await kartuLembaga(),
      },
      {
        blockType: "teamGrid",
        heading: "Penggerak",
        // Tautan "Penggerak" di menu & footer menuju /tentang-gernas-tastaka#penggerak.
        anchor: "penggerak",
      },
      {
        blockType: "indonesiaMap",
        heading: "Dampak Penyebaran",
        tampilkanPeta: true,
        stats: STATISTIK,
      },
    ],
  },

  // ── Mitra ────────────────────────────────────────────────────────────────
  {
    slug: "mitra",
    title: "Mitra",
    meta: {
      title: "Mitra",
      description:
        "Selalu ada ruang partisipasi untuk pendidikan. Berkolaborasi bersama Gernas Tastaka melalui CSR, sponsorship, proyek, dan konsultasi.",
    },
    layout: async () => [
      {
        blockType: "pageHero",
        title: "Mitra Kami",
        description:
          "Setiap langkah yang kami tempuh tak lepas dari kontribusi para mitra yang setia mendampingi. Bersama mereka, Penggerak Indonesia Cerdas terus tumbuh, memberi makna, dan membawa dampak nyata bagi pendidikan Indonesia.",
        image: await media(HERO.mitra),
        tint: "navy",
        garisBawah: true,
      },
      {
        blockType: "featureCards",
        kolom: "2",
        gambarSamping: {
          gambar: await media(HERO.donatur),
          judul: "Partisipasi Untuk Pendidikan",
          judulSorot: "Selalu Ada Ruang",
        },
        cards: [
          {
            judul: "CSR",
            warna: "putih",
            isi: richText(
              p(
                "Program CSR kami memudahkan Anda mendukung inisiatif pendidikan yang berdampak. Dari media pembelajaran hingga peningkatan kualitas guru, kami bantu Anda mencapai tujuan.",
              ),
            ),
          },
          {
            judul: "Sponsorship",
            warna: "putih",
            isi: richText(
              p(
                "Gerakan kami telah mengakar hampir di seluruh Indonesia. Melalui sponsorship, Anda membantu mewujudkan pendidikan dasar yang bermutu bagi setiap guru dan anak di Indonesia.",
              ),
            ),
          },
          {
            judul: "Proyek",
            warna: "putih",
            isi: richText(
              p(
                "Selenggarakan acara edukasi yang bermakna. Kami menyediakan platform yang memudahkan pengelolaan acara, mulai dari pendaftaran hingga evaluasi. Bersama, kita wujudkan generasi yang lebih cerdas.",
              ),
            ),
          },
          {
            judul: "Konsultan & Kolaborasi",
            warna: "putih",
            isi: richText(
              p(
                "Butuh solusi pendidikan yang disesuaikan dengan kebutuhan Anda? Kami siap memberikan konsultasi dan pendampingan untuk mencapai tujuan pendidikan yang lebih baik.",
              ),
            ),
          },
        ],
      },
      {
        blockType: "partnerLogos",
        tampilan: "berkelompok",
      },
      {
        blockType: "ctaBanner",
        title: "Jadilah Bagian dari Perubahan Pendidikan Indonesia",
        body: "Kami percaya bahwa kemajuan pendidikan dasar membutuhkan kolaborasi yang kuat. Penggerak Indonesia Cerdas membuka peluang kerja sama bagi institusi, organisasi, perusahaan, dan individu yang memiliki visi sama: mencerdaskan generasi bangsa.",
        image: await media(HERO.tentang),
        cta: { label: "Jadi Mitra", href: "#hubungi" },
      },
      {
        blockType: "contactForm",
        heading: "Hubungi Kami",
        // Tautan "Jadi Mitra" & "Gabung Sekarang" di beberapa halaman menuju /mitra#hubungi.
        anchor: "hubungi",
      },
    ],
  },

  // ── Belajar Bersama ──────────────────────────────────────────────────────
  {
    slug: "belajar-bersama",
    title: "Belajar Bersama",
    meta: {
      title: "Belajar Bersama",
      description:
        "Program pelatihan Gernas Tastaka untuk membekali guru SD/MI dengan keterampilan mengajar matematika dan membaca yang bernalar.",
    },
    layout: async () => [
      {
        blockType: "pageHero",
        title: "Matematika Sebagai Fondasi Kemampuan Bernalar",
        description:
          "Gernas Tastaka menemani guru SD/MI membelajarkan matematika yang bernalar, sederhana, mendasar, dan kontekstual melalui pelatihan tatap muka yang sarat simulasi.",
        image: await media(HERO.belajar),
        tint: "dark",
      },
      {
        blockType: "richText",
        heading: "Program Pelatihan",
        lebar: "sedang",
        content: richText(
          p(
            "Gernas Tastaka mengembangkan program pelatihan untuk membekali guru SD/MI dengan keterampilan dasar yang praktis dan mudah diterapkan dalam mengajarkan matematika dan membaca di kelas. Program ini dirancang agar guru dapat mengintegrasikan metode dan strategi yang efektif ke dalam kegiatan pembelajaran sehari-hari.",
          ),
        ),
      },
      {
        blockType: "trainingModules",
        heading: "Topik Pelatihan Matematika",
        program: "matematika",
        tampilan: "topik",
        sidebar: {
          teks: "Pelatihan Matematika Gernas Tastaka dirancang untuk memberi dukungan kepada guru dalam memfasilitasi pembelajaran matematika yang bernalar dalam 36 jam.",
          ajakan: "Tertarik untuk belajar?",
          cta: { label: "Gabung Sekarang", href: "/mitra#hubungi" },
        },
      },
      {
        blockType: "trainingModules",
        heading: "Rincian Modul Pelatihan",
        program: "matematika",
        tampilan: "rincian",
      },
      {
        blockType: "trainingModules",
        heading: "Topik Pelatihan Membaca",
        program: "membaca",
        tampilan: "topik",
        sidebar: {
          teks: "Melalui Pelatihan membaca Gernas Tastaba dalam 36 Jam, guru belajar menjadi fasilitator pembelajaran Membaca yang Bermakna.",
          ajakan: "Tertarik untuk belajar?",
          cta: { label: "Gabung Sekarang", href: "/mitra#hubungi" },
        },
      },
      {
        blockType: "trainingModules",
        heading: "Rincian Modul Pelatihan Membaca",
        program: "membaca",
        tampilan: "rincian",
      },
      {
        blockType: "callout",
        judul: "Program Intensif",
        isi: "Program Intensif Gernas Tastaka memberikan pendampingan terstruktur yang memastikan pelatihan terimplementasi menjadi praktik nyata di kelas. Bersama mitra, kami mendukung guru melalui diskusi terarah, coaching, mentoring, micro-teaching, dan kelas percontohan yang mudah direplikasi. Program ini dirancang untuk membantu sekolah dan pemerintah daerah mencapai peningkatan mutu pembelajaran secara berkelanjutan dan terukur.",
        warna: "navy",
        cta: { label: "Jadi Mitra Program", href: "/mitra#hubungi" },
      },
    ],
  },

  // ── Tumbuh Bersama ───────────────────────────────────────────────────────
  {
    slug: "tumbuh-bersama",
    title: "Tumbuh Bersama",
    meta: {
      title: "Tumbuh Bersama",
      description:
        "Kompilasi bahan ajar, ide pembelajaran matematika & membaca, serta video pembelajaran Gernas Tastaka yang dapat langsung diterapkan guru di kelas.",
    },
    layout: async () => [
      {
        blockType: "pageHero",
        title: "Tumbuh Bersama dengan Kompilasi Bahan Ajar",
        description:
          "Gernas Tastaka mengompilasi beragam materi dan ide belajar praktis yang dapat diakses para guru untuk memperkaya pembelajaran di kelas.",
        image: await media(HERO.tumbuh),
        tint: "dark",
      },
      {
        blockType: "richText",
        lebar: "sedang",
        rataTengah: true,
        content: richText(
          p(
            "Gernas Tastaka menghadirkan berbagai karya dan materi pembelajaran yang dapat langsung diterapkan oleh guru di kelas. Materi dirancang dengan prinsip kedekatan pada kehidupan sehari-hari, penumbuhan nalar, dan pembangunan rasa percaya diri murid dalam belajar matematika dan membaca. Tersedia juga rekaman webinar dan video pembelajaran dari program Bincang Gernas. Kami percaya, pengetahuan akan tumbuh lebih kuat ketika dibagikan dan diterapkan bersama.",
          ),
        ),
      },
      // Dua blok berikut sengaja kosong — lihat catatan di kepala berkas.
      {
        blockType: "ideaCards",
        heading: "Ide Pembelajaran Matematika",
        kolom: "4",
        items: [],
      },
      {
        blockType: "ideaCards",
        heading: "Akses Ide Pembelajaran Membaca",
        kolom: "4",
        items: [],
      },
      {
        blockType: "videoGrid",
        heading: "Akses Video Pembelajaran Topik Matematika dan Membaca",
        kolom: "2",
      },
      {
        blockType: "callout",
        judul: "Rangkaian produk pilihan yang kami sediakan",
        warna: "kuning",
        rataTengah: true,
        gambar: await mediaBanyak([
          "0755ce198112836b6367fbee81181f84a895a787-Medium-1024x576.jpg",
          "2e179e5cac71ab5008e6663239b32edb18a9568e-Medium.jpg",
          "0dce58a77b3fef3575056594bb4b71433f9f8630-Medium.jpg",
          "f06abb8494c4ff902037b6a0365c737afc1425b6-Medium-300x169.jpg",
        ]),
        tautanTambahan: [
          { awalan: "Temukan Kami:", label: "Shopee" },
          { label: "Tokopedia" },
        ],
      },
      {
        blockType: "callout",
        judul: "Berpartisipasi Untuk Menguatkan Pembelajaran",
        isi: "Di ruang kelas yang sama, setiap hari guru menemukan pengalaman baru. Praktik baik yang dibagikan dan dijalankan akan tumbuh dengan pengalaman baru, dan bila dibagikan kembali, praktik baik menjadi semakin kaya. Jadilah bagian dari kekayaan pembelajaran yang terus tumbuh.",
        warna: "abu",
        rataTengah: true,
        cta: { label: "Ikut Terlibat", href: "/mitra#hubungi" },
      },
    ],
  },

  // ── Donatur ──────────────────────────────────────────────────────────────
  {
    slug: "donatur",
    title: "Donatur",
    meta: {
      title: "Donatur",
      description:
        "Bersama-sama mendukung langkah anak Indonesia untuk lebih bernalar. Dukung program pembelajaran matematika dan membaca Gernas Tastaka.",
    },
    layout: async () => [
      {
        blockType: "donationTiers",
        judul:
          "Bersama-sama Mendukung Langkah Anak Indonesia untuk Lebih",
        judulSorot: "Bernalar",
        isi: "Kami menyadari bahwa membenahi pendidikan dasar Indonesia pada dua elemen utamanya — matematika dan membaca — adalah kerja raksasa yang membutuhkan keterlibatan banyak pihak. Karena itu, kami membuka pintu kolaborasi seluas-luasnya dengan berbagai mitra, para dermawan, dan segenap pemangku kepentingan. Setiap dukungan akan disalurkan dalam program yang dirancang Gernas Tastaka.",
      },
      // Kosong sampai angka kampanye yang sebenarnya tersedia — lihat catatan
      // di kepala berkas.
      {
        blockType: "donationCampaigns",
        heading: "Donasi Untuk Gernas Tastaka",
        kolom: "3",
        items: [],
      },
    ],
  },

  // ── Galeri ───────────────────────────────────────────────────────────────
  {
    slug: "galeri",
    title: "Galeri",
    meta: {
      title: "Galeri",
      description:
        "Dokumentasi kegiatan pelatihan, festival belajar, dan pendampingan guru Gernas Tastaka di berbagai daerah Indonesia.",
    },
    layout: async () => [
      {
        blockType: "pageHero",
        title: "Galeri Kegiatan",
        description:
          "Jejak langkah Gernas Tastaka bersama para guru, mitra, dan penggerak di berbagai penjuru Indonesia.",
        image: await media(HERO.tumbuh),
        tint: "dark",
      },
      {
        blockType: "gallery",
        kolom: "4",
        images: await mediaBanyak([
          "5b320a038abff73c18308dd66ea6c4336636c877-3-169x300.jpg",
          "e24a82b72601c94f307a22fd72d2ba6ec0d24c5b-2-300x169.jpg",
          "5273eb49d56457059dadc6900004732cbc8d2200-300x169.jpg",
          "dfcae878ccfb4d2817651e4fd546e5ec3dc87496-169x300.jpg",
          "bc60fc4e7b2ccccdfc8ca6310a9ab98bc102f86e-300x169.jpg",
          "834296ea58977bb15745da9ee0c3d2385325dd99-300x169.png",
          "a4d5ed53492d8bf52d5785e896bb3dadee9f0688-300x169.png",
          "3cd58ec130639eead362c8aa7add291a98125026-300x169.png",
          "f7860ae0b2a36312a4a15e57dc106f573020e844-300x169.png",
          "77544a6d7cc0244fb84a34afecd2332f02816dc5-300x169.png",
          "3887ba8a71eb1331d285fc07078627f67f2dc735-300x169.png",
          "2e179e5cac71ab5008e6663239b32edb18a9568e-Medium-300x225.jpg",
          "0dce58a77b3fef3575056594bb4b71433f9f8630-Medium-300x224.jpg",
          "0755ce198112836b6367fbee81181f84a895a787-Medium-300x169.jpg",
          "f06abb8494c4ff902037b6a0365c737afc1425b6-Medium-300x169.jpg",
          "Program-Timah-Mengajar-300x200.png",
          "3-300x169.png",
          "1-300x169.png",
          "2-300x169.png",
          "PTBA2-300x200.jpg",
          "47408112b8fe6975df5eba2b3523035623e239b1-300x225.jpg",
          "cd9ec685e814f9693bd11630a7d12d7632653fd2-300x169.png",
          "PTBA-300x200.jpg",
          "ed0592ac8385c7f0134f0c7c57f00bf0fac67949-300x169.png",
        ]),
      },
    ],
  },

  // ── Publikasi ────────────────────────────────────────────────────────────
  {
    slug: "publikasi",
    title: "Publikasi",
    meta: {
      title: "Publikasi",
      description:
        "Publikasi riset, kajian kebijakan, dan kabar terbaru Gernas Tastaka seputar pembelajaran matematika dan membaca di pendidikan dasar.",
    },
    layout: async () => [
      {
        blockType: "pageHero",
        title: "Publikasi & Riset",
        description:
          "Karya ilmiah, kajian kebijakan, dan diseminasi hasil penelitian dari Pusat Riset Penggerak Indonesia Cerdas (PRPIC) dan BAJIK.",
        image: await media(HERO.tentang),
        tint: "dark",
      },
      {
        blockType: "latestNews",
        heading: "Kabar Terbaru",
        limit: 12,
        kolom: "4",
      },
    ],
  },
];

// ── Jalankan ───────────────────────────────────────────────────────────────

let dibuat = 0;
let dilewati = 0;

for (const h of halaman) {
  const ada = await payload.find({
    collection: "pages",
    where: { slug: { equals: h.slug } },
    limit: 1,
    pagination: false,
  });

  if (ada.docs.length > 0) {
    dilewati++;
    console.log(`⏭  /${h.slug} — sudah ada, tidak dibuat ulang`);
    continue;
  }

  const layout = await h.layout();
  const doc = await payload.create({
    collection: "pages",
    data: {
      title: h.title,
      slug: h.slug,
      _status: "published",
      layout,
      ...(h.meta ? { meta: h.meta } : {}),
    } as never,
  });

  dibuat++;
  console.log(`✓  /${doc.slug} — ${layout.length} blok`);
}

console.log(`\nDibuat: ${dibuat}   Dilewati: ${dilewati}`);
if (hilang.length > 0) {
  console.log(`\n⚠ ${hilang.length} gambar tidak ditemukan di koleksi Media:`);
  for (const path of [...new Set(hilang)]) console.log(`   ${path}`);
  console.log("  Jalankan `npm run seed:media` lalu ulangi.");
}
process.exit(hilang.length > 0 ? 1 : 0);
