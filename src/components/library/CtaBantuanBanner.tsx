import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";

/**
 * Banner statis "Belum menemukan yang anda cari? / Hubungi Kami!" di footer
 * tiap halaman Library. Tautan mengarah ke halaman Mitra — itu satu-satunya
 * halaman yang sudah punya blok formulir kontak (`contactForm`) saat rencana
 * ini ditulis, lihat §5 riwayat pengerjaan.
 */
export function CtaBantuanBanner({ locale = "id" }: { locale?: Locale }) {
  const text =
    locale === "en"
      ? {
          title: "Haven't found what you're looking for?",
          body: "Our team is ready to help you find the right learning materials.",
          cta: "Contact Us",
        }
      : {
          title: "Belum menemukan yang anda cari?",
          body: "Tim kami siap membantu Anda menemukan materi pembelajaran yang tepat.",
          cta: "Hubungi Kami",
        };

  return (
    <section className="rounded-card bg-brand-navy px-6 py-10 text-center text-white sm:px-12">
      <h2 className="text-xl font-bold sm:text-2xl">{text.title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/80">{text.body}</p>
      <Link href={localizedPath("/mitra", locale)} className="btn-yellow mt-6 inline-flex">
        {text.cta}
      </Link>
    </section>
  );
}
