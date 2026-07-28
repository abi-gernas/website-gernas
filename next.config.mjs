import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Stray lockfiles exist in parent directories; pin the trace root to this app
  // so Next doesn't infer the wrong workspace root.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    /**
     * Batasi jumlah varian yang dihasilkan optimizer Vercel.
     *
     * Setiap kombinasi (URL sumber × lebar × kualitas) dihitung satu
     * transformasi terhadap kuota paket gratis. Default Next menyediakan 8
     * deviceSizes + 8 imageSizes; daftar di bawah dipangkas ke lebar yang
     * benar-benar diminta atribut `sizes` di komponen kita, sehingga jumlah
     * transformasi per gambar turun kira-kira separuh tanpa perubahan tampilan.
     */
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [128, 256, 384],
    formats: ["image/webp"],
    /**
     * Simpan hasil transformasi setahun. Sumbernya berkas ber-hash di Supabase
     * Storage yang tidak pernah berubah isi — gambar yang diganti staf selalu
     * mendapat nama baru, jadi TTL panjang tidak membuat konten basi, dan
     * mencegah aset yang sama ditransformasi ulang tiap kali cache kedaluwarsa.
     */
    minimumCacheTTL: 31_536_000,
    // Local migrated media lives in /public/media. Remote patterns kept as a
    // fallback for any asset still served from the legacy WordPress host.
    remotePatterns: [
      { protocol: "https", hostname: "www.gernastastaka.org" },
      { protocol: "https", hostname: "gernastastaka.org" },
      // Media yang dikelola CMS disajikan langsung dari Supabase Storage.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default withPayload(nextConfig);
