export const DEFAULT_LOCALE = "id";
export const LOCALES = ["id", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | undefined): value is Locale {
  return value === "id" || value === "en";
}

export function localeFromSegments(segments: string[] = []): Locale {
  return isLocale(segments[0]) ? segments[0] : DEFAULT_LOCALE;
}

export function removeLocaleSegment(segments: string[] = []): string[] {
  return isLocale(segments[0]) ? segments.slice(1) : segments;
}

export function splitLocalePath(pathname: string): {
  locale: Locale;
  pathWithoutLocale: string;
} {
  const [pathOnly] = pathname.split(/[?#]/);
  const segments = pathOnly.split("/").filter(Boolean);
  const locale = localeFromSegments(segments);
  const pathSegments = removeLocaleSegment(segments);
  return {
    locale,
    pathWithoutLocale: pathSegments.length ? `/${pathSegments.join("/")}` : "/",
  };
}

export function localizedPath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return path;
  }

  const [pathAndQuery, hash = ""] = path.split("#");
  const [pathOnly, query = ""] = pathAndQuery.split("?");
  const { pathWithoutLocale } = splitLocalePath(pathOnly || "/");
  const withLocale =
    locale === DEFAULT_LOCALE
      ? pathWithoutLocale
      : `/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

  return `${withLocale}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function localePathname(pathname: string, locale: Locale): string {
  return localizedPath(pathname || "/", locale);
}

export function localeLabel(locale: Locale): string {
  return locale === "en" ? "English" : "Indonesia";
}

/** Tag `Intl`/`toLocaleDateString` yang sesuai untuk format tanggal per locale. */
export function dateLocaleTag(locale: Locale): string {
  return locale === "en" ? "en-US" : "id-ID";
}

export const uiText = {
  id: {
    donate: "Donasi",
    latestNews: "Kabar Terbaru",
    contactUs: "Hubungi Kami",
    readMore: "Baca Selengkapnya",
    backToPublications: "Kembali ke Publikasi",
    moreNews: "Kabar Lainnya",
    training: "Pelatihan",
    module: "Modul",
    modulesEmpty: "Modul pelatihan akan segera diperbarui.",
    teamEmpty: "Daftar penggerak akan segera diperbarui.",
    partnersEmpty: "Daftar mitra akan segera diperbarui.",
    footerIntro:
      "Gerakan Nasional Pemberantasan Buta Matematika. Membangun pembelajaran yang bermakna dan bernalar.",
    footerActivity: "Aktivitas",
    footerContact: "Kontak",
    footerAddress: "Alamat",
    footerValues: ["Bernalar", "Kontekstual", "Sederhana", "Mendasar", "Bermakna"],
    skipToContent: "Lewati ke konten utama",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    contactInfo: "Informasi Kontak",
    contactTagline: "Yuk Berjejaring!",
    name: "Nama",
    phone: "Nomor Telepon",
    email: "Email",
    subject: "Subjek",
    message: "Pesan",
    namePlaceholder: "Tulis nama...",
    subjectPlaceholder: "Mis. Kerja sama CSR",
    messagePlaceholder: "Tulis pesan...",
    submitMessage: "Kirim Pesan",
    mailSubject: "Pesan dari Website",
    mailName: "Nama",
    mailPhone: "Telepon",
    oneTimeDonation: "Donasi Bebas",
    monthlyDonation: "Donasi Bulanan",
    donateNow: "DONASI SEKARANG",
    donationSoonTitle: "Fitur donasi online akan segera hadir",
    donationSoon:
      "Untuk donasi saat ini, silakan hubungi kami langsung. Donasi online akan segera hadir.",
    visiLabel: "Visi",
    misiLabel: "Misi",
    tataNilaiLabel: "Tata Nilai",
    teamShowMore: "Lihat Semua Penggerak",
    teamShowLess: "Tampilkan Lebih Sedikit",
    comingSoonEyebrow: "Segera Hadir",
    comingSoonTitle: "Halaman ini sedang kami siapkan",
    comingSoonBody:
      "Isinya masih dalam penyusunan dan akan tayang dalam waktu dekat. Terima kasih sudah menunggu.",
    notFoundEyebrow: "Kesalahan 404",
    notFoundTitle: "Halaman tidak ditemukan",
    notFoundBody:
      "Alamat yang dituju tidak ada atau sudah dipindahkan. Silakan kembali ke beranda untuk menelusuri halaman lain.",
    backHome: "Kembali ke Beranda",
  },
  en: {
    donate: "Donate",
    latestNews: "Latest News",
    contactUs: "Contact Us",
    readMore: "Read More",
    backToPublications: "Back to Publications",
    moreNews: "More News",
    training: "Training",
    module: "Module",
    modulesEmpty: "Training modules will be updated soon.",
    teamEmpty: "Team list will be updated soon.",
    partnersEmpty: "Partner list will be updated soon.",
    footerIntro:
      "A national movement to eradicate mathematical illiteracy and build meaningful, reasoned learning.",
    footerActivity: "Activities",
    footerContact: "Contact",
    footerAddress: "Address",
    footerValues: ["Reasoned", "Contextual", "Simple", "Foundational", "Meaningful"],
    skipToContent: "Skip to main content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    contactInfo: "Contact Information",
    contactTagline: "Let's connect.",
    name: "Name",
    phone: "Phone Number",
    email: "Email",
    subject: "Subject",
    message: "Message",
    namePlaceholder: "Write your name...",
    subjectPlaceholder: "E.g. CSR partnership",
    messagePlaceholder: "Write your message...",
    submitMessage: "Send Message",
    mailSubject: "Message from Website",
    mailName: "Name",
    mailPhone: "Phone",
    oneTimeDonation: "One-time Donation",
    monthlyDonation: "Monthly Donation",
    donateNow: "DONATE NOW",
    donationSoonTitle: "Online donations are coming soon",
    donationSoon:
      "For now, please contact us directly to donate. Online donations are coming soon.",
    visiLabel: "Vision",
    misiLabel: "Mission",
    tataNilaiLabel: "Values",
    teamShowMore: "View All Movers",
    teamShowLess: "Show Less",
    comingSoonEyebrow: "Coming Soon",
    comingSoonTitle: "This page is being prepared",
    comingSoonBody:
      "We are still putting this page together and it will be live soon. Thank you for your patience.",
    notFoundEyebrow: "Error 404",
    notFoundTitle: "Page not found",
    notFoundBody:
      "The address you are looking for does not exist or has been moved. Head back to the home page to explore the rest of the site.",
    backHome: "Back to Home",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;
