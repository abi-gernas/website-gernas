// Konten terstruktur hasil migrasi WordPress → dipetakan ke komponen DS v2.0.
// Teks & angka direplikasi dari konten asli (Pages home-page, tentang, mitra, dll.).

import type { HeroSlide } from "@/components/Hero";
import type { ValueCard } from "@/components/ValueCards";
import type { Stat } from "@/components/StatCounterRow";
import type { Testimonial } from "@/components/TestimonialCarousel";
import type { Partner } from "@/components/PartnerLogoGrid";
import type { VideoItem } from "@/components/VideoCard";

const M = (f: string) => `/media/${f}`;

export const homeSlides: HeroSlide[] = [
  {
    title:
      "Membangun Fondasi Masa Depan Indonesia Melalui Pembelajaran Matematika dan Membaca yang",
    highlight: "Bermakna dan Bernalar",
    description:
      "Gernas Tastaka siap bermitra dengan semua elemen bangsa untuk kemajuan Pendidikan Dasar Indonesia.",
    image: M("hero-beranda.jpg"),
    cta: { label: "Mari Belajar!", href: "/belajar-bersama" },
  },
  {
    title: "Matematika Sebagai Fondasi Kemampuan",
    highlight: "Bernalar",
    description:
      "Gernas Tastaka menemani guru SD/MI membelajarkan matematika yang bernalar, sederhana, mendasar, dan kontekstual.",
    image: M("Gernas-Tastaka-scaled.jpg"),
    cta: { label: "Program Pelatihan", href: "/belajar-bersama" },
  },
  {
    title: "Membaca Sebagai Fondasi Kemampuan",
    highlight: "Belajar",
    description:
      "Gernas Tastaba, Gerakan Nasional Pemberantasan Buta Membaca, meningkatkan kompetensi guru dalam pembelajaran membaca bermakna.",
    image: M("hero-membaca.jpg"),
    cta: { label: "Tumbuh Bersama", href: "/tumbuh-bersama" },
  },
];

export const homeValueCards: ValueCard[] = [
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
];

export const homeStats: Stat[] = [
  { value: 16000, suffix: "+", label: "Total Pendidik" },
  { value: 400, suffix: "+", label: "Total Waktu Pelatihan" },
  { value: 21, label: "Jumlah Provinsi" },
  { value: 62, label: "Jumlah Kab/Kota" },
  { value: 45000, suffix: "+", label: "Total Peserta Didik" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Pemerintah tidak bisa menjadi satu-satunya yang paling tahu, paling bisa, dan paling mengerti berbagai kondisi yang ada di lapangan. Jika kita bersatu, jika kita bisa berhimpun sebagai satu kekuatan ekosistem, kita bisa melakukan berbagai hal yang berdampak sangat signifikan kepada murid — terutama terhadap kompetensi dasar. Karena itu, Gernas Tastaka memperkuat kompetensi dasar ini.",
    name: "Dr. Iwan Syahril",
    role: "Direktur Jenderal Guru dan Tenaga Kependidikan, Kemendikbud Ristek 2020–2022",
    tone: "yellow",
  },
  {
    quote:
      "Ketika saya kuliah belum ada pembelajaran seperti yang diajarkan di Gernas Tastaka; biasanya kuliah langsung teorinya saja. Ternyata di pelatihan Gernas Tastaka kami langsung menerapkan hal-hal yang nyata, dan konsep-konsepnya juga sangat mudah dipahami untuk anak-anak tingkat SD.",
    name: "Efti Ayu Pertiwi, S.Pd.",
    role: "Guru SDN 10 Lahat",
    tone: "navy",
  },
  {
    quote:
      "Tanpa sumber daya manusia yang unggul, sulit menyebarkan kebaikan dan membangkitkan inovasi. Tadris Matematika lahir dari keinginan membangun peradaban baru Indonesia yang inovatif dan senantiasa menyebarkan kebaikan serta kebermanfaatan bagi masyarakat luas.",
    name: "Salman Subakat",
    role: "CEO PT. Paragon Technology and Innovation 2019–2022",
    tone: "red",
  },
];

// Logo mitra untuk strip beranda + halaman Mitra
export const partnerGroups: { title: string; partners: Partner[] }[] = [
  {
    title: "Mitra Kolaborasi Pemerintah Pusat & Daerah",
    partners: [
      { name: "Kemendikbud Ristek", logo: M("Kemendikbud.png") },
      { name: "Pemerintah Daerah", logo: M("1-1-150x150.png") },
      { name: "Pemerintah Daerah", logo: M("3-1-266x300.png") },
      { name: "Pemerintah Daerah", logo: M("6-241x300.png") },
      { name: "Pemerintah Daerah", logo: M("10-222x300.png") },
      { name: "Pemerintah Daerah", logo: M("5-205x300.png") },
      { name: "Pemerintah Daerah", logo: M("7-250x300.png") },
    ],
  },
  {
    title: "Mitra Kolaborasi Korporasi & NGO",
    partners: [
      { name: "PT Bukit Asam (PTBA)", logo: M("516e3222f6b4954c0461b4eb0d924d8becd97a85-e1766749522698.png") },
      { name: "ParagonCorp", logo: M("1deefc02027d5af12086f79640e09df8bd67d596-300x71.png") },
      { name: "PT Timah", logo: M("Timah-300x85.png") },
      { name: "LP Ma'arif NU", logo: M("NU.png") },
    ],
  },
  {
    title: "Mitra Kolaborasi Pendidikan & Perguruan Tinggi",
    partners: [
      { name: "Universitas Indonesia", logo: M("UI.png") },
      { name: "SEAMOLEC", logo: M("logo-seamolec-png-3.png") },
      { name: "PSPK", logo: M("pspk.png") },
      { name: "SDIT Wahid Hasyim", logo: M("SDITWahidHasyim-300x247.png") },
      { name: "Top Karir", logo: M("Top-Karir-.png") },
      { name: "Perguruan Tinggi Mitra", logo: M("24.png") },
      { name: "Perguruan Tinggi Mitra", logo: M("23-242x300.png") },
      { name: "Perguruan Tinggi Mitra", logo: M("25-300x293.png") },
    ],
  },
];

export const homePartners: Partner[] = [
  { name: "Kemendikbud Ristek", logo: M("Kemendikbud.png") },
  { name: "PT Bukit Asam (PTBA)", logo: M("516e3222f6b4954c0461b4eb0d924d8becd97a85-e1766749522698.png") },
  { name: "ParagonCorp", logo: M("1deefc02027d5af12086f79640e09df8bd67d596-300x71.png") },
  { name: "PT Timah", logo: M("Timah-300x85.png") },
  { name: "LP Ma'arif NU", logo: M("NU.png") },
  { name: "Universitas Indonesia", logo: M("UI.png") },
  { name: "SEAMOLEC", logo: M("logo-seamolec-png-3.png") },
];

export const homeVideos: VideoItem[] = [
  {
    title: "Geliat Numerasi di Bukit Salero",
    thumb: M("d920fde16fc2cecdd919853d2dc0780b04b6d561-1024x683.jpg"),
  },
  {
    title: "Bincang Gernas 20: Strategi Visualisasi untuk Memaknai Bacaan",
    thumb: M("3cd58ec130639eead362c8aa7add291a98125026-1024x576.png"),
  },
  {
    title: "Svara: Guru Pembaca Muara Enim",
    thumb: M("9d4731faa1d3cfcb4cf090a671d59dcee2548d63-1024x461.jpg"),
  },
  {
    title: "Bincang Gernas Tastaba #3 — Program Literasi TK–SD",
    thumb: M("a62478c69373dac00744305b53d073eec68b42c1-1024x461.jpg"),
  },
];

// Tiga lembaga di bawah Penggerak Indonesia Cerdas (blok "Tentang" beranda)
export const orgTrio = [
  {
    name: "PRPIC",
    full: "Pusat Riset Penggerak Indonesia Cerdas",
    body: "Lembaga riset akademik di bidang pendidikan dasar yang berfokus menghasilkan karya ilmiah dan diseminasi hasil penelitian.",
    image: M("PRPIC-1024x296.png"),
  },
  {
    name: "Bajik",
    full: "Barisan Pengkaji Kebijakan Pendidikan Dasar",
    body: "Lembaga kajian kebijakan dan edukasi publik yang berfokus pada isu-isu fundamental pendidikan dasar di Indonesia.",
    image: M("Bajik-1024x392.png"),
  },
];

export const heroImages = {
  mitra: M("cd9ec685e814f9693bd11630a7d12d7632653fd2-1024x576.png"),
  tentang: M("d221fada6760065a77ff51077fa0a62a4b2eff38-1024x663.png"),
  tumbuh: M("WhatsApp-Image-2025-12-06-at-11.18.19-AM-1024x381.jpeg"),
  belajar: M("2e179e5cac71ab5008e6663239b32edb18a9568e-Medium.jpg"),
  donatur: M("bc60fc4e7b2ccccdfc8ca6310a9ab98bc102f86e-1024x576.jpg"),
};
