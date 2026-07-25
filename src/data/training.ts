// Program Pelatihan Matematika (halaman Belajar Bersama).
// Konten direplikasi dari referensi desain (6 Pelatihan / 6 Modul).

export type TrainingModule = {
  no: number;
  label: string; // judul singkat pada kartu "Pelatihan N"
  subtitle: string; // judul modul
  tone: "red" | "navy" | "yellow";
  points: string[];
};

export const trainingIntro =
  "Gernas Tastaka mengembangkan program pelatihan untuk membekali guru SD/MI dengan keterampilan dasar yang praktis dan mudah diterapkan dalam mengajarkan matematika dan membaca di kelas. Program ini dirancang agar guru dapat mengintegrasikan metode dan strategi yang efektif ke dalam kegiatan pembelajaran sehari-hari.";

export const trainingSidebar =
  "Pelatihan Matematika Gernas Tastaka dirancang untuk memberi dukungan kepada guru dalam memfasilitasi pembelajaran matematika yang bernalar dalam 36 jam.";

export const trainingModules: TrainingModule[] = [
  {
    no: 1,
    label: "Prinsip-Prinsip Dasar Mengajar & Belajar Matematika",
    subtitle: "Prinsip-prinsip dasar mengajar & belajar matematika",
    tone: "red",
    points: [
      "Merefleksikan pengalaman belajar matematika sehingga bisa melihat pengalaman belajar secara lebih kritis dan merefleksikannya pada praktik belajar dan mengajar saat ini.",
      "Membangun kesadaran bahwa tujuan utama siswa belajar matematika di SD adalah mengembangkan rasa ingin tahu, menumbuhkan penalaran, mengasah keterampilan berpikir (logis, sistematis, kreatif), menerapkan matematika dalam kehidupan sehari-hari, dan menumbuhkan cinta anak kepada ilmu pengetahuan.",
      "Membangun kesadaran mengenai pentingnya standar proses (NCTM, 2000) ketika mengajarkan matematika di SD/MI.",
      "Membangun kesadaran mengenai pentingnya pendekatan Konkret–Gambar–Abstrak (KGA) saat mengajarkan matematika di SD/MI.",
    ],
  },
  {
    no: 2,
    label: "Bilangan",
    subtitle: "Bilangan",
    tone: "navy",
    points: [
      "Membangun kesadaran mengenai pentingnya membangun kepekaan bilangan (number sense).",
      "Mengetahui dan dapat merencanakan berbagai kegiatan pembelajaran untuk meningkatkan kepekaan bilangan siswa.",
      "Mengetahui bagaimana pendekatan KGA bisa digunakan untuk mempelajari beberapa konsep bilangan.",
      "Memecahkan masalah bilangan menggunakan tahapan G. Polya.",
    ],
  },
  {
    no: 3,
    label: "Geometri",
    subtitle: "Geometri",
    tone: "yellow",
    points: [
      "Membangun kesadaran terkait pentingnya penalaran spasial saat belajar geometri dan contoh kegiatan yang dapat meningkatkan penalaran spasial siswa SD/MI.",
      "Mengenal teori Van Hiele (tahapan perkembangan geometri dan tahapan pembelajaran geometri).",
      "Memiliki bayangan pengaplikasian tahapan pembelajaran geometri Van Hiele di SD/MI.",
      "Merancang kegiatan pembelajaran geometri menggunakan tahapan pembelajaran geometri Van Hiele.",
    ],
  },
  {
    no: 4,
    label: "Pengukuran",
    subtitle: "Pengukuran",
    tone: "red",
    points: [
      "Mendiskusikan prinsip dasar pengukuran.",
      "Mereview beberapa konsep pengukuran menggunakan pendekatan konkret–gambar–abstrak.",
      "Memecahkan masalah pengukuran menggunakan tahapan G. Polya.",
    ],
  },
  {
    no: 5,
    label: "Probabilitas & Statistika",
    subtitle: "Probabilitas dan Statistika",
    tone: "navy",
    points: [
      "Membandingkan keterampilan berpikir probabilistik (memprediksi kemungkinan terjadinya sesuatu) dan keterampilan berpikir statistik (mengolah data dan mengambil keputusan berdasarkan data).",
      "Mempraktikkan kegiatan untuk mereview konsep probabilitas dan melatih keterampilan berpikir probabilistik siswa.",
      "Mempraktikkan kegiatan untuk mereview konsep statistika dan melatih keterampilan berpikir statistik siswa.",
      "Membuat pertanyaan mengenai data statistika menggunakan Taksonomi Bloom.",
    ],
  },
  {
    no: 6,
    label: "Asesmen Di Kelas Matematika",
    subtitle: "Asesmen di Kelas Matematika",
    tone: "yellow",
    points: [
      "Mendiskusikan jenis-jenis asesmen berdasarkan tujuannya.",
      "Mendiskusikan bentuk asesmen.",
      "Menganalisis contoh rancangan pembelajaran (yang dirancang dengan desain mundur).",
      "Berlatih merancang pembelajaran matematika menggunakan desain mundur.",
    ],
  },
];

export const programIntensif =
  "Program Intensif Gernas Tastaka memberikan pendampingan terstruktur yang memastikan pelatihan terimplementasi menjadi praktik nyata di kelas. Bersama mitra, kami mendukung guru melalui diskusi terarah, coaching, mentoring, micro-teaching, dan kelas percontohan yang mudah direplikasi. Program ini dirancang untuk membantu sekolah dan pemerintah daerah mencapai peningkatan mutu pembelajaran secara berkelanjutan dan terukur.";

// Riwayat / timeline "Tumbuh Bersama Kami" (halaman Tentang)
export const timeline: { year: string; text: string }[] = [
  { year: "2018", text: "Deklarasi Gerakan Nasional Pemberantasan Buta Matematika (Gernas Tastaka)." },
  { year: "2019", text: "Pembuatan modul Training of Trainers & pelatihan perdana di MTsN 13 Jakarta Timur." },
  { year: "2020", text: "Lahirnya Kegiatan Gernas Mahasiswa dan Gernas Orang Tua." },
  { year: "2021", text: "Program Gernas Tastaba diluncurkan, Yayasan Penggerak Indonesia Cerdas berdiri." },
  { year: "2022", text: "Peluncuran Buku Ide Belajar Matematika dan Festival Belajar." },
  { year: "2023", text: "Terbentuknya Pusat Riset Penggerak Indonesia Cerdas (PRPIC)." },
  { year: "2024", text: "Terbentuknya Barisan Pengkaji Kebijakan Pendidikan (BAJIK)." },
];
