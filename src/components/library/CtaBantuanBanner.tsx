import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";

/**
 * Banner statis "Belum menemukan yang anda cari? / Hubungi Kami!" di footer
 * tiap halaman Library. Tautan mengarah ke halaman Mitra — itu satu-satunya
 * halaman yang sudah punya blok formulir kontak (`contactForm`) saat rencana
 * ini ditulis, lihat §5 riwayat pengerjaan.
 *
 * Tata letaknya diubah jadi mendatar (teks kiri, tombol kanan) pada 26 Agu
 * 2026 mengikuti mockup Media Digital Interaktif. Komponen ini dipakai
 * keempat halaman Library, jadi tiga halaman lain ikut berubah — mockup
 * masing-masing memperlihatkan banner yang sama.
 *
 * Ikon tombolnya sengaja gelembung obrolan, **bukan** logo WhatsApp seperti
 * di mockup: belum ada nomor WhatsApp resmi di mana pun (SiteSettings maupun
 * kode), jadi tombolnya masih mendarat di halaman Mitra. Ganti ikon + href
 * begitu nomornya tersedia.
 */
export function CtaBantuanBanner({ locale = "id" }: { locale?: Locale }) {
  const text =
    locale === "en"
      ? {
          title: "Haven't found what you're looking for?",
          body: "We are ready to help you find the learning materials that fit your needs.",
          cta: "Contact Us",
        }
      : {
          title: "Belum menemukan yang anda cari?",
          body: "Kami siap membantu Anda menemukan perangkat pembelajaran yang sesuai dengan kebutuhan Anda.",
          cta: "Hubungi Kami!",
        };

  return (
    <section className="flex flex-col gap-6 rounded-card bg-brand-navy px-6 py-8 text-white sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">{text.title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">{text.body}</p>
      </div>
      <Link
        href={localizedPath("/mitra", locale)}
        className="btn shrink-0 self-start border border-white/70 bg-transparent text-white hover:bg-white hover:text-brand-navy lg:self-auto"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.9A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" />
        </svg>
        {text.cta}
      </Link>
    </section>
  );
}
