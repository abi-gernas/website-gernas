import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Halaman /alat-peraga dihapus, alat peraga pindah jadi Jenis materi "Alat Peraga"
  // di koleksi Produk. Data yang masih menunjuk nilai enum lama dibersihkan dulu,
  // kalau tidak cast enum di bawah gagal. Dokumen alat peraga lama cuma dummy QA.
  await db.execute(sql`
   DELETE FROM "navigation_items_children" WHERE "preset" = '/alat-peraga';
  UPDATE "navigation_items" SET "preset" = '/buku-bahan-ajar-modul' WHERE "preset" = '/alat-peraga';
  UPDATE "navigation" SET "cta_button_preset" = '/buku-bahan-ajar-modul' WHERE "cta_button_preset" = '/alat-peraga';
  DELETE FROM "pages_blocks_perangkat_guru_kartu" WHERE "katalog" = 'alatPeraga';
  DELETE FROM "_pages_v_blocks_perangkat_guru_kartu" WHERE "katalog" = 'alatPeraga';
  UPDATE "pages_blocks_perangkat_guru_panel_statistik" SET "sumber" = 'produk' WHERE "sumber" = 'alatPeraga';
  UPDATE "_pages_v_blocks_perangkat_guru_panel_statistik" SET "sumber" = 'produk' WHERE "sumber" = 'alatPeraga';`)

  await db.execute(sql`
   ALTER TYPE "public"."enum_produk_kategori_produk" ADD VALUE 'alat-peraga';
  ALTER TABLE "alat_peraga_jenjang" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_mapel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_galeri_foto" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_isi_paket" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_isi_paket_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "alat_peraga_jenjang" CASCADE;
  DROP TABLE "alat_peraga_mapel" CASCADE;
  DROP TABLE "alat_peraga_galeri_foto" CASCADE;
  DROP TABLE "alat_peraga_isi_paket" CASCADE;
  DROP TABLE "alat_peraga_isi_paket_locales" CASCADE;
  DROP TABLE "alat_peraga" CASCADE;
  DROP TABLE "alat_peraga_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_alat_peraga_fk";
  
  ALTER TABLE "pages_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DEFAULT 'produk'::text;
  DROP TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_katalog";
  CREATE TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_katalog" AS ENUM('produk', 'videoPembelajaran', 'mediaInteraktif');
  ALTER TABLE "pages_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DEFAULT 'produk'::"public"."enum_pages_blocks_perangkat_guru_kartu_katalog";
  ALTER TABLE "pages_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DATA TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_katalog" USING "katalog"::"public"."enum_pages_blocks_perangkat_guru_kartu_katalog";
  ALTER TABLE "pages_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DEFAULT 'produk'::text;
  DROP TYPE "public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber";
  CREATE TYPE "public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber" AS ENUM('produk', 'videoPembelajaran', 'mediaInteraktif', 'semua', 'manual');
  ALTER TABLE "pages_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DEFAULT 'produk'::"public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber";
  ALTER TABLE "pages_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DATA TYPE "public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber" USING "sumber"::"public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber";
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DEFAULT 'produk'::text;
  DROP TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog";
  CREATE TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog" AS ENUM('produk', 'videoPembelajaran', 'mediaInteraktif');
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DEFAULT 'produk'::"public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog";
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DATA TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog" USING "katalog"::"public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog";
  ALTER TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DEFAULT 'produk'::text;
  DROP TYPE "public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber";
  CREATE TYPE "public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber" AS ENUM('produk', 'videoPembelajaran', 'mediaInteraktif', 'semua', 'manual');
  ALTER TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DEFAULT 'produk'::"public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber";
  ALTER TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DATA TYPE "public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber" USING "sumber"::"public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber";
  ALTER TABLE "navigation_items_children" ALTER COLUMN "preset" SET DATA TYPE text;
  ALTER TABLE "navigation_items_children" ALTER COLUMN "preset" SET DEFAULT '__custom__'::text;
  DROP TYPE "public"."enum_navigation_items_children_preset";
  CREATE TYPE "public"."enum_navigation_items_children_preset" AS ENUM('/', '/tentang-gernas-tastaka', '/galeri', '/mitra', '/donatur', '/tumbuh-bersama', '/belajar-bersama', '/publikasi', '/pojok-guru', '/buku-bahan-ajar-modul', '/video-pembelajaran', '/media-interaktif', '/belajar-bersama#jadwal-acara', '__custom__');
  ALTER TABLE "navigation_items_children" ALTER COLUMN "preset" SET DEFAULT '__custom__'::"public"."enum_navigation_items_children_preset";
  ALTER TABLE "navigation_items_children" ALTER COLUMN "preset" SET DATA TYPE "public"."enum_navigation_items_children_preset" USING "preset"::"public"."enum_navigation_items_children_preset";
  ALTER TABLE "navigation_items" ALTER COLUMN "preset" SET DATA TYPE text;
  ALTER TABLE "navigation_items" ALTER COLUMN "preset" SET DEFAULT '__custom__'::text;
  DROP TYPE "public"."enum_navigation_items_preset";
  CREATE TYPE "public"."enum_navigation_items_preset" AS ENUM('/', '/tentang-gernas-tastaka', '/galeri', '/mitra', '/donatur', '/tumbuh-bersama', '/belajar-bersama', '/publikasi', '/pojok-guru', '/buku-bahan-ajar-modul', '/video-pembelajaran', '/media-interaktif', '/belajar-bersama#jadwal-acara', '__custom__');
  ALTER TABLE "navigation_items" ALTER COLUMN "preset" SET DEFAULT '__custom__'::"public"."enum_navigation_items_preset";
  ALTER TABLE "navigation_items" ALTER COLUMN "preset" SET DATA TYPE "public"."enum_navigation_items_preset" USING "preset"::"public"."enum_navigation_items_preset";
  ALTER TABLE "navigation" ALTER COLUMN "cta_button_preset" SET DATA TYPE text;
  ALTER TABLE "navigation" ALTER COLUMN "cta_button_preset" SET DEFAULT '/donatur'::text;
  DROP TYPE "public"."enum_navigation_cta_button_preset";
  CREATE TYPE "public"."enum_navigation_cta_button_preset" AS ENUM('/', '/tentang-gernas-tastaka', '/galeri', '/mitra', '/donatur', '/tumbuh-bersama', '/belajar-bersama', '/publikasi', '/pojok-guru', '/buku-bahan-ajar-modul', '/video-pembelajaran', '/media-interaktif', '/belajar-bersama#jadwal-acara', '__custom__');
  ALTER TABLE "navigation" ALTER COLUMN "cta_button_preset" SET DEFAULT '/donatur'::"public"."enum_navigation_cta_button_preset";
  ALTER TABLE "navigation" ALTER COLUMN "cta_button_preset" SET DATA TYPE "public"."enum_navigation_cta_button_preset" USING "cta_button_preset"::"public"."enum_navigation_cta_button_preset";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_alat_peraga_id_idx";
  ALTER TABLE "produk" ALTER COLUMN "status" DROP NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "alat_peraga_id";
  DROP TYPE "public"."enum_alat_peraga_jenjang";
  DROP TYPE "public"."enum_alat_peraga_mapel";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_alat_peraga_jenjang" AS ENUM('paud', 'tk', 'sd', 'smp', 'sma');
  CREATE TYPE "public"."enum_alat_peraga_mapel" AS ENUM('matematika', 'membaca');
  ALTER TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_katalog" ADD VALUE 'alatPeraga' BEFORE 'videoPembelajaran';
  ALTER TYPE "public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber" ADD VALUE 'alatPeraga' BEFORE 'videoPembelajaran';
  ALTER TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog" ADD VALUE 'alatPeraga' BEFORE 'videoPembelajaran';
  ALTER TYPE "public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber" ADD VALUE 'alatPeraga' BEFORE 'videoPembelajaran';
  ALTER TYPE "public"."enum_navigation_items_children_preset" ADD VALUE '/alat-peraga' BEFORE '/video-pembelajaran';
  ALTER TYPE "public"."enum_navigation_items_preset" ADD VALUE '/alat-peraga' BEFORE '/video-pembelajaran';
  ALTER TYPE "public"."enum_navigation_cta_button_preset" ADD VALUE '/alat-peraga' BEFORE '/video-pembelajaran';
  CREATE TABLE "alat_peraga_jenjang" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_alat_peraga_jenjang",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "alat_peraga_mapel" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_alat_peraga_mapel",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "alat_peraga_galeri_foto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gambar_id" integer NOT NULL
  );
  
  CREATE TABLE "alat_peraga_isi_paket" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "alat_peraga_isi_paket_locales" (
  	"teks" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "alat_peraga" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"cover_id" integer NOT NULL,
  	"urutan" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "alat_peraga_locales" (
  	"judul" varchar NOT NULL,
  	"subjudul" varchar,
  	"deskripsi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "produk" ALTER COLUMN "kategori_produk" SET DATA TYPE text;
  ALTER TABLE "produk" ALTER COLUMN "kategori_produk" SET DEFAULT 'modul'::text;
  DROP TYPE "public"."enum_produk_kategori_produk";
  CREATE TYPE "public"."enum_produk_kategori_produk" AS ENUM('modul', 'buku', 'bahan-ajar', 'lks');
  ALTER TABLE "produk" ALTER COLUMN "kategori_produk" SET DEFAULT 'modul'::"public"."enum_produk_kategori_produk";
  ALTER TABLE "produk" ALTER COLUMN "kategori_produk" SET DATA TYPE "public"."enum_produk_kategori_produk" USING "kategori_produk"::"public"."enum_produk_kategori_produk";
  ALTER TABLE "produk" ALTER COLUMN "status" SET NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "alat_peraga_id" integer;
  ALTER TABLE "alat_peraga_jenjang" ADD CONSTRAINT "alat_peraga_jenjang_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga_mapel" ADD CONSTRAINT "alat_peraga_mapel_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga_galeri_foto" ADD CONSTRAINT "alat_peraga_galeri_foto_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "alat_peraga_galeri_foto" ADD CONSTRAINT "alat_peraga_galeri_foto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga_isi_paket" ADD CONSTRAINT "alat_peraga_isi_paket_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga_isi_paket_locales" ADD CONSTRAINT "alat_peraga_isi_paket_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alat_peraga_isi_paket"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga" ADD CONSTRAINT "alat_peraga_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "alat_peraga_locales" ADD CONSTRAINT "alat_peraga_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "alat_peraga_jenjang_order_idx" ON "alat_peraga_jenjang" USING btree ("order");
  CREATE INDEX "alat_peraga_jenjang_parent_idx" ON "alat_peraga_jenjang" USING btree ("parent_id");
  CREATE INDEX "alat_peraga_mapel_order_idx" ON "alat_peraga_mapel" USING btree ("order");
  CREATE INDEX "alat_peraga_mapel_parent_idx" ON "alat_peraga_mapel" USING btree ("parent_id");
  CREATE INDEX "alat_peraga_galeri_foto_order_idx" ON "alat_peraga_galeri_foto" USING btree ("_order");
  CREATE INDEX "alat_peraga_galeri_foto_parent_id_idx" ON "alat_peraga_galeri_foto" USING btree ("_parent_id");
  CREATE INDEX "alat_peraga_galeri_foto_gambar_idx" ON "alat_peraga_galeri_foto" USING btree ("gambar_id");
  CREATE INDEX "alat_peraga_isi_paket_order_idx" ON "alat_peraga_isi_paket" USING btree ("_order");
  CREATE INDEX "alat_peraga_isi_paket_parent_id_idx" ON "alat_peraga_isi_paket" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "alat_peraga_isi_paket_locales_locale_parent_id_unique" ON "alat_peraga_isi_paket_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "alat_peraga_slug_idx" ON "alat_peraga" USING btree ("slug");
  CREATE INDEX "alat_peraga_cover_idx" ON "alat_peraga" USING btree ("cover_id");
  CREATE INDEX "alat_peraga_updated_at_idx" ON "alat_peraga" USING btree ("updated_at");
  CREATE INDEX "alat_peraga_created_at_idx" ON "alat_peraga" USING btree ("created_at");
  CREATE UNIQUE INDEX "alat_peraga_locales_locale_parent_id_unique" ON "alat_peraga_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_alat_peraga_fk" FOREIGN KEY ("alat_peraga_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_alat_peraga_id_idx" ON "payload_locked_documents_rels" USING btree ("alat_peraga_id");`)
}
