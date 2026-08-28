import { localizedPath, type Locale } from "./i18n";

export type NavChild = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };
export type NavCta = { label: string; href: string };

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
