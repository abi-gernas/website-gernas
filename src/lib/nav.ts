// Navigasi utama — direplikasi dari struktur menu WordPress existing
// (Beranda, Profil, Kemitraan, Publikasi) + grup "Mari Gabung" untuk CTA.

import { localizedPath, type Locale } from "./i18n";

export type NavChild = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

const navByLocale: Record<Locale, NavItem[]> = {
  id: [
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
      ],
    },
    {
      label: "Program",
      children: [
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
        {
          label: "Penggerak",
          href: "/tentang-gernas-tastaka#penggerak",
          desc: "Tim di balik gerakan",
        },
      ],
    },
    {
      label: "Informasi",
      children: [
        { label: "Publikasi", href: "/publikasi", desc: "Riset & kajian" },
        {
          label: "Kabar Terbaru",
          href: "/#kabar-terbaru",
          desc: "Berita & kolaborasi",
        },
      ],
    },
  ],
  en: [
    { label: "Home", href: "/" },
    {
      label: "Profile",
      children: [
        {
          label: "About Gernas Tastaka",
          href: "/tentang-gernas-tastaka",
          desc: "History, vision, mission, and the team",
        },
        { label: "Gallery", href: "/galeri", desc: "Program documentation" },
      ],
    },
    {
      label: "Partnerships",
      children: [
        { label: "Partners", href: "/mitra", desc: "Collaboration & CSR" },
        { label: "Donors", href: "/donatur", desc: "Support our programs" },
      ],
    },
    {
      label: "Programs",
      children: [
        {
          label: "Tumbuh Bersama",
          href: "/tumbuh-bersama",
          desc: "Teaching resource collection",
        },
        {
          label: "Belajar Bersama",
          href: "/belajar-bersama",
          desc: "Training programs",
        },
      ],
    },
    {
      label: "Get Involved",
      children: [
        { label: "Become a Partner", href: "/mitra", desc: "Collaborate with us" },
        { label: "Donate", href: "/donatur", desc: "Give your support" },
        {
          label: "Team",
          href: "/tentang-gernas-tastaka#penggerak",
          desc: "The people behind the movement",
        },
      ],
    },
    {
      label: "Information",
      children: [
        { label: "Publications", href: "/publikasi", desc: "Research & insights" },
        {
          label: "Latest News",
          href: "/#kabar-terbaru",
          desc: "News & collaborations",
        },
      ],
    },
  ],
};

const footerLinksByLocale: Record<
  Locale,
  { gernas: NavChild[]; aktivitas: NavChild[] }
> = {
  id: {
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
  },
  en: {
    gernas: [
      { label: "Home", href: "/" },
      { label: "About", href: "/tentang-gernas-tastaka" },
      { label: "Publications", href: "/publikasi" },
      { label: "Gallery", href: "/galeri" },
    ],
    aktivitas: [
      { label: "Belajar Bersama", href: "/belajar-bersama" },
      { label: "Tumbuh Bersama", href: "/tumbuh-bersama" },
      { label: "Team", href: "/tentang-gernas-tastaka#penggerak" },
      { label: "Partners", href: "/mitra" },
      { label: "Donate", href: "/donatur" },
    ],
  },
};

function localizeItem<T extends NavChild | NavItem>(item: T, locale: Locale): T {
  return {
    ...item,
    href: item.href ? localizedPath(item.href, locale) : item.href,
    children:
      "children" in item && item.children
        ? item.children.map((child) => localizeItem(child, locale))
        : undefined,
  };
}

export function getNavItems(locale: Locale): NavItem[] {
  return navByLocale[locale].map((item) => localizeItem(item, locale));
}

export function getFooterLinks(locale: Locale) {
  const links = footerLinksByLocale[locale];
  return {
    gernas: links.gernas.map((item) => localizeItem(item, locale)),
    aktivitas: links.aktivitas.map((item) => localizeItem(item, locale)),
  };
}

export const contact = {
  phone: "+62 822-6120-0029",
  email: "gernastastaka@gmail.com",
  emailAlt: "admin@gernastastaka.org",
  address:
    "Jl. Melati I No.58 D, Gandul, Kec. Cinere, Kota Depok, Jawa Barat 16514",
};
