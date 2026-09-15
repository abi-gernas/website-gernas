import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_komunitas_kartu_warna" AS ENUM('navy', 'merah');
  CREATE TYPE "public"."enum_pages_blocks_komunitas_kartu_ikon" AS ENUM('diskusi', 'komunitas', 'rumah', 'riset', 'ide', 'buku', 'penghargaan', 'daun', 'kalender', 'lokasi', 'sekolah', 'kolaborasi');
  CREATE TYPE "public"."enum_pages_blocks_tentang_ringkas_fakta_ikon" AS ENUM('diskusi', 'komunitas', 'rumah', 'riset', 'ide', 'buku', 'penghargaan', 'daun', 'kalender', 'lokasi', 'sekolah', 'kolaborasi');
  CREATE TYPE "public"."enum__pages_v_blocks_komunitas_kartu_warna" AS ENUM('navy', 'merah');
  CREATE TYPE "public"."enum__pages_v_blocks_komunitas_kartu_ikon" AS ENUM('diskusi', 'komunitas', 'rumah', 'riset', 'ide', 'buku', 'penghargaan', 'daun', 'kalender', 'lokasi', 'sekolah', 'kolaborasi');
  CREATE TYPE "public"."enum__pages_v_blocks_tentang_ringkas_fakta_ikon" AS ENUM('diskusi', 'komunitas', 'rumah', 'riset', 'ide', 'buku', 'penghargaan', 'daun', 'kalender', 'lokasi', 'sekolah', 'kolaborasi');
  CREATE TABLE "pages_blocks_komunitas_kartu" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"warna" "enum_pages_blocks_komunitas_kartu_warna" DEFAULT 'navy',
  	"ikon" "enum_pages_blocks_komunitas_kartu_ikon" DEFAULT 'komunitas',
  	"ilustrasi_id" integer,
  	"cta_href" varchar
  );
  
  CREATE TABLE "pages_blocks_komunitas_kartu_locales" (
  	"nama" varchar,
  	"deskripsi" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_komunitas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_komunitas_locales" (
  	"judul" varchar,
  	"subjudul" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_tentang_ringkas_fakta" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ikon" "enum_pages_blocks_tentang_ringkas_fakta_ikon" DEFAULT 'kalender'
  );
  
  CREATE TABLE "pages_blocks_tentang_ringkas_fakta_locales" (
  	"teks" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_tentang_ringkas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tentang_ringkas_locales" (
  	"judul" varchar,
  	"isi" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_komunitas_kartu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"warna" "enum__pages_v_blocks_komunitas_kartu_warna" DEFAULT 'navy',
  	"ikon" "enum__pages_v_blocks_komunitas_kartu_ikon" DEFAULT 'komunitas',
  	"ilustrasi_id" integer,
  	"cta_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_komunitas_kartu_locales" (
  	"nama" varchar,
  	"deskripsi" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_komunitas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_komunitas_locales" (
  	"judul" varchar,
  	"subjudul" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_tentang_ringkas_fakta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ikon" "enum__pages_v_blocks_tentang_ringkas_fakta_ikon" DEFAULT 'kalender',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tentang_ringkas_fakta_locales" (
  	"teks" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_tentang_ringkas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tentang_ringkas_locales" (
  	"judul" varchar,
  	"isi" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_komunitas_kartu" ADD CONSTRAINT "pages_blocks_komunitas_kartu_ilustrasi_id_media_id_fk" FOREIGN KEY ("ilustrasi_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_komunitas_kartu" ADD CONSTRAINT "pages_blocks_komunitas_kartu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_komunitas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_komunitas_kartu_locales" ADD CONSTRAINT "pages_blocks_komunitas_kartu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_komunitas_kartu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_komunitas" ADD CONSTRAINT "pages_blocks_komunitas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_komunitas_locales" ADD CONSTRAINT "pages_blocks_komunitas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_komunitas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tentang_ringkas_fakta" ADD CONSTRAINT "pages_blocks_tentang_ringkas_fakta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tentang_ringkas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tentang_ringkas_fakta_locales" ADD CONSTRAINT "pages_blocks_tentang_ringkas_fakta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tentang_ringkas_fakta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tentang_ringkas" ADD CONSTRAINT "pages_blocks_tentang_ringkas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tentang_ringkas_locales" ADD CONSTRAINT "pages_blocks_tentang_ringkas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tentang_ringkas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_komunitas_kartu" ADD CONSTRAINT "_pages_v_blocks_komunitas_kartu_ilustrasi_id_media_id_fk" FOREIGN KEY ("ilustrasi_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_komunitas_kartu" ADD CONSTRAINT "_pages_v_blocks_komunitas_kartu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_komunitas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_komunitas_kartu_locales" ADD CONSTRAINT "_pages_v_blocks_komunitas_kartu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_komunitas_kartu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_komunitas" ADD CONSTRAINT "_pages_v_blocks_komunitas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_komunitas_locales" ADD CONSTRAINT "_pages_v_blocks_komunitas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_komunitas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tentang_ringkas_fakta" ADD CONSTRAINT "_pages_v_blocks_tentang_ringkas_fakta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tentang_ringkas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tentang_ringkas_fakta_locales" ADD CONSTRAINT "_pages_v_blocks_tentang_ringkas_fakta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tentang_ringkas_fakta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tentang_ringkas" ADD CONSTRAINT "_pages_v_blocks_tentang_ringkas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tentang_ringkas_locales" ADD CONSTRAINT "_pages_v_blocks_tentang_ringkas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tentang_ringkas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_komunitas_kartu_order_idx" ON "pages_blocks_komunitas_kartu" USING btree ("_order");
  CREATE INDEX "pages_blocks_komunitas_kartu_parent_id_idx" ON "pages_blocks_komunitas_kartu" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_komunitas_kartu_ilustrasi_idx" ON "pages_blocks_komunitas_kartu" USING btree ("ilustrasi_id");
  CREATE UNIQUE INDEX "pages_blocks_komunitas_kartu_locales_locale_parent_id_unique" ON "pages_blocks_komunitas_kartu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_komunitas_order_idx" ON "pages_blocks_komunitas" USING btree ("_order");
  CREATE INDEX "pages_blocks_komunitas_parent_id_idx" ON "pages_blocks_komunitas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_komunitas_path_idx" ON "pages_blocks_komunitas" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_komunitas_locales_locale_parent_id_unique" ON "pages_blocks_komunitas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_tentang_ringkas_fakta_order_idx" ON "pages_blocks_tentang_ringkas_fakta" USING btree ("_order");
  CREATE INDEX "pages_blocks_tentang_ringkas_fakta_parent_id_idx" ON "pages_blocks_tentang_ringkas_fakta" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_tentang_ringkas_fakta_locales_locale_parent_id_" ON "pages_blocks_tentang_ringkas_fakta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_tentang_ringkas_order_idx" ON "pages_blocks_tentang_ringkas" USING btree ("_order");
  CREATE INDEX "pages_blocks_tentang_ringkas_parent_id_idx" ON "pages_blocks_tentang_ringkas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tentang_ringkas_path_idx" ON "pages_blocks_tentang_ringkas" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_tentang_ringkas_locales_locale_parent_id_unique" ON "pages_blocks_tentang_ringkas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_komunitas_kartu_order_idx" ON "_pages_v_blocks_komunitas_kartu" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_komunitas_kartu_parent_id_idx" ON "_pages_v_blocks_komunitas_kartu" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_komunitas_kartu_ilustrasi_idx" ON "_pages_v_blocks_komunitas_kartu" USING btree ("ilustrasi_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_komunitas_kartu_locales_locale_parent_id_uni" ON "_pages_v_blocks_komunitas_kartu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_komunitas_order_idx" ON "_pages_v_blocks_komunitas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_komunitas_parent_id_idx" ON "_pages_v_blocks_komunitas" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_komunitas_path_idx" ON "_pages_v_blocks_komunitas" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_komunitas_locales_locale_parent_id_unique" ON "_pages_v_blocks_komunitas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_tentang_ringkas_fakta_order_idx" ON "_pages_v_blocks_tentang_ringkas_fakta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tentang_ringkas_fakta_parent_id_idx" ON "_pages_v_blocks_tentang_ringkas_fakta" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_tentang_ringkas_fakta_locales_locale_parent_" ON "_pages_v_blocks_tentang_ringkas_fakta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_tentang_ringkas_order_idx" ON "_pages_v_blocks_tentang_ringkas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tentang_ringkas_parent_id_idx" ON "_pages_v_blocks_tentang_ringkas" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tentang_ringkas_path_idx" ON "_pages_v_blocks_tentang_ringkas" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_tentang_ringkas_locales_locale_parent_id_uni" ON "_pages_v_blocks_tentang_ringkas_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_komunitas_kartu" CASCADE;
  DROP TABLE "pages_blocks_komunitas_kartu_locales" CASCADE;
  DROP TABLE "pages_blocks_komunitas" CASCADE;
  DROP TABLE "pages_blocks_komunitas_locales" CASCADE;
  DROP TABLE "pages_blocks_tentang_ringkas_fakta" CASCADE;
  DROP TABLE "pages_blocks_tentang_ringkas_fakta_locales" CASCADE;
  DROP TABLE "pages_blocks_tentang_ringkas" CASCADE;
  DROP TABLE "pages_blocks_tentang_ringkas_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_komunitas_kartu" CASCADE;
  DROP TABLE "_pages_v_blocks_komunitas_kartu_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_komunitas" CASCADE;
  DROP TABLE "_pages_v_blocks_komunitas_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_tentang_ringkas_fakta" CASCADE;
  DROP TABLE "_pages_v_blocks_tentang_ringkas_fakta_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_tentang_ringkas" CASCADE;
  DROP TABLE "_pages_v_blocks_tentang_ringkas_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_komunitas_kartu_warna";
  DROP TYPE "public"."enum_pages_blocks_komunitas_kartu_ikon";
  DROP TYPE "public"."enum_pages_blocks_tentang_ringkas_fakta_ikon";
  DROP TYPE "public"."enum__pages_v_blocks_komunitas_kartu_warna";
  DROP TYPE "public"."enum__pages_v_blocks_komunitas_kartu_ikon";
  DROP TYPE "public"."enum__pages_v_blocks_tentang_ringkas_fakta_ikon";`)
}
