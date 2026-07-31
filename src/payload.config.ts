import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { s3Storage } from "@payloadcms/storage-s3";
import { id as idTranslations } from "@payloadcms/translations/languages/id";
import { idCustomTranslations } from "./payload/i18n/id-custom";

import { livePreviewBreakpoints } from "./payload/utils/preview";
import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Pages } from "./payload/collections/Pages";
import { Articles } from "./payload/collections/Articles";
import { Categories } from "./payload/collections/Categories";
import { Penggerak } from "./payload/collections/Penggerak";
import { Mitra } from "./payload/collections/Mitra";
import { Video } from "./payload/collections/Video";
import { ModulPelatihan } from "./payload/collections/ModulPelatihan";
import { SiteSettings } from "./payload/globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/** Benar bila proses ini adalah perintah `payload migrate*`. */
const isMigrating = process.argv.some((arg) => arg.startsWith("migrate"));

/**
 * Basis URL publik Supabase Storage, diturunkan dari S3_ENDPOINT agar tidak
 * ada nilai yang perlu diisi dua kali.
 * https://<ref>.storage.supabase.co/storage/v1/s3
 *   -> https://<ref>.supabase.co/storage/v1/object/public/<bucket>
 */
const supabaseRef = process.env.S3_ENDPOINT?.match(/https:\/\/([^.]+)\./)?.[1] ?? "";
const supabasePublicBase = `https://${supabaseRef}.supabase.co/storage/v1/object/public/${process.env.S3_BUCKET}`;

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,

  admin: {
    user: Users.slug,
    // Branding minimal sesuai PRD §7 — pakai admin panel bawaan Payload,
    // tanpa kustomisasi visual, untuk menjaga biaya Fase 1.
    meta: {
      titleSuffix: "— Gernas Tastaka",
    },
    /**
     * Basis penyelesaian jalur komponen kustom (mis. RowLabel). Tanpa ini
     * Payload menghitungnya dari cwd, sehingga jalur di config harus diawali
     * "/src/…" — pemisahan yang mudah lupa saat berkas dipindahkan.
     */
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // Panduan singkat berbahasa Indonesia di beranda dasbor.
      beforeDashboard: ["/payload/components/PanduanDasbor#PanduanDasbor"],
    },
    /**
     * Ukuran layar yang bisa dipilih staf di bilah Live Preview. URL pratinjau
     * per koleksi diatur di masing-masing `admin.livePreview.url`; di sini
     * hanya pengaturan yang berlaku untuk semuanya.
     */
    livePreview: {
      breakpoints: livePreviewBreakpoints,
    },
  },

  /**
   * Urutan di sini menentukan urutan di bilah sisi dasbor. Dikelompokkan lewat
   * `admin.group` masing-masing koleksi: "Konten" (yang disunting sehari-hari),
   * "Data Situs" (daftar berulang yang dipakai blok), lalu "Pengaturan".
   */
  collections: [
    Pages,
    Articles,
    Categories,
    Media,
    Penggerak,
    Mitra,
    Video,
    ModulPelatihan,
    Users,
  ],
  globals: [SiteSettings],

  /**
   * Dua bahasa konten (FR i18n): `/` berbahasa Indonesia, `/en` berbahasa
   * Inggris. Hanya field yang ditandai `localized: true` yang punya dua versi —
   * judul halaman/artikel, judul bagian tiap blok, dan judul kartu. Isi panjang
   * (Teks Bebas, isi artikel, kutipan, linimasa) sengaja tidak diduakan.
   *
   * `fallback: true` penting: field Inggris yang dibiarkan kosong staf akan
   * menampilkan versi Indonesia, bukan kosong. Jadi halaman /en tetap utuh
   * sejak hari pertama dan penerjemahan bisa dikerjakan bertahap.
   */
  localization: {
    locales: [
      { code: "id", label: "Indonesia" },
      { code: "en", label: "English" },
    ],
    defaultLocale: "id",
    fallback: true,
  },

  editor: lexicalEditor(),

  /**
   * Antarmuka dasbor memakai bahasa Indonesia agar staf non-teknis tidak
   * menghadapi campuran dua bahasa (label kita ID, tombol bawaan EN).
   * Inggris tetap tersedia bila pengguna ingin menggantinya sendiri.
   */
  i18n: {
    fallbackLanguage: "id",
    // Sengaja hanya "id": Payload mendahulukan bahasa browser di atas
    // fallbackLanguage, sehingga staf dengan browser berbahasa Inggris akan
    // melihat dasbor campur dua bahasa. Menambahkan `en: enTranslations` di
    // sini akan mengembalikan opsi bahasa Inggris.
    supportedLanguages: { id: idTranslations },
    // Menambal teks plugin SEO & editor Lexical yang tidak punya berkas Indonesia.
    translations: { id: idCustomTranslations },
  },

  /**
   * Postgres standar (Supabase). CATATAN PORTABILITAS (FR-009 / KPI No.6):
   * jangan pakai fitur proprietary Supabase (Auth, RLS sebagai logika,
   * ekstensi non-standar) agar pg_dump/pg_restore ke server lain tetap utuh.
   *
   * - DATABASE_URI        : koneksi pooled (pgBouncer :6543) untuk runtime serverless
   * - DATABASE_URI_DIRECT : koneksi langsung (:5432) untuk migrasi/DDL
   */
  db: postgresAdapter({
    pool: {
      // Perintah migrasi butuh koneksi session (5432): pooler transaksi (6543)
      // tidak dapat menjalankan sebagian perintah DDL.
      connectionString: isMigrating
        ? (process.env.DATABASE_URI_DIRECT ?? process.env.DATABASE_URI ?? "")
        : (process.env.DATABASE_URI ?? ""),
      /**
       * Batas koneksi per instans fungsi. Default `pg` adalah 10, dan Vercel
       * bisa menghidupkan banyak instans sekaligus (build + traffic) — angka
       * itu cepat menghabiskan kuota pooler Supabase paket gratis. Halaman
       * publik hampir semuanya statis, jadi 3 sudah lebih dari cukup.
       */
      max: 3,
      // Lepas koneksi menganggur supaya instans idle tidak menahan slot.
      idleTimeoutMillis: 10_000,
    },
    push: false, // skema hanya berubah lewat file migrasi yang tersimpan di repo
    migrationDir: path.resolve(dirname, "../migrations"),
  }),

  plugins: [
    // Field SEO (title, description, OG image) untuk Pages & Articles — FR-007
    seoPlugin({
      collections: ["pages", "articles"],
      uploadsCollection: "media",
      /**
       * Pisahkan panel SEO ke tabnya sendiri. Tanpa ini field meta menempel di
       * bawah isi halaman, sehingga staf harus menggulir melewati seluruh
       * susunan blok untuk mencapainya. Tab "Konten" diambil dari tabs yang
       * sudah didefinisikan di koleksinya masing-masing.
       */
      tabbedUI: true,
      generateTitle: ({ doc }) => `${doc?.title ?? ""} | Gernas Tastaka`,
      generateDescription: ({ doc }) => doc?.excerpt ?? "",
    }),
    // Redirect 301 yang dikelola staf — dipakai middleware untuk URL WordPress lama
    redirectsPlugin({
      collections: ["pages", "articles"],
      overrides: {
        admin: { group: "Pengaturan" },
        labels: { singular: "Pengalihan URL", plural: "Pengalihan URL" },
      },
    }),
    /**
     * Penyimpanan media di Supabase Storage lewat protokol S3.
     *
     * Alasan: filesystem Vercel bersifat sementara — berkas yang diunggah staf
     * akan hilang setiap deploy ulang bila disimpan lokal.
     *
     * Portabilitas (FR-009): S3 adalah protokol standar, bukan API khusus
     * Supabase. Pindah ke penyedia lain (Cloudflare R2, MinIO, AWS) cukup
     * mengganti nilai env, tanpa mengubah kode.
     *
     * Dinonaktifkan otomatis bila env belum diisi, agar pengembangan lokal
     * tetap bisa jalan memakai disk.
     */
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      collections: {
        media: {
          /**
           * Sajikan berkas langsung dari CDN Supabase, bukan diteruskan lewat
           * server Next.js. Tanpa ini setiap gambar melewati /api/media/file/…
           * sehingga membebani fungsi serverless Vercel dan lebih lambat.
           * Aman karena bucket memang publik.
           */
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            [supabasePublicBase, prefix, filename].filter(Boolean).join("/"),
        },
      },
      bucket: process.env.S3_BUCKET ?? "",
      config: {
        endpoint: process.env.S3_ENDPOINT ?? "",
        region: process.env.S3_REGION ?? "ap-southeast-1",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
        forcePathStyle: true, // wajib untuk Supabase Storage
      },
    }),
  ],

  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  sharp,
});
