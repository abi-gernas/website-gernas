import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_rich_text_lebar" AS ENUM('sedang', 'penuh');
  CREATE TYPE "public"."enum_pages_blocks_feature_cards_cards_warna" AS ENUM('putih', 'abu', 'navy', 'merah', 'kuning');
  CREATE TYPE "public"."enum_pages_blocks_feature_cards_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_callout_warna" AS ENUM('putih', 'abu', 'navy', 'merah', 'kuning');
  CREATE TYPE "public"."enum_pages_blocks_latest_news_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_partner_logos_tampilan" AS ENUM('berkelompok', 'barisan');
  CREATE TYPE "public"."enum_pages_blocks_video_grid_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_training_modules_program" AS ENUM('matematika', 'membaca');
  CREATE TYPE "public"."enum_pages_blocks_training_modules_tampilan" AS ENUM('topik', 'rincian');
  CREATE TYPE "public"."enum_pages_blocks_gallery_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_idea_cards_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_donation_campaigns_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_lebar" AS ENUM('sedang', 'penuh');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_cards_cards_warna" AS ENUM('putih', 'abu', 'navy', 'merah', 'kuning');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_cards_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_callout_warna" AS ENUM('putih', 'abu', 'navy', 'merah', 'kuning');
  CREATE TYPE "public"."enum__pages_v_blocks_latest_news_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_logos_tampilan" AS ENUM('berkelompok', 'barisan');
  CREATE TYPE "public"."enum__pages_v_blocks_video_grid_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_training_modules_program" AS ENUM('matematika', 'membaca');
  CREATE TYPE "public"."enum__pages_v_blocks_training_modules_tampilan" AS ENUM('topik', 'rincian');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_idea_cards_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_donation_campaigns_kolom" AS ENUM('2', '3', '4');
  CREATE TABLE "pages_blocks_feature_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"judul" varchar,
  	"subjudul" varchar,
  	"isi" jsonb,
  	"gambar_id" integer,
  	"warna" "enum_pages_blocks_feature_cards_cards_warna" DEFAULT 'putih',
  	"cta_label" varchar,
  	"cta_href" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kolom" "enum_pages_blocks_feature_cards_kolom" DEFAULT '2',
  	"gambar_samping_gambar_id" integer,
  	"gambar_samping_judul" varchar,
  	"gambar_samping_judul_sorot" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_callout_tautan_tambahan" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"awalan" varchar,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"judul" varchar,
  	"isi" varchar,
  	"warna" "enum_pages_blocks_callout_warna" DEFAULT 'navy',
  	"rata_tengah" boolean DEFAULT false,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tahun" varchar,
  	"teks" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partner_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"tampilan" "enum_pages_blocks_partner_logos_tampilan" DEFAULT 'berkelompok',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"limit" numeric,
  	"kolom" "enum_pages_blocks_video_grid_kolom" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_training_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"program" "enum_pages_blocks_training_modules_program" DEFAULT 'matematika',
  	"tampilan" "enum_pages_blocks_training_modules_tampilan" DEFAULT 'topik',
  	"sidebar_teks" varchar,
  	"sidebar_ajakan" varchar,
  	"sidebar_cta_label" varchar,
  	"sidebar_cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kolom" "enum_pages_blocks_gallery_kolom" DEFAULT '4',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kutipan" varchar,
  	"nama" varchar,
  	"peran" varchar,
  	"foto_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_indonesia_map_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_indonesia_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"tampilkan_peta" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_idea_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"judul" varchar,
  	"kelas" varchar,
  	"topik" varchar,
  	"gambar_id" integer,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_idea_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kolom" "enum_pages_blocks_idea_cards_kolom" DEFAULT '4',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_donation_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"judul" varchar,
  	"judul_sorot" varchar,
  	"isi" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_donation_campaigns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"judul" varchar,
  	"gambar_id" integer,
  	"terkumpul" numeric,
  	"target" numeric,
  	"cta_label" varchar,
  	"cta_href" varchar
  );
  
  CREATE TABLE "pages_blocks_donation_campaigns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kolom" "enum_pages_blocks_donation_campaigns_kolom" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_feature_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"judul" varchar,
  	"subjudul" varchar,
  	"isi" jsonb,
  	"gambar_id" integer,
  	"warna" "enum__pages_v_blocks_feature_cards_cards_warna" DEFAULT 'putih',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kolom" "enum__pages_v_blocks_feature_cards_kolom" DEFAULT '2',
  	"gambar_samping_gambar_id" integer,
  	"gambar_samping_judul" varchar,
  	"gambar_samping_judul_sorot" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_callout_tautan_tambahan" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"awalan" varchar,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"judul" varchar,
  	"isi" varchar,
  	"warna" "enum__pages_v_blocks_callout_warna" DEFAULT 'navy',
  	"rata_tengah" boolean DEFAULT false,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tahun" varchar,
  	"teks" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partner_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"tampilan" "enum__pages_v_blocks_partner_logos_tampilan" DEFAULT 'berkelompok',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"limit" numeric,
  	"kolom" "enum__pages_v_blocks_video_grid_kolom" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_training_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"program" "enum__pages_v_blocks_training_modules_program" DEFAULT 'matematika',
  	"tampilan" "enum__pages_v_blocks_training_modules_tampilan" DEFAULT 'topik',
  	"sidebar_teks" varchar,
  	"sidebar_ajakan" varchar,
  	"sidebar_cta_label" varchar,
  	"sidebar_cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kolom" "enum__pages_v_blocks_gallery_kolom" DEFAULT '4',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kutipan" varchar,
  	"nama" varchar,
  	"peran" varchar,
  	"foto_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_indonesia_map_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_indonesia_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"tampilkan_peta" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_idea_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"judul" varchar,
  	"kelas" varchar,
  	"topik" varchar,
  	"gambar_id" integer,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_idea_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kolom" "enum__pages_v_blocks_idea_cards_kolom" DEFAULT '4',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_donation_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"judul" varchar,
  	"judul_sorot" varchar,
  	"isi" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_donation_campaigns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"judul" varchar,
  	"gambar_id" integer,
  	"terkumpul" numeric,
  	"target" numeric,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_donation_campaigns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kolom" "enum__pages_v_blocks_donation_campaigns_kolom" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN "garis_bawah" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_stat_counter" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_value_cards" ADD COLUMN "tumpuk_di_atas_hero" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_latest_news" ADD COLUMN "kolom" "enum_pages_blocks_latest_news_kolom" DEFAULT '3';
  ALTER TABLE "pages_blocks_latest_news" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_latest_news" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "pages_blocks_latest_news" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "lebar" "enum_pages_blocks_rich_text_lebar" DEFAULT 'sedang';
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "rata_tengah" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN "garis_bawah" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_stat_counter" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_value_cards" ADD COLUMN "tumpuk_di_atas_hero" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_latest_news" ADD COLUMN "kolom" "enum__pages_v_blocks_latest_news_kolom" DEFAULT '3';
  ALTER TABLE "_pages_v_blocks_latest_news" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_latest_news" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "_pages_v_blocks_latest_news" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "lebar" "enum__pages_v_blocks_rich_text_lebar" DEFAULT 'sedang';
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "rata_tengah" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_feature_cards_cards" ADD CONSTRAINT "pages_blocks_feature_cards_cards_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards_cards" ADD CONSTRAINT "pages_blocks_feature_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards" ADD CONSTRAINT "pages_blocks_feature_cards_gambar_samping_gambar_id_media_id_fk" FOREIGN KEY ("gambar_samping_gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards" ADD CONSTRAINT "pages_blocks_feature_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_callout_tautan_tambahan" ADD CONSTRAINT "pages_blocks_callout_tautan_tambahan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_callout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_callout" ADD CONSTRAINT "pages_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_entries" ADD CONSTRAINT "pages_blocks_timeline_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid" ADD CONSTRAINT "pages_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_logos" ADD CONSTRAINT "pages_blocks_partner_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_grid" ADD CONSTRAINT "pages_blocks_video_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_training_modules" ADD CONSTRAINT "pages_blocks_training_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_indonesia_map_stats" ADD CONSTRAINT "pages_blocks_indonesia_map_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_indonesia_map"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_indonesia_map" ADD CONSTRAINT "pages_blocks_indonesia_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_idea_cards_items" ADD CONSTRAINT "pages_blocks_idea_cards_items_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_idea_cards_items" ADD CONSTRAINT "pages_blocks_idea_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_idea_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_idea_cards" ADD CONSTRAINT "pages_blocks_idea_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donation_tiers" ADD CONSTRAINT "pages_blocks_donation_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donation_campaigns_items" ADD CONSTRAINT "pages_blocks_donation_campaigns_items_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_donation_campaigns_items" ADD CONSTRAINT "pages_blocks_donation_campaigns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_donation_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donation_campaigns" ADD CONSTRAINT "pages_blocks_donation_campaigns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" ADD CONSTRAINT "_pages_v_blocks_feature_cards_cards_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" ADD CONSTRAINT "_pages_v_blocks_feature_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards" ADD CONSTRAINT "_pages_v_blocks_feature_cards_gambar_samping_gambar_id_media_id_fk" FOREIGN KEY ("gambar_samping_gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards" ADD CONSTRAINT "_pages_v_blocks_feature_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_callout_tautan_tambahan" ADD CONSTRAINT "_pages_v_blocks_callout_tautan_tambahan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_callout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_callout" ADD CONSTRAINT "_pages_v_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_entries" ADD CONSTRAINT "_pages_v_blocks_timeline_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_grid" ADD CONSTRAINT "_pages_v_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_logos" ADD CONSTRAINT "_pages_v_blocks_partner_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_grid" ADD CONSTRAINT "_pages_v_blocks_video_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_training_modules" ADD CONSTRAINT "_pages_v_blocks_training_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_indonesia_map_stats" ADD CONSTRAINT "_pages_v_blocks_indonesia_map_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_indonesia_map"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_indonesia_map" ADD CONSTRAINT "_pages_v_blocks_indonesia_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_idea_cards_items" ADD CONSTRAINT "_pages_v_blocks_idea_cards_items_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_idea_cards_items" ADD CONSTRAINT "_pages_v_blocks_idea_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_idea_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_idea_cards" ADD CONSTRAINT "_pages_v_blocks_idea_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donation_tiers" ADD CONSTRAINT "_pages_v_blocks_donation_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donation_campaigns_items" ADD CONSTRAINT "_pages_v_blocks_donation_campaigns_items_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donation_campaigns_items" ADD CONSTRAINT "_pages_v_blocks_donation_campaigns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_donation_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donation_campaigns" ADD CONSTRAINT "_pages_v_blocks_donation_campaigns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_feature_cards_cards_order_idx" ON "pages_blocks_feature_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_cards_cards_parent_id_idx" ON "pages_blocks_feature_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_cards_cards_gambar_idx" ON "pages_blocks_feature_cards_cards" USING btree ("gambar_id");
  CREATE INDEX "pages_blocks_feature_cards_order_idx" ON "pages_blocks_feature_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_cards_parent_id_idx" ON "pages_blocks_feature_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_cards_path_idx" ON "pages_blocks_feature_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_cards_gambar_samping_gambar_samping_idx" ON "pages_blocks_feature_cards" USING btree ("gambar_samping_gambar_id");
  CREATE INDEX "pages_blocks_callout_tautan_tambahan_order_idx" ON "pages_blocks_callout_tautan_tambahan" USING btree ("_order");
  CREATE INDEX "pages_blocks_callout_tautan_tambahan_parent_id_idx" ON "pages_blocks_callout_tautan_tambahan" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_callout_order_idx" ON "pages_blocks_callout" USING btree ("_order");
  CREATE INDEX "pages_blocks_callout_parent_id_idx" ON "pages_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_callout_path_idx" ON "pages_blocks_callout" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_entries_order_idx" ON "pages_blocks_timeline_entries" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_entries_parent_id_idx" ON "pages_blocks_timeline_entries" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_grid_order_idx" ON "pages_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_parent_id_idx" ON "pages_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_path_idx" ON "pages_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_partner_logos_order_idx" ON "pages_blocks_partner_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_partner_logos_parent_id_idx" ON "pages_blocks_partner_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partner_logos_path_idx" ON "pages_blocks_partner_logos" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_grid_order_idx" ON "pages_blocks_video_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_grid_parent_id_idx" ON "pages_blocks_video_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_grid_path_idx" ON "pages_blocks_video_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_training_modules_order_idx" ON "pages_blocks_training_modules" USING btree ("_order");
  CREATE INDEX "pages_blocks_training_modules_parent_id_idx" ON "pages_blocks_training_modules" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_training_modules_path_idx" ON "pages_blocks_training_modules" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_foto_idx" ON "pages_blocks_testimonials_items" USING btree ("foto_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_indonesia_map_stats_order_idx" ON "pages_blocks_indonesia_map_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_indonesia_map_stats_parent_id_idx" ON "pages_blocks_indonesia_map_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_indonesia_map_order_idx" ON "pages_blocks_indonesia_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_indonesia_map_parent_id_idx" ON "pages_blocks_indonesia_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_indonesia_map_path_idx" ON "pages_blocks_indonesia_map" USING btree ("_path");
  CREATE INDEX "pages_blocks_idea_cards_items_order_idx" ON "pages_blocks_idea_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_idea_cards_items_parent_id_idx" ON "pages_blocks_idea_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_idea_cards_items_gambar_idx" ON "pages_blocks_idea_cards_items" USING btree ("gambar_id");
  CREATE INDEX "pages_blocks_idea_cards_order_idx" ON "pages_blocks_idea_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_idea_cards_parent_id_idx" ON "pages_blocks_idea_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_idea_cards_path_idx" ON "pages_blocks_idea_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_donation_tiers_order_idx" ON "pages_blocks_donation_tiers" USING btree ("_order");
  CREATE INDEX "pages_blocks_donation_tiers_parent_id_idx" ON "pages_blocks_donation_tiers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_donation_tiers_path_idx" ON "pages_blocks_donation_tiers" USING btree ("_path");
  CREATE INDEX "pages_blocks_donation_campaigns_items_order_idx" ON "pages_blocks_donation_campaigns_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_donation_campaigns_items_parent_id_idx" ON "pages_blocks_donation_campaigns_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_donation_campaigns_items_gambar_idx" ON "pages_blocks_donation_campaigns_items" USING btree ("gambar_id");
  CREATE INDEX "pages_blocks_donation_campaigns_order_idx" ON "pages_blocks_donation_campaigns" USING btree ("_order");
  CREATE INDEX "pages_blocks_donation_campaigns_parent_id_idx" ON "pages_blocks_donation_campaigns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_donation_campaigns_path_idx" ON "pages_blocks_donation_campaigns" USING btree ("_path");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_feature_cards_cards_order_idx" ON "_pages_v_blocks_feature_cards_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_cards_cards_parent_id_idx" ON "_pages_v_blocks_feature_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_cards_cards_gambar_idx" ON "_pages_v_blocks_feature_cards_cards" USING btree ("gambar_id");
  CREATE INDEX "_pages_v_blocks_feature_cards_order_idx" ON "_pages_v_blocks_feature_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_cards_parent_id_idx" ON "_pages_v_blocks_feature_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_cards_path_idx" ON "_pages_v_blocks_feature_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_cards_gambar_samping_gambar_samp_idx" ON "_pages_v_blocks_feature_cards" USING btree ("gambar_samping_gambar_id");
  CREATE INDEX "_pages_v_blocks_callout_tautan_tambahan_order_idx" ON "_pages_v_blocks_callout_tautan_tambahan" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_callout_tautan_tambahan_parent_id_idx" ON "_pages_v_blocks_callout_tautan_tambahan" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_callout_order_idx" ON "_pages_v_blocks_callout" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_callout_parent_id_idx" ON "_pages_v_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_callout_path_idx" ON "_pages_v_blocks_callout" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_entries_order_idx" ON "_pages_v_blocks_timeline_entries" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_entries_parent_id_idx" ON "_pages_v_blocks_timeline_entries" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_grid_order_idx" ON "_pages_v_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_grid_parent_id_idx" ON "_pages_v_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_grid_path_idx" ON "_pages_v_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_partner_logos_order_idx" ON "_pages_v_blocks_partner_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partner_logos_parent_id_idx" ON "_pages_v_blocks_partner_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partner_logos_path_idx" ON "_pages_v_blocks_partner_logos" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_grid_order_idx" ON "_pages_v_blocks_video_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_grid_parent_id_idx" ON "_pages_v_blocks_video_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_grid_path_idx" ON "_pages_v_blocks_video_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_training_modules_order_idx" ON "_pages_v_blocks_training_modules" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_training_modules_parent_id_idx" ON "_pages_v_blocks_training_modules" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_training_modules_path_idx" ON "_pages_v_blocks_training_modules" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_foto_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("foto_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_indonesia_map_stats_order_idx" ON "_pages_v_blocks_indonesia_map_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_indonesia_map_stats_parent_id_idx" ON "_pages_v_blocks_indonesia_map_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_indonesia_map_order_idx" ON "_pages_v_blocks_indonesia_map" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_indonesia_map_parent_id_idx" ON "_pages_v_blocks_indonesia_map" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_indonesia_map_path_idx" ON "_pages_v_blocks_indonesia_map" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_idea_cards_items_order_idx" ON "_pages_v_blocks_idea_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_idea_cards_items_parent_id_idx" ON "_pages_v_blocks_idea_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_idea_cards_items_gambar_idx" ON "_pages_v_blocks_idea_cards_items" USING btree ("gambar_id");
  CREATE INDEX "_pages_v_blocks_idea_cards_order_idx" ON "_pages_v_blocks_idea_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_idea_cards_parent_id_idx" ON "_pages_v_blocks_idea_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_idea_cards_path_idx" ON "_pages_v_blocks_idea_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_donation_tiers_order_idx" ON "_pages_v_blocks_donation_tiers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_donation_tiers_parent_id_idx" ON "_pages_v_blocks_donation_tiers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_donation_tiers_path_idx" ON "_pages_v_blocks_donation_tiers" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_donation_campaigns_items_order_idx" ON "_pages_v_blocks_donation_campaigns_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_donation_campaigns_items_parent_id_idx" ON "_pages_v_blocks_donation_campaigns_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_donation_campaigns_items_gambar_idx" ON "_pages_v_blocks_donation_campaigns_items" USING btree ("gambar_id");
  CREATE INDEX "_pages_v_blocks_donation_campaigns_order_idx" ON "_pages_v_blocks_donation_campaigns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_donation_campaigns_parent_id_idx" ON "_pages_v_blocks_donation_campaigns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_donation_campaigns_path_idx" ON "_pages_v_blocks_donation_campaigns" USING btree ("_path");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_feature_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_feature_cards" CASCADE;
  DROP TABLE "pages_blocks_callout_tautan_tambahan" CASCADE;
  DROP TABLE "pages_blocks_callout" CASCADE;
  DROP TABLE "pages_blocks_timeline_entries" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_team_grid" CASCADE;
  DROP TABLE "pages_blocks_partner_logos" CASCADE;
  DROP TABLE "pages_blocks_video_grid" CASCADE;
  DROP TABLE "pages_blocks_training_modules" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_indonesia_map_stats" CASCADE;
  DROP TABLE "pages_blocks_indonesia_map" CASCADE;
  DROP TABLE "pages_blocks_idea_cards_items" CASCADE;
  DROP TABLE "pages_blocks_idea_cards" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_donation_tiers" CASCADE;
  DROP TABLE "pages_blocks_donation_campaigns_items" CASCADE;
  DROP TABLE "pages_blocks_donation_campaigns" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_cards_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_callout_tautan_tambahan" CASCADE;
  DROP TABLE "_pages_v_blocks_callout" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_entries" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_team_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_video_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_training_modules" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_indonesia_map_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_indonesia_map" CASCADE;
  DROP TABLE "_pages_v_blocks_idea_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_idea_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_donation_tiers" CASCADE;
  DROP TABLE "_pages_v_blocks_donation_campaigns_items" CASCADE;
  DROP TABLE "_pages_v_blocks_donation_campaigns" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  ALTER TABLE "pages_blocks_page_hero" DROP COLUMN "garis_bawah";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "lebar";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "rata_tengah";
  ALTER TABLE "pages_blocks_value_cards" DROP COLUMN "tumpuk_di_atas_hero";
  ALTER TABLE "pages_blocks_stat_counter" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_latest_news" DROP COLUMN "kolom";
  ALTER TABLE "pages_blocks_latest_news" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_latest_news" DROP COLUMN "cta_href";
  ALTER TABLE "pages_blocks_latest_news" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_page_hero" DROP COLUMN "garis_bawah";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "lebar";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "rata_tengah";
  ALTER TABLE "_pages_v_blocks_value_cards" DROP COLUMN "tumpuk_di_atas_hero";
  ALTER TABLE "_pages_v_blocks_stat_counter" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_latest_news" DROP COLUMN "kolom";
  ALTER TABLE "_pages_v_blocks_latest_news" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_latest_news" DROP COLUMN "cta_href";
  ALTER TABLE "_pages_v_blocks_latest_news" DROP COLUMN "anchor";
  DROP TYPE "public"."enum_pages_blocks_rich_text_lebar";
  DROP TYPE "public"."enum_pages_blocks_feature_cards_cards_warna";
  DROP TYPE "public"."enum_pages_blocks_feature_cards_kolom";
  DROP TYPE "public"."enum_pages_blocks_callout_warna";
  DROP TYPE "public"."enum_pages_blocks_latest_news_kolom";
  DROP TYPE "public"."enum_pages_blocks_partner_logos_tampilan";
  DROP TYPE "public"."enum_pages_blocks_video_grid_kolom";
  DROP TYPE "public"."enum_pages_blocks_training_modules_program";
  DROP TYPE "public"."enum_pages_blocks_training_modules_tampilan";
  DROP TYPE "public"."enum_pages_blocks_gallery_kolom";
  DROP TYPE "public"."enum_pages_blocks_idea_cards_kolom";
  DROP TYPE "public"."enum_pages_blocks_donation_campaigns_kolom";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_lebar";
  DROP TYPE "public"."enum__pages_v_blocks_feature_cards_cards_warna";
  DROP TYPE "public"."enum__pages_v_blocks_feature_cards_kolom";
  DROP TYPE "public"."enum__pages_v_blocks_callout_warna";
  DROP TYPE "public"."enum__pages_v_blocks_latest_news_kolom";
  DROP TYPE "public"."enum__pages_v_blocks_partner_logos_tampilan";
  DROP TYPE "public"."enum__pages_v_blocks_video_grid_kolom";
  DROP TYPE "public"."enum__pages_v_blocks_training_modules_program";
  DROP TYPE "public"."enum__pages_v_blocks_training_modules_tampilan";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_kolom";
  DROP TYPE "public"."enum__pages_v_blocks_idea_cards_kolom";
  DROP TYPE "public"."enum__pages_v_blocks_donation_campaigns_kolom";`)
}
