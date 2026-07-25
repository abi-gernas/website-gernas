// Navigasi utama — direplikasi dari struktur menu WordPress existing
// (Beranda, Profil, Kemitraan, Publikasi) + grup "Mari Gabung" untuk CTA.

export type NavChild = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

export const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Profil",
    children: [
      {
        label: "Tentang Gernas Tastaka",
        href: "/tentang-gernas-tastaka",
        desc: "Sejarah, visi-misi, dan para penggerak",
      },
      { label: "Galeri", href: "/galeri", desc: "Dokumentasi kegiatan" },
    ],
  },
  {
    label: "Kemitraan",
    children: [
      { label: "Mitra", href: "/mitra", desc: "Kolaborasi & CSR" },
      { label: "Donatur", href: "/donatur", desc: "Dukung program kami" },
      {
        label: "Tumbuh Bersama",
        href: "/tumbuh-bersama",
        desc: "Kompilasi bahan ajar",
      },
      {
        label: "Belajar Bersama",
        href: "/belajar-bersama",
        desc: "Program pelatihan",
      },
    ],
  },
  {
    label: "Mari Gabung",
    children: [
      { label: "Jadi Mitra", href: "/mitra", desc: "Berkolaborasi bersama" },
      { label: "Donasi", href: "/donatur", desc: "Berikan dukungan" },
      { label: "Penggerak", href: "/tentang-gernas-tastaka#penggerak", desc: "Tim di balik gerakan" },
    ],
  },
  {
    label: "Informasi",
    children: [
      { label: "Publikasi", href: "/publikasi", desc: "Riset & kajian" },
      { label: "Kabar Terbaru", href: "/#kabar-terbaru", desc: "Berita & kolaborasi" },
    ],
  },
];

export const footerLinks = {
  gernas: [
    { label: "Beranda", href: "/" },
    { label: "Tentang", href: "/tentang-gernas-tastaka" },
    { label: "Publikasi", href: "/publikasi" },
    { label: "Galeri", href: "/galeri" },
  ],
  aktivitas: [
    { label: "Belajar Bersama", href: "/belajar-bersama" },
    { label: "Tumbuh Bersama", href: "/tumbuh-bersama" },
    { label: "Penggerak", href: "/tentang-gernas-tastaka#penggerak" },
    { label: "Mitra", href: "/mitra" },
    { label: "Donasi", href: "/donatur" },
  ],
};

export const contact = {
  phone: "+62 822-6120-0029",
  email: "gernastastaka@gmail.com",
  emailAlt: "admin@gernastastaka.org",
  address:
    "Jl. Melati I No.58 D, Gandul, Kec. Cinere, Kota Depok, Jawa Barat 16514",
};
