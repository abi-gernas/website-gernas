import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_produk_jenjang" AS ENUM('paud', 'tk', 'sd', 'smp', 'sma');
  CREATE TYPE "public"."enum_produk_mapel" AS ENUM('matematika', 'membaca');
  CREATE TYPE "public"."enum_produk_format" AS ENUM('pdf', 'cetak');
  CREATE TYPE "public"."enum_produk_kategori_produk" AS ENUM('modul', 'buku', 'bahan-ajar', 'lks');
  CREATE TYPE "public"."enum_produk_status" AS ENUM('gratis', 'berbayar');
  CREATE TYPE "public"."enum_alat_peraga_jenjang" AS ENUM('paud', 'tk', 'sd', 'smp', 'sma');
  CREATE TYPE "public"."enum_alat_peraga_mapel" AS ENUM('matematika', 'membaca');
  CREATE TYPE "public"."enum_video_pembelajaran_jenjang" AS ENUM('paud', 'tk', 'sd', 'smp', 'sma');
  CREATE TYPE "public"."enum_video_pembelajaran_mapel" AS ENUM('matematika', 'membaca');
  CREATE TYPE "public"."enum_video_pembelajaran_sumber_tipe" AS ENUM('youtube', 'upload');
  CREATE TYPE "public"."enum_leads_jenis" AS ENUM('kontak', 'unduhan-materi');
  CREATE TABLE "produk_jenjang" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_produk_jenjang",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "produk_mapel" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_produk_mapel",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "produk_fitur_unggulan" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "produk_fitur_unggulan_locales" (
  	"teks" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "produk_format" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_produk_format",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "produk" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"kategori_produk" "enum_produk_kategori_produk" DEFAULT 'modul' NOT NULL,
  	"cover_id" integer NOT NULL,
  	"status" "enum_produk_status" DEFAULT 'gratis' NOT NULL,
  	"harga" numeric,
  	"tautan_drive" varchar,
  	"urutan" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "produk_locales" (
  	"judul" varchar NOT NULL,
  	"ringkasan" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
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
  
  CREATE TABLE "video_pembelajaran_jenjang" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_video_pembelajaran_jenjang",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "video_pembelajaran_mapel" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_video_pembelajaran_mapel",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "video_pembelajaran" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"thumbnail_id" integer NOT NULL,
  	"sumber_tipe" "enum_video_pembelajaran_sumber_tipe" DEFAULT 'youtube' NOT NULL,
  	"tautan_youtube" varchar,
  	"berkas_video_id" integer,
  	"durasi" varchar,
  	"urutan" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "video_pembelajaran_locales" (
  	"judul" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_interaktif_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "media_interaktif_tags_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "media_interaktif" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"thumbnail_id" integer NOT NULL,
  	"tautan" varchar NOT NULL,
  	"urutan" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media_interaktif_locales" (
  	"judul" varchar NOT NULL,
  	"deskripsi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "leads" ADD COLUMN "jenis" "enum_leads_jenis" DEFAULT 'kontak' NOT NULL;
  ALTER TABLE "leads" ADD COLUMN "asal_instansi" varchar;
  ALTER TABLE "leads" ADD COLUMN "produk_ref_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "produk_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "alat_peraga_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "video_pembelajaran_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_interaktif_id" integer;
  ALTER TABLE "produk_jenjang" ADD CONSTRAINT "produk_jenjang_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produk_mapel" ADD CONSTRAINT "produk_mapel_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produk_fitur_unggulan" ADD CONSTRAINT "produk_fitur_unggulan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produk_fitur_unggulan_locales" ADD CONSTRAINT "produk_fitur_unggulan_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produk_fitur_unggulan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produk_format" ADD CONSTRAINT "produk_format_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produk" ADD CONSTRAINT "produk_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produk_locales" ADD CONSTRAINT "produk_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga_jenjang" ADD CONSTRAINT "alat_peraga_jenjang_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga_mapel" ADD CONSTRAINT "alat_peraga_mapel_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga_galeri_foto" ADD CONSTRAINT "alat_peraga_galeri_foto_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "alat_peraga_galeri_foto" ADD CONSTRAINT "alat_peraga_galeri_foto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga_isi_paket" ADD CONSTRAINT "alat_peraga_isi_paket_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga_isi_paket_locales" ADD CONSTRAINT "alat_peraga_isi_paket_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alat_peraga_isi_paket"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alat_peraga" ADD CONSTRAINT "alat_peraga_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "alat_peraga_locales" ADD CONSTRAINT "alat_peraga_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "video_pembelajaran_jenjang" ADD CONSTRAINT "video_pembelajaran_jenjang_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."video_pembelajaran"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "video_pembelajaran_mapel" ADD CONSTRAINT "video_pembelajaran_mapel_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."video_pembelajaran"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "video_pembelajaran" ADD CONSTRAINT "video_pembelajaran_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "video_pembelajaran" ADD CONSTRAINT "video_pembelajaran_berkas_video_id_media_id_fk" FOREIGN KEY ("berkas_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "video_pembelajaran_locales" ADD CONSTRAINT "video_pembelajaran_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."video_pembelajaran"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_interaktif_tags" ADD CONSTRAINT "media_interaktif_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_interaktif"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_interaktif_tags_locales" ADD CONSTRAINT "media_interaktif_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_interaktif_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_interaktif" ADD CONSTRAINT "media_interaktif_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_interaktif_locales" ADD CONSTRAINT "media_interaktif_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_interaktif"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "produk_jenjang_order_idx" ON "produk_jenjang" USING btree ("order");
  CREATE INDEX "produk_jenjang_parent_idx" ON "produk_jenjang" USING btree ("parent_id");
  CREATE INDEX "produk_mapel_order_idx" ON "produk_mapel" USING btree ("order");
  CREATE INDEX "produk_mapel_parent_idx" ON "produk_mapel" USING btree ("parent_id");
  CREATE INDEX "produk_fitur_unggulan_order_idx" ON "produk_fitur_unggulan" USING btree ("_order");
  CREATE INDEX "produk_fitur_unggulan_parent_id_idx" ON "produk_fitur_unggulan" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "produk_fitur_unggulan_locales_locale_parent_id_unique" ON "produk_fitur_unggulan_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "produk_format_order_idx" ON "produk_format" USING btree ("order");
  CREATE INDEX "produk_format_parent_idx" ON "produk_format" USING btree ("parent_id");
  CREATE UNIQUE INDEX "produk_slug_idx" ON "produk" USING btree ("slug");
  CREATE INDEX "produk_cover_idx" ON "produk" USING btree ("cover_id");
  CREATE INDEX "produk_updated_at_idx" ON "produk" USING btree ("updated_at");
  CREATE INDEX "produk_created_at_idx" ON "produk" USING btree ("created_at");
  CREATE UNIQUE INDEX "produk_locales_locale_parent_id_unique" ON "produk_locales" USING btree ("_locale","_parent_id");
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
  CREATE INDEX "video_pembelajaran_jenjang_order_idx" ON "video_pembelajaran_jenjang" USING btree ("order");
  CREATE INDEX "video_pembelajaran_jenjang_parent_idx" ON "video_pembelajaran_jenjang" USING btree ("parent_id");
  CREATE INDEX "video_pembelajaran_mapel_order_idx" ON "video_pembelajaran_mapel" USING btree ("order");
  CREATE INDEX "video_pembelajaran_mapel_parent_idx" ON "video_pembelajaran_mapel" USING btree ("parent_id");
  CREATE INDEX "video_pembelajaran_thumbnail_idx" ON "video_pembelajaran" USING btree ("thumbnail_id");
  CREATE INDEX "video_pembelajaran_berkas_video_idx" ON "video_pembelajaran" USING btree ("berkas_video_id");
  CREATE INDEX "video_pembelajaran_updated_at_idx" ON "video_pembelajaran" USING btree ("updated_at");
  CREATE INDEX "video_pembelajaran_created_at_idx" ON "video_pembelajaran" USING btree ("created_at");
  CREATE UNIQUE INDEX "video_pembelajaran_locales_locale_parent_id_unique" ON "video_pembelajaran_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_interaktif_tags_order_idx" ON "media_interaktif_tags" USING btree ("_order");
  CREATE INDEX "media_interaktif_tags_parent_id_idx" ON "media_interaktif_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "media_interaktif_tags_locales_locale_parent_id_unique" ON "media_interaktif_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_interaktif_thumbnail_idx" ON "media_interaktif" USING btree ("thumbnail_id");
  CREATE INDEX "media_interaktif_updated_at_idx" ON "media_interaktif" USING btree ("updated_at");
  CREATE INDEX "media_interaktif_created_at_idx" ON "media_interaktif" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_interaktif_locales_locale_parent_id_unique" ON "media_interaktif_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "leads" ADD CONSTRAINT "leads_produk_ref_id_produk_id_fk" FOREIGN KEY ("produk_ref_id") REFERENCES "public"."produk"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_produk_fk" FOREIGN KEY ("produk_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_alat_peraga_fk" FOREIGN KEY ("alat_peraga_id") REFERENCES "public"."alat_peraga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_video_pembelajaran_fk" FOREIGN KEY ("video_pembelajaran_id") REFERENCES "public"."video_pembelajaran"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_interaktif_fk" FOREIGN KEY ("media_interaktif_id") REFERENCES "public"."media_interaktif"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "leads_produk_ref_idx" ON "leads" USING btree ("produk_ref_id");
  CREATE INDEX "payload_locked_documents_rels_produk_id_idx" ON "payload_locked_documents_rels" USING btree ("produk_id");
  CREATE INDEX "payload_locked_documents_rels_alat_peraga_id_idx" ON "payload_locked_documents_rels" USING btree ("alat_peraga_id");
  CREATE INDEX "payload_locked_documents_rels_video_pembelajaran_id_idx" ON "payload_locked_documents_rels" USING btree ("video_pembelajaran_id");
  CREATE INDEX "payload_locked_documents_rels_media_interaktif_id_idx" ON "payload_locked_documents_rels" USING btree ("media_interaktif_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "produk_jenjang" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produk_mapel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produk_fitur_unggulan" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produk_fitur_unggulan_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produk_format" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produk" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produk_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_jenjang" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_mapel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_galeri_foto" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_isi_paket" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_isi_paket_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alat_peraga_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "video_pembelajaran_jenjang" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "video_pembelajaran_mapel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "video_pembelajaran" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "video_pembelajaran_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_interaktif_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_interaktif_tags_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_interaktif" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_interaktif_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "produk_jenjang" CASCADE;
  DROP TABLE "produk_mapel" CASCADE;
  DROP TABLE "produk_fitur_unggulan" CASCADE;
  DROP TABLE "produk_fitur_unggulan_locales" CASCADE;
  DROP TABLE "produk_format" CASCADE;
  DROP TABLE "produk" CASCADE;
  DROP TABLE "produk_locales" CASCADE;
  DROP TABLE "alat_peraga_jenjang" CASCADE;
  DROP TABLE "alat_peraga_mapel" CASCADE;
  DROP TABLE "alat_peraga_galeri_foto" CASCADE;
  DROP TABLE "alat_peraga_isi_paket" CASCADE;
  DROP TABLE "alat_peraga_isi_paket_locales" CASCADE;
  DROP TABLE "alat_peraga" CASCADE;
  DROP TABLE "alat_peraga_locales" CASCADE;
  DROP TABLE "video_pembelajaran_jenjang" CASCADE;
  DROP TABLE "video_pembelajaran_mapel" CASCADE;
  DROP TABLE "video_pembelajaran" CASCADE;
  DROP TABLE "video_pembelajaran_locales" CASCADE;
  DROP TABLE "media_interaktif_tags" CASCADE;
  DROP TABLE "media_interaktif_tags_locales" CASCADE;
  DROP TABLE "media_interaktif" CASCADE;
  DROP TABLE "media_interaktif_locales" CASCADE;
  ALTER TABLE "leads" DROP CONSTRAINT "leads_produk_ref_id_produk_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_produk_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_alat_peraga_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_video_pembelajaran_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_interaktif_fk";
  
  DROP INDEX "leads_produk_ref_idx";
  DROP INDEX "payload_locked_documents_rels_produk_id_idx";
  DROP INDEX "payload_locked_documents_rels_alat_peraga_id_idx";
  DROP INDEX "payload_locked_documents_rels_video_pembelajaran_id_idx";
  DROP INDEX "payload_locked_documents_rels_media_interaktif_id_idx";
  ALTER TABLE "leads" DROP COLUMN "jenis";
  ALTER TABLE "leads" DROP COLUMN "asal_instansi";
  ALTER TABLE "leads" DROP COLUMN "produk_ref_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "produk_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "alat_peraga_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "video_pembelajaran_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_interaktif_id";
  DROP TYPE "public"."enum_produk_jenjang";
  DROP TYPE "public"."enum_produk_mapel";
  DROP TYPE "public"."enum_produk_format";
  DROP TYPE "public"."enum_produk_kategori_produk";
  DROP TYPE "public"."enum_produk_status";
  DROP TYPE "public"."enum_alat_peraga_jenjang";
  DROP TYPE "public"."enum_alat_peraga_mapel";
  DROP TYPE "public"."enum_video_pembelajaran_jenjang";
  DROP TYPE "public"."enum_video_pembelajaran_mapel";
  DROP TYPE "public"."enum_video_pembelajaran_sumber_tipe";
  DROP TYPE "public"."enum_leads_jenis";`)
}
