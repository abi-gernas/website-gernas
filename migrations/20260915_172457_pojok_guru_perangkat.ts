import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_katalog" AS ENUM('produk', 'alatPeraga', 'videoPembelajaran', 'mediaInteraktif');
  CREATE TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_warna" AS ENUM('putih', 'abu', 'navy', 'merah', 'kuning');
  CREATE TYPE "public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber" AS ENUM('produk', 'alatPeraga', 'videoPembelajaran', 'mediaInteraktif', 'semua', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog" AS ENUM('produk', 'alatPeraga', 'videoPembelajaran', 'mediaInteraktif');
  CREATE TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_warna" AS ENUM('putih', 'abu', 'navy', 'merah', 'kuning');
  CREATE TYPE "public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber" AS ENUM('produk', 'alatPeraga', 'videoPembelajaran', 'mediaInteraktif', 'semua', 'manual');
  CREATE TABLE "pages_blocks_perangkat_guru_kartu" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"katalog" "enum_pages_blocks_perangkat_guru_kartu_katalog" DEFAULT 'produk',
  	"warna" "enum_pages_blocks_perangkat_guru_kartu_warna" DEFAULT 'abu',
  	"gambar_id" integer
  );
  
  CREATE TABLE "pages_blocks_perangkat_guru_kartu_locales" (
  	"judul" varchar,
  	"deskripsi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_perangkat_guru_panel_statistik" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"sumber" "enum_pages_blocks_perangkat_guru_panel_statistik_sumber" DEFAULT 'produk',
  	"angka" numeric
  );
  
  CREATE TABLE "pages_blocks_perangkat_guru_panel_statistik_locales" (
  	"akhiran" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_perangkat_guru" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"panel_gambar_id" integer,
  	"panel_cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_perangkat_guru_locales" (
  	"judul" varchar,
  	"subjudul" varchar,
  	"panel_judul" varchar,
  	"panel_isi" varchar,
  	"panel_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_perangkat_guru_kartu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"katalog" "enum__pages_v_blocks_perangkat_guru_kartu_katalog" DEFAULT 'produk',
  	"warna" "enum__pages_v_blocks_perangkat_guru_kartu_warna" DEFAULT 'abu',
  	"gambar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_perangkat_guru_kartu_locales" (
  	"judul" varchar,
  	"deskripsi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"sumber" "enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber" DEFAULT 'produk',
  	"angka" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_perangkat_guru_panel_statistik_locales" (
  	"akhiran" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_perangkat_guru" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"panel_gambar_id" integer,
  	"panel_cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_perangkat_guru_locales" (
  	"judul" varchar,
  	"subjudul" varchar,
  	"panel_judul" varchar,
  	"panel_isi" varchar,
  	"panel_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_perangkat_guru_kartu" ADD CONSTRAINT "pages_blocks_perangkat_guru_kartu_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_perangkat_guru_kartu" ADD CONSTRAINT "pages_blocks_perangkat_guru_kartu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perangkat_guru"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perangkat_guru_kartu_locales" ADD CONSTRAINT "pages_blocks_perangkat_guru_kartu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perangkat_guru_kartu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perangkat_guru_panel_statistik" ADD CONSTRAINT "pages_blocks_perangkat_guru_panel_statistik_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perangkat_guru"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perangkat_guru_panel_statistik_locales" ADD CONSTRAINT "pages_blocks_perangkat_guru_panel_statistik_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perangkat_guru_panel_statistik"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perangkat_guru" ADD CONSTRAINT "pages_blocks_perangkat_guru_panel_gambar_id_media_id_fk" FOREIGN KEY ("panel_gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_perangkat_guru" ADD CONSTRAINT "pages_blocks_perangkat_guru_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perangkat_guru_locales" ADD CONSTRAINT "pages_blocks_perangkat_guru_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perangkat_guru"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu" ADD CONSTRAINT "_pages_v_blocks_perangkat_guru_kartu_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu" ADD CONSTRAINT "_pages_v_blocks_perangkat_guru_kartu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_perangkat_guru"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu_locales" ADD CONSTRAINT "_pages_v_blocks_perangkat_guru_kartu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_perangkat_guru_kartu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" ADD CONSTRAINT "_pages_v_blocks_perangkat_guru_panel_statistik_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_perangkat_guru"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_perangkat_guru_panel_statistik_locales" ADD CONSTRAINT "_pages_v_blocks_perangkat_guru_panel_statistik_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_perangkat_guru_panel_statistik"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_perangkat_guru" ADD CONSTRAINT "_pages_v_blocks_perangkat_guru_panel_gambar_id_media_id_fk" FOREIGN KEY ("panel_gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_perangkat_guru" ADD CONSTRAINT "_pages_v_blocks_perangkat_guru_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_perangkat_guru_locales" ADD CONSTRAINT "_pages_v_blocks_perangkat_guru_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_perangkat_guru"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_perangkat_guru_kartu_order_idx" ON "pages_blocks_perangkat_guru_kartu" USING btree ("_order");
  CREATE INDEX "pages_blocks_perangkat_guru_kartu_parent_id_idx" ON "pages_blocks_perangkat_guru_kartu" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_perangkat_guru_kartu_gambar_idx" ON "pages_blocks_perangkat_guru_kartu" USING btree ("gambar_id");
  CREATE UNIQUE INDEX "pages_blocks_perangkat_guru_kartu_locales_locale_parent_id_u" ON "pages_blocks_perangkat_guru_kartu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_perangkat_guru_panel_statistik_order_idx" ON "pages_blocks_perangkat_guru_panel_statistik" USING btree ("_order");
  CREATE INDEX "pages_blocks_perangkat_guru_panel_statistik_parent_id_idx" ON "pages_blocks_perangkat_guru_panel_statistik" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_perangkat_guru_panel_statistik_locales_locale_p" ON "pages_blocks_perangkat_guru_panel_statistik_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_perangkat_guru_order_idx" ON "pages_blocks_perangkat_guru" USING btree ("_order");
  CREATE INDEX "pages_blocks_perangkat_guru_parent_id_idx" ON "pages_blocks_perangkat_guru" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_perangkat_guru_path_idx" ON "pages_blocks_perangkat_guru" USING btree ("_path");
  CREATE INDEX "pages_blocks_perangkat_guru_panel_panel_gambar_idx" ON "pages_blocks_perangkat_guru" USING btree ("panel_gambar_id");
  CREATE UNIQUE INDEX "pages_blocks_perangkat_guru_locales_locale_parent_id_unique" ON "pages_blocks_perangkat_guru_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_perangkat_guru_kartu_order_idx" ON "_pages_v_blocks_perangkat_guru_kartu" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_perangkat_guru_kartu_parent_id_idx" ON "_pages_v_blocks_perangkat_guru_kartu" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_perangkat_guru_kartu_gambar_idx" ON "_pages_v_blocks_perangkat_guru_kartu" USING btree ("gambar_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_perangkat_guru_kartu_locales_locale_parent_i" ON "_pages_v_blocks_perangkat_guru_kartu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_perangkat_guru_panel_statistik_order_idx" ON "_pages_v_blocks_perangkat_guru_panel_statistik" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_perangkat_guru_panel_statistik_parent_id_idx" ON "_pages_v_blocks_perangkat_guru_panel_statistik" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_perangkat_guru_panel_statistik_locales_local" ON "_pages_v_blocks_perangkat_guru_panel_statistik_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_perangkat_guru_order_idx" ON "_pages_v_blocks_perangkat_guru" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_perangkat_guru_parent_id_idx" ON "_pages_v_blocks_perangkat_guru" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_perangkat_guru_path_idx" ON "_pages_v_blocks_perangkat_guru" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_perangkat_guru_panel_panel_gambar_idx" ON "_pages_v_blocks_perangkat_guru" USING btree ("panel_gambar_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_perangkat_guru_locales_locale_parent_id_uniq" ON "_pages_v_blocks_perangkat_guru_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_perangkat_guru_kartu" CASCADE;
  DROP TABLE "pages_blocks_perangkat_guru_kartu_locales" CASCADE;
  DROP TABLE "pages_blocks_perangkat_guru_panel_statistik" CASCADE;
  DROP TABLE "pages_blocks_perangkat_guru_panel_statistik_locales" CASCADE;
  DROP TABLE "pages_blocks_perangkat_guru" CASCADE;
  DROP TABLE "pages_blocks_perangkat_guru_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_perangkat_guru_kartu" CASCADE;
  DROP TABLE "_pages_v_blocks_perangkat_guru_kartu_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" CASCADE;
  DROP TABLE "_pages_v_blocks_perangkat_guru_panel_statistik_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_perangkat_guru" CASCADE;
  DROP TABLE "_pages_v_blocks_perangkat_guru_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_katalog";
  DROP TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_warna";
  DROP TYPE "public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber";
  DROP TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog";
  DROP TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_warna";
  DROP TYPE "public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber";`)
}
