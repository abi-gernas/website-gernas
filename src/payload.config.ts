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

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Pages } from "./payload/collections/Pages";
import { Articles } from "./payload/collections/Articles";
import { Categories } from "./payload/collections/Categories";
import { SiteSettings } from "./payload/globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/** Benar bila proses ini adalah perintah `payload migrate*`. */
const isMigrating = process.argv.some((arg) => arg.startsWith("migrate"));

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,

  admin: {
    user: Users.slug,
    // Branding minimal sesuai PRD §7 — pakai admin panel bawaan Payload,
    // tanpa kustomisasi visual, untuk menjaga biaya Fase 1.
    meta: {
      titleSuffix: "— Gernas Tastaka",
    },
  },

  collections: [Pages, Articles, Categories, Media, Users],
  globals: [SiteSettings],

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
    },
    push: false, // skema hanya berubah lewat file migrasi yang tersimpan di repo
    migrationDir: path.resolve(dirname, "../migrations"),
  }),

  plugins: [
    // Field SEO (title, description, OG image) untuk Pages & Articles — FR-007
    seoPlugin({
      collections: ["pages", "articles"],
      uploadsCollection: "media",
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
      collections: { media: true },
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
