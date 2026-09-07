import Image from "next/image";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";

/**
 * Banner statis "Belum menemukan yang anda cari? / Hubungi Kami!" di footer
 * tiap halaman Library (4 halaman daftar + 4 halaman detail memakai komponen
 * yang sama — ubah di sini, semuanya ikut).
 *
 * Susunan mengikuti referensi 7 Sep 2026: ilustrasi CS menempel di tepi kiri
 * bawah kartu navy, teks di tengah, tombol garis-putih di kanan. Ilustrasinya
 * `absolute` + `object-bottom` supaya kakinya selalu rata dengan dasar kartu
 * berapa pun tinggi teksnya, dan disembunyikan di bawah `lg` karena di layar
 * sempit ia mendesak teks — sifatnya dekoratif (`alt=""`), bukan informasi.
 *
 * Ikon tombolnya sengaja gelembung obrolan, **bukan** logo WhatsApp seperti
 * di referensi: belum ada nomor WhatsApp resmi di mana pun (SiteSettings
 * maupun kode), jadi tombolnya masih mendarat di halaman Mitra — satu-satunya
 * halaman yang punya blok formulir kontak. Begitu nomornya ada, ganti `href`
 * jadi `wa.me/<nomor>` sekaligus ikonnya jadi logo WhatsApp.
 */

/** Ilustrasi CS. Berkasnya statis di `public/`, bukan dokumen Media — banner ini tidak diatur dari CMS. */
const ILUSTRASI = "/ilustrasi/cs-bantuan.png";

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
    <section className="relative overflow-hidden rounded-card bg-brand-navy px-6 py-8 text-white shadow-card sm:px-10 sm:py-10 lg:min-h-[184px] lg:py-9 lg:pl-64 lg:pr-10">
      <Image
        src={ILUSTRASI}
        alt=""
        aria-hidden="true"
        width={313}
        height={313}
        className="pointer-events-none absolute bottom-0 left-6 hidden h-[168px] w-auto object-contain object-bottom lg:block"
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">{text.title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">{text.body}</p>
        </div>
        <Link
          href={localizedPath("/mitra", locale)}
          className="btn shrink-0 self-start border border-white/80 bg-transparent text-white hover:bg-white hover:text-brand-navy lg:self-auto"
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
      </div>
    </section>
  );
}
