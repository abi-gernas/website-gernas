import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_timeline_entries_locales" (
  	"teks" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stat_counter_stats_locales" (
  	"suffix" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_testimonials_items_locales" (
  	"kutipan" varchar,
  	"peran" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_indonesia_map_stats_locales" (
  	"suffix" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_idea_cards_items_locales" (
  	"judul" varchar,
  	"kelas" varchar,
  	"topik" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_entries_locales" (
  	"teks" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stat_counter_stats_locales" (
  	"suffix" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items_locales" (
  	"kutipan" varchar,
  	"peran" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_indonesia_map_stats_locales" (
  	"suffix" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_idea_cards_items_locales" (
  	"judul" varchar,
  	"kelas" varchar,
  	"topik" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "penggerak_peran_locales" (
  	"nama" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "video_locales" (
  	"judul" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "modul_pelatihan_tujuan_locales" (
  	"teks" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "modul_pelatihan_locales" (
  	"judul" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_locales" (
  	"address" varchar,
  	"footer_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_rich_text_locales" ADD COLUMN "content" jsonb;
  ALTER TABLE "pages_blocks_feature_cards_cards_locales" ADD COLUMN "isi" jsonb;
  ALTER TABLE "pages_blocks_callout_tautan_tambahan_locales" ADD COLUMN "awalan" varchar;
  ALTER TABLE "pages_blocks_training_modules_locales" ADD COLUMN "sidebar_teks" varchar;
  ALTER TABLE "pages_blocks_training_modules_locales" ADD COLUMN "sidebar_ajakan" varchar;
  ALTER TABLE "pages_blocks_donation_campaigns_items_locales" ADD COLUMN "judul" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text_locales" ADD COLUMN "content" jsonb;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards_locales" ADD COLUMN "isi" jsonb;
  ALTER TABLE "_pages_v_blocks_callout_tautan_tambahan_locales" ADD COLUMN "awalan" varchar;
  ALTER TABLE "_pages_v_blocks_training_modules_locales" ADD COLUMN "sidebar_teks" varchar;
  ALTER TABLE "_pages_v_blocks_training_modules_locales" ADD COLUMN "sidebar_ajakan" varchar;
  ALTER TABLE "_pages_v_blocks_donation_campaigns_items_locales" ADD COLUMN "judul" varchar;
  ALTER TABLE "pages_blocks_timeline_entries_locales" ADD CONSTRAINT "pages_blocks_timeline_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_counter_stats_locales" ADD CONSTRAINT "pages_blocks_stat_counter_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stat_counter_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items_locales" ADD CONSTRAINT "pages_blocks_testimonials_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_indonesia_map_stats_locales" ADD CONSTRAINT "pages_blocks_indonesia_map_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_indonesia_map_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_idea_cards_items_locales" ADD CONSTRAINT "pages_blocks_idea_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_idea_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_entries_locales" ADD CONSTRAINT "_pages_v_blocks_timeline_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stat_counter_stats_locales" ADD CONSTRAINT "_pages_v_blocks_stat_counter_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stat_counter_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items_locales" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_indonesia_map_stats_locales" ADD CONSTRAINT "_pages_v_blocks_indonesia_map_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_indonesia_map_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_idea_cards_items_locales" ADD CONSTRAINT "_pages_v_blocks_idea_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_idea_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "penggerak_peran_locales" ADD CONSTRAINT "penggerak_peran_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."penggerak_peran"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "video_locales" ADD CONSTRAINT "video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "modul_pelatihan_tujuan_locales" ADD CONSTRAINT "modul_pelatihan_tujuan_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."modul_pelatihan_tujuan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "modul_pelatihan_locales" ADD CONSTRAINT "modul_pelatihan_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."modul_pelatihan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_blocks_timeline_entries_locales_locale_parent_id_uniqu" ON "pages_blocks_timeline_entries_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stat_counter_stats_locales_locale_parent_id_uni" ON "pages_blocks_stat_counter_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_testimonials_items_locales_locale_parent_id_uni" ON "pages_blocks_testimonials_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_indonesia_map_stats_locales_locale_parent_id_un" ON "pages_blocks_indonesia_map_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_idea_cards_items_locales_locale_parent_id_uniqu" ON "pages_blocks_idea_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_timeline_entries_locales_locale_parent_id_un" ON "_pages_v_blocks_timeline_entries_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stat_counter_stats_locales_locale_parent_id_" ON "_pages_v_blocks_stat_counter_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_testimonials_items_locales_locale_parent_id_" ON "_pages_v_blocks_testimonials_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_indonesia_map_stats_locales_locale_parent_id" ON "_pages_v_blocks_indonesia_map_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_idea_cards_items_locales_locale_parent_id_un" ON "_pages_v_blocks_idea_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "penggerak_peran_locales_locale_parent_id_unique" ON "penggerak_peran_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "video_locales_locale_parent_id_unique" ON "video_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "modul_pelatihan_tujuan_locales_locale_parent_id_unique" ON "modul_pelatihan_tujuan_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "modul_pelatihan_locales_locale_parent_id_unique" ON "modul_pelatihan_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  `)

  /**
   * Pindahkan isi kolom lama ke tabel *_locales sebagai versi Indonesia,
   * SEBELUM kolomnya di-drop di blok berikutnya. Tanpa ini seluruh isi
   * halaman, testimoni, linimasa, statistik, alt gambar, modul, dan video
   * yang sudah diisi staf akan hilang.
   *
   * Dua pola berbeda, sesuai kondisi tabel tujuan:
   *  - Tabel *_locales yang BARU dibuat di migrasi ini → INSERT biasa.
   *  - Tabel *_locales yang SUDAH ada dari migrasi sebelumnya (rich_text,
   *    feature_cards_cards, callout_tautan_tambahan, training_modules,
   *    donation_campaigns_items) → INSERT ... ON CONFLICT DO UPDATE, karena
   *    baris locale 'id'-nya mungkin sudah ada. UPDATE biasa tidak dipakai:
   *    baris blok yang belum punya baris locale akan terlewat diam-diam.
   */
  await db.execute(sql`
  INSERT INTO "pages_blocks_timeline_entries_locales" ("_locale", "_parent_id", "teks")
    SELECT 'id', "id", "teks" FROM "pages_blocks_timeline_entries";
  INSERT INTO "pages_blocks_stat_counter_stats_locales" ("_locale", "_parent_id", "suffix", "label")
    SELECT 'id', "id", "suffix", "label" FROM "pages_blocks_stat_counter_stats";
  INSERT INTO "pages_blocks_testimonials_items_locales" ("_locale", "_parent_id", "kutipan", "peran")
    SELECT 'id', "id", "kutipan", "peran" FROM "pages_blocks_testimonials_items";
  INSERT INTO "pages_blocks_indonesia_map_stats_locales" ("_locale", "_parent_id", "suffix", "label")
    SELECT 'id', "id", "suffix", "label" FROM "pages_blocks_indonesia_map_stats";
  INSERT INTO "pages_blocks_idea_cards_items_locales" ("_locale", "_parent_id", "judul", "kelas", "topik")
    SELECT 'id', "id", "judul", "kelas", "topik" FROM "pages_blocks_idea_cards_items";
  INSERT INTO "_pages_v_blocks_timeline_entries_locales" ("_locale", "_parent_id", "teks")
    SELECT 'id', "id", "teks" FROM "_pages_v_blocks_timeline_entries";
  INSERT INTO "_pages_v_blocks_stat_counter_stats_locales" ("_locale", "_parent_id", "suffix", "label")
    SELECT 'id', "id", "suffix", "label" FROM "_pages_v_blocks_stat_counter_stats";
  INSERT INTO "_pages_v_blocks_testimonials_items_locales" ("_locale", "_parent_id", "kutipan", "peran")
    SELECT 'id', "id", "kutipan", "peran" FROM "_pages_v_blocks_testimonials_items";
  INSERT INTO "_pages_v_blocks_indonesia_map_stats_locales" ("_locale", "_parent_id", "suffix", "label")
    SELECT 'id', "id", "suffix", "label" FROM "_pages_v_blocks_indonesia_map_stats";
  INSERT INTO "_pages_v_blocks_idea_cards_items_locales" ("_locale", "_parent_id", "judul", "kelas", "topik")
    SELECT 'id', "id", "judul", "kelas", "topik" FROM "_pages_v_blocks_idea_cards_items";
  INSERT INTO "categories_locales" ("_locale", "_parent_id", "title")
    SELECT 'id', "id", "title" FROM "categories";
  INSERT INTO "media_locales" ("_locale", "_parent_id", "alt", "caption")
    SELECT 'id', "id", "alt", "caption" FROM "media";
  INSERT INTO "penggerak_peran_locales" ("_locale", "_parent_id", "nama")
    SELECT 'id', "id", "nama" FROM "penggerak_peran";
  INSERT INTO "video_locales" ("_locale", "_parent_id", "judul")
    SELECT 'id', "id", "judul" FROM "video";
  INSERT INTO "modul_pelatihan_tujuan_locales" ("_locale", "_parent_id", "teks")
    SELECT 'id', "id", "teks" FROM "modul_pelatihan_tujuan";
  INSERT INTO "modul_pelatihan_locales" ("_locale", "_parent_id", "judul")
    SELECT 'id', "id", "judul" FROM "modul_pelatihan";
  INSERT INTO "site_settings_locales" ("_locale", "_parent_id", "address", "footer_text")
    SELECT 'id', "id", "address", "footer_text" FROM "site_settings";

  INSERT INTO "pages_blocks_rich_text_locales" ("_locale", "_parent_id", "content")
    SELECT 'id', "id", "content" FROM "pages_blocks_rich_text"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "content" = excluded."content";
  INSERT INTO "pages_blocks_feature_cards_cards_locales" ("_locale", "_parent_id", "isi")
    SELECT 'id', "id", "isi" FROM "pages_blocks_feature_cards_cards"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "isi" = excluded."isi";
  INSERT INTO "pages_blocks_callout_tautan_tambahan_locales" ("_locale", "_parent_id", "awalan")
    SELECT 'id', "id", "awalan" FROM "pages_blocks_callout_tautan_tambahan"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "awalan" = excluded."awalan";
  INSERT INTO "pages_blocks_training_modules_locales" ("_locale", "_parent_id", "sidebar_teks", "sidebar_ajakan")
    SELECT 'id', "id", "sidebar_teks", "sidebar_ajakan" FROM "pages_blocks_training_modules"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "sidebar_teks" = excluded."sidebar_teks", "sidebar_ajakan" = excluded."sidebar_ajakan";
  INSERT INTO "pages_blocks_donation_campaigns_items_locales" ("_locale", "_parent_id", "judul")
    SELECT 'id', "id", "judul" FROM "pages_blocks_donation_campaigns_items"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "judul" = excluded."judul";
  INSERT INTO "_pages_v_blocks_rich_text_locales" ("_locale", "_parent_id", "content")
    SELECT 'id', "id", "content" FROM "_pages_v_blocks_rich_text"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "content" = excluded."content";
  INSERT INTO "_pages_v_blocks_feature_cards_cards_locales" ("_locale", "_parent_id", "isi")
    SELECT 'id', "id", "isi" FROM "_pages_v_blocks_feature_cards_cards"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "isi" = excluded."isi";
  INSERT INTO "_pages_v_blocks_callout_tautan_tambahan_locales" ("_locale", "_parent_id", "awalan")
    SELECT 'id', "id", "awalan" FROM "_pages_v_blocks_callout_tautan_tambahan"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "awalan" = excluded."awalan";
  INSERT INTO "_pages_v_blocks_training_modules_locales" ("_locale", "_parent_id", "sidebar_teks", "sidebar_ajakan")
    SELECT 'id', "id", "sidebar_teks", "sidebar_ajakan" FROM "_pages_v_blocks_training_modules"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "sidebar_teks" = excluded."sidebar_teks", "sidebar_ajakan" = excluded."sidebar_ajakan";
  INSERT INTO "_pages_v_blocks_donation_campaigns_items_locales" ("_locale", "_parent_id", "judul")
    SELECT 'id', "id", "judul" FROM "_pages_v_blocks_donation_campaigns_items"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "judul" = excluded."judul";`)

  await db.execute(sql`
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "pages_blocks_feature_cards_cards" DROP COLUMN "isi";
  ALTER TABLE "pages_blocks_callout_tautan_tambahan" DROP COLUMN "awalan";
  ALTER TABLE "pages_blocks_timeline_entries" DROP COLUMN "teks";
  ALTER TABLE "pages_blocks_stat_counter_stats" DROP COLUMN "suffix";
  ALTER TABLE "pages_blocks_stat_counter_stats" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_training_modules" DROP COLUMN "sidebar_teks";
  ALTER TABLE "pages_blocks_training_modules" DROP COLUMN "sidebar_ajakan";
  ALTER TABLE "pages_blocks_testimonials_items" DROP COLUMN "kutipan";
  ALTER TABLE "pages_blocks_testimonials_items" DROP COLUMN "peran";
  ALTER TABLE "pages_blocks_indonesia_map_stats" DROP COLUMN "suffix";
  ALTER TABLE "pages_blocks_indonesia_map_stats" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_idea_cards_items" DROP COLUMN "judul";
  ALTER TABLE "pages_blocks_idea_cards_items" DROP COLUMN "kelas";
  ALTER TABLE "pages_blocks_idea_cards_items" DROP COLUMN "topik";
  ALTER TABLE "pages_blocks_donation_campaigns_items" DROP COLUMN "judul";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" DROP COLUMN "isi";
  ALTER TABLE "_pages_v_blocks_callout_tautan_tambahan" DROP COLUMN "awalan";
  ALTER TABLE "_pages_v_blocks_timeline_entries" DROP COLUMN "teks";
  ALTER TABLE "_pages_v_blocks_stat_counter_stats" DROP COLUMN "suffix";
  ALTER TABLE "_pages_v_blocks_stat_counter_stats" DROP COLUMN "label";
  ALTER TABLE "_pages_v_blocks_training_modules" DROP COLUMN "sidebar_teks";
  ALTER TABLE "_pages_v_blocks_training_modules" DROP COLUMN "sidebar_ajakan";
  ALTER TABLE "_pages_v_blocks_testimonials_items" DROP COLUMN "kutipan";
  ALTER TABLE "_pages_v_blocks_testimonials_items" DROP COLUMN "peran";
  ALTER TABLE "_pages_v_blocks_indonesia_map_stats" DROP COLUMN "suffix";
  ALTER TABLE "_pages_v_blocks_indonesia_map_stats" DROP COLUMN "label";
  ALTER TABLE "_pages_v_blocks_idea_cards_items" DROP COLUMN "judul";
  ALTER TABLE "_pages_v_blocks_idea_cards_items" DROP COLUMN "kelas";
  ALTER TABLE "_pages_v_blocks_idea_cards_items" DROP COLUMN "topik";
  ALTER TABLE "_pages_v_blocks_donation_campaigns_items" DROP COLUMN "judul";
  ALTER TABLE "categories" DROP COLUMN "title";
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "penggerak_peran" DROP COLUMN "nama";
  ALTER TABLE "video" DROP COLUMN "judul";
  ALTER TABLE "modul_pelatihan_tujuan" DROP COLUMN "teks";
  ALTER TABLE "modul_pelatihan" DROP COLUMN "judul";
  ALTER TABLE "site_settings" DROP COLUMN "address";
  ALTER TABLE "site_settings" DROP COLUMN "footer_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  /**
   * Urutan dibalik dari keluaran generator: kolom dibuat dulu, isinya
   * dikembalikan dari *_locales, baru tabel *_locales dibuang. Keluaran mentah
   * membuang tabelnya lebih dulu — rollback akan ikut menghapus teks Indonesia.
   *
   * Kolom yang aslinya NOT NULL dibuat nullable dulu (Postgres menolak ADD
   * COLUMN NOT NULL pada tabel berisi data), lalu di-SET NOT NULL setelah
   * datanya dikembalikan.
   */
  await db.execute(sql`
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "content" jsonb;
  ALTER TABLE "pages_blocks_feature_cards_cards" ADD COLUMN "isi" jsonb;
  ALTER TABLE "pages_blocks_callout_tautan_tambahan" ADD COLUMN "awalan" varchar;
  ALTER TABLE "pages_blocks_timeline_entries" ADD COLUMN "teks" varchar;
  ALTER TABLE "pages_blocks_stat_counter_stats" ADD COLUMN "suffix" varchar;
  ALTER TABLE "pages_blocks_stat_counter_stats" ADD COLUMN "label" varchar;
  ALTER TABLE "pages_blocks_training_modules" ADD COLUMN "sidebar_teks" varchar;
  ALTER TABLE "pages_blocks_training_modules" ADD COLUMN "sidebar_ajakan" varchar;
  ALTER TABLE "pages_blocks_testimonials_items" ADD COLUMN "kutipan" varchar;
  ALTER TABLE "pages_blocks_testimonials_items" ADD COLUMN "peran" varchar;
  ALTER TABLE "pages_blocks_indonesia_map_stats" ADD COLUMN "suffix" varchar;
  ALTER TABLE "pages_blocks_indonesia_map_stats" ADD COLUMN "label" varchar;
  ALTER TABLE "pages_blocks_idea_cards_items" ADD COLUMN "judul" varchar;
  ALTER TABLE "pages_blocks_idea_cards_items" ADD COLUMN "kelas" varchar;
  ALTER TABLE "pages_blocks_idea_cards_items" ADD COLUMN "topik" varchar;
  ALTER TABLE "pages_blocks_donation_campaigns_items" ADD COLUMN "judul" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "content" jsonb;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" ADD COLUMN "isi" jsonb;
  ALTER TABLE "_pages_v_blocks_callout_tautan_tambahan" ADD COLUMN "awalan" varchar;
  ALTER TABLE "_pages_v_blocks_timeline_entries" ADD COLUMN "teks" varchar;
  ALTER TABLE "_pages_v_blocks_stat_counter_stats" ADD COLUMN "suffix" varchar;
  ALTER TABLE "_pages_v_blocks_stat_counter_stats" ADD COLUMN "label" varchar;
  ALTER TABLE "_pages_v_blocks_training_modules" ADD COLUMN "sidebar_teks" varchar;
  ALTER TABLE "_pages_v_blocks_training_modules" ADD COLUMN "sidebar_ajakan" varchar;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD COLUMN "kutipan" varchar;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD COLUMN "peran" varchar;
  ALTER TABLE "_pages_v_blocks_indonesia_map_stats" ADD COLUMN "suffix" varchar;
  ALTER TABLE "_pages_v_blocks_indonesia_map_stats" ADD COLUMN "label" varchar;
  ALTER TABLE "_pages_v_blocks_idea_cards_items" ADD COLUMN "judul" varchar;
  ALTER TABLE "_pages_v_blocks_idea_cards_items" ADD COLUMN "kelas" varchar;
  ALTER TABLE "_pages_v_blocks_idea_cards_items" ADD COLUMN "topik" varchar;
  ALTER TABLE "_pages_v_blocks_donation_campaigns_items" ADD COLUMN "judul" varchar;
  ALTER TABLE "categories" ADD COLUMN "title" varchar;
  ALTER TABLE "media" ADD COLUMN "alt" varchar;
  ALTER TABLE "media" ADD COLUMN "caption" varchar;
  ALTER TABLE "penggerak_peran" ADD COLUMN "nama" varchar;
  ALTER TABLE "video" ADD COLUMN "judul" varchar;
  ALTER TABLE "modul_pelatihan_tujuan" ADD COLUMN "teks" varchar;
  ALTER TABLE "modul_pelatihan" ADD COLUMN "judul" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "address" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "footer_text" varchar;`)

  /** Kembalikan isi versi 'id' ke kolom utama sebelum tabel *_locales dibuang. */
  await db.execute(sql`
  UPDATE "pages_blocks_timeline_entries" AS m SET "teks" = l."teks"
    FROM "pages_blocks_timeline_entries_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_stat_counter_stats" AS m SET "suffix" = l."suffix", "label" = l."label"
    FROM "pages_blocks_stat_counter_stats_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_testimonials_items" AS m SET "kutipan" = l."kutipan", "peran" = l."peran"
    FROM "pages_blocks_testimonials_items_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_indonesia_map_stats" AS m SET "suffix" = l."suffix", "label" = l."label"
    FROM "pages_blocks_indonesia_map_stats_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_idea_cards_items" AS m SET "judul" = l."judul", "kelas" = l."kelas", "topik" = l."topik"
    FROM "pages_blocks_idea_cards_items_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_timeline_entries" AS m SET "teks" = l."teks"
    FROM "_pages_v_blocks_timeline_entries_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_stat_counter_stats" AS m SET "suffix" = l."suffix", "label" = l."label"
    FROM "_pages_v_blocks_stat_counter_stats_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_testimonials_items" AS m SET "kutipan" = l."kutipan", "peran" = l."peran"
    FROM "_pages_v_blocks_testimonials_items_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_indonesia_map_stats" AS m SET "suffix" = l."suffix", "label" = l."label"
    FROM "_pages_v_blocks_indonesia_map_stats_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_idea_cards_items" AS m SET "judul" = l."judul", "kelas" = l."kelas", "topik" = l."topik"
    FROM "_pages_v_blocks_idea_cards_items_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "categories" AS m SET "title" = l."title"
    FROM "categories_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "media" AS m SET "alt" = l."alt", "caption" = l."caption"
    FROM "media_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "penggerak_peran" AS m SET "nama" = l."nama"
    FROM "penggerak_peran_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "video" AS m SET "judul" = l."judul"
    FROM "video_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "modul_pelatihan_tujuan" AS m SET "teks" = l."teks"
    FROM "modul_pelatihan_tujuan_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "modul_pelatihan" AS m SET "judul" = l."judul"
    FROM "modul_pelatihan_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "site_settings" AS m SET "address" = l."address", "footer_text" = l."footer_text"
    FROM "site_settings_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';

  UPDATE "pages_blocks_rich_text" AS m SET "content" = l."content"
    FROM "pages_blocks_rich_text_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_feature_cards_cards" AS m SET "isi" = l."isi"
    FROM "pages_blocks_feature_cards_cards_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_callout_tautan_tambahan" AS m SET "awalan" = l."awalan"
    FROM "pages_blocks_callout_tautan_tambahan_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_training_modules" AS m SET "sidebar_teks" = l."sidebar_teks", "sidebar_ajakan" = l."sidebar_ajakan"
    FROM "pages_blocks_training_modules_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_donation_campaigns_items" AS m SET "judul" = l."judul"
    FROM "pages_blocks_donation_campaigns_items_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_rich_text" AS m SET "content" = l."content"
    FROM "_pages_v_blocks_rich_text_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_feature_cards_cards" AS m SET "isi" = l."isi"
    FROM "_pages_v_blocks_feature_cards_cards_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_callout_tautan_tambahan" AS m SET "awalan" = l."awalan"
    FROM "_pages_v_blocks_callout_tautan_tambahan_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_training_modules" AS m SET "sidebar_teks" = l."sidebar_teks", "sidebar_ajakan" = l."sidebar_ajakan"
    FROM "_pages_v_blocks_training_modules_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_donation_campaigns_items" AS m SET "judul" = l."judul"
    FROM "_pages_v_blocks_donation_campaigns_items_locales" AS l WHERE l."_parent_id" = m."id" AND l."_locale" = 'id';

  ALTER TABLE "categories" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "penggerak_peran" ALTER COLUMN "nama" SET NOT NULL;
  ALTER TABLE "video" ALTER COLUMN "judul" SET NOT NULL;
  ALTER TABLE "modul_pelatihan_tujuan" ALTER COLUMN "teks" SET NOT NULL;
  ALTER TABLE "modul_pelatihan" ALTER COLUMN "judul" SET NOT NULL;`)

  await db.execute(sql`
  DROP TABLE "pages_blocks_timeline_entries_locales" CASCADE;
  DROP TABLE "pages_blocks_stat_counter_stats_locales" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items_locales" CASCADE;
  DROP TABLE "pages_blocks_indonesia_map_stats_locales" CASCADE;
  DROP TABLE "pages_blocks_idea_cards_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_entries_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stat_counter_stats_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_indonesia_map_stats_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_idea_cards_items_locales" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "penggerak_peran_locales" CASCADE;
  DROP TABLE "video_locales" CASCADE;
  DROP TABLE "modul_pelatihan_tujuan_locales" CASCADE;
  DROP TABLE "modul_pelatihan_locales" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  ALTER TABLE "pages_blocks_rich_text_locales" DROP COLUMN "content";
  ALTER TABLE "pages_blocks_feature_cards_cards_locales" DROP COLUMN "isi";
  ALTER TABLE "pages_blocks_callout_tautan_tambahan_locales" DROP COLUMN "awalan";
  ALTER TABLE "pages_blocks_training_modules_locales" DROP COLUMN "sidebar_teks";
  ALTER TABLE "pages_blocks_training_modules_locales" DROP COLUMN "sidebar_ajakan";
  ALTER TABLE "pages_blocks_donation_campaigns_items_locales" DROP COLUMN "judul";
  ALTER TABLE "_pages_v_blocks_rich_text_locales" DROP COLUMN "content";
  ALTER TABLE "_pages_v_blocks_feature_cards_cards_locales" DROP COLUMN "isi";
  ALTER TABLE "_pages_v_blocks_callout_tautan_tambahan_locales" DROP COLUMN "awalan";
  ALTER TABLE "_pages_v_blocks_training_modules_locales" DROP COLUMN "sidebar_teks";
  ALTER TABLE "_pages_v_blocks_training_modules_locales" DROP COLUMN "sidebar_ajakan";
  ALTER TABLE "_pages_v_blocks_donation_campaigns_items_locales" DROP COLUMN "judul";`)
}
