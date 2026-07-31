import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('id', 'en');
  CREATE TABLE "pages_blocks_hero_slides_locales" (
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_page_hero_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_rich_text_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_cards_cards_locales" (
  	"judul" varchar,
  	"subjudul" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_cards_locales" (
  	"heading" varchar,
  	"gambar_samping_judul" varchar,
  	"gambar_samping_judul_sorot" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_value_cards_cards_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_callout_locales" (
  	"judul" varchar,
  	"isi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_banner_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_timeline_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stat_counter_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_latest_news_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_team_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partner_logos_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_video_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_training_modules_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_testimonials_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_indonesia_map_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_idea_cards_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact_form_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_donation_tiers_locales" (
  	"judul" varchar,
  	"judul_sorot" varchar,
  	"isi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_donation_campaigns_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slides_locales" (
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_cards_cards_locales" (
  	"judul" varchar,
  	"subjudul" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_cards_locales" (
  	"heading" varchar,
  	"gambar_samping_judul" varchar,
  	"gambar_samping_judul_sorot" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_value_cards_cards_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_callout_locales" (
  	"judul" varchar,
  	"isi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stat_counter_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_latest_news_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_team_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_partner_logos_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_video_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_training_modules_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_indonesia_map_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_idea_cards_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_donation_tiers_locales" (
  	"judul" varchar,
  	"judul_sorot" varchar,
  	"isi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_donation_campaigns_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "articles" DROP CONSTRAINT "articles_meta_image_id_media_id_fk";
  
  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk";
  
  DROP INDEX "pages_meta_meta_image_idx";
  DROP INDEX "_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX "articles_meta_meta_image_idx";
  DROP INDEX "_articles_v_version_meta_version_meta_image_idx";
  ALTER TABLE "_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN "published_locale" "enum__pages_v_published_locale";
  ALTER TABLE "_articles_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_articles_v" ADD COLUMN "published_locale" "enum__articles_v_published_locale";
  ALTER TABLE "pages_blocks_hero_slides_locales" ADD CONSTRAINT "pages_blocks_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero_locales" ADD CONSTRAINT "pages_blocks_page_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_locales" ADD CONSTRAINT "pages_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards_cards_locales" ADD CONSTRAINT "pages_blocks_feature_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards_locales" ADD CONSTRAINT "pages_blocks_feature_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_cards_cards_locales" ADD CONSTRAINT "pages_blocks_value_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_callout_locales" ADD CONSTRAINT "pages_blocks_callout_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_callout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner_locales" ADD CONSTRAINT "pages_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_locales" ADD CONSTRAINT "pages_blocks_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_counter_locales" ADD CONSTRAINT "pages_blocks_stat_counter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stat_counter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_latest_news_locales" ADD CONSTRAINT "pages_blocks_latest_news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_latest_news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid_locales" ADD CONSTRAINT "pages_blocks_team_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_logos_locales" ADD CONSTRAINT "pages_blocks_partner_logos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_grid_locales" ADD CONSTRAINT "pages_blocks_video_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_training_modules_locales" ADD CONSTRAINT "pages_blocks_training_modules_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_training_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_locales" ADD CONSTRAINT "pages_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_locales" ADD CONSTRAINT "pages_blocks_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_indonesia_map_locales" ADD CONSTRAINT "pages_blocks_indonesia_map_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_indonesia_map"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_idea_cards_locales" ADD CONSTRAINT "pages_blocks_idea_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_idea_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form_locales" ADD CONSTRAINT "pages_blocks_contact_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donation_tiers_locales" ADD CONSTRAINT "pages_blocks_donation_tiers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_donation_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donation_campaigns_locales" ADD CONSTRAINT "pages_blocks_donation_campaigns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_donation_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides_locales" ADD CONSTRAINT "_pages_v_blocks_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero_locales" ADD CONSTRAINT "_pages_v_blocks_page_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_locales" ADD CONSTRAINT "_pages_v_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards_locales" ADD CONSTRAINT "_pages_v_blocks_feature_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards_locales" ADD CONSTRAINT "_pages_v_blocks_feature_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_cards_cards_locales" ADD CONSTRAINT "_pages_v_blocks_value_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_callout_locales" ADD CONSTRAINT "_pages_v_blocks_callout_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_callout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" ADD CONSTRAINT "_pages_v_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_locales" ADD CONSTRAINT "_pages_v_blocks_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stat_counter_locales" ADD CONSTRAINT "_pages_v_blocks_stat_counter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stat_counter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_latest_news_locales" ADD CONSTRAINT "_pages_v_blocks_latest_news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_latest_news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_grid_locales" ADD CONSTRAINT "_pages_v_blocks_team_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_logos_locales" ADD CONSTRAINT "_pages_v_blocks_partner_logos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_grid_locales" ADD CONSTRAINT "_pages_v_blocks_video_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_training_modules_locales" ADD CONSTRAINT "_pages_v_blocks_training_modules_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_training_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_locales" ADD CONSTRAINT "_pages_v_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_locales" ADD CONSTRAINT "_pages_v_blocks_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_indonesia_map_locales" ADD CONSTRAINT "_pages_v_blocks_indonesia_map_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_indonesia_map"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_idea_cards_locales" ADD CONSTRAINT "_pages_v_blocks_idea_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_idea_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form_locales" ADD CONSTRAINT "_pages_v_blocks_contact_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donation_tiers_locales" ADD CONSTRAINT "_pages_v_blocks_donation_tiers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_donation_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donation_campaigns_locales" ADD CONSTRAINT "_pages_v_blocks_donation_campaigns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_donation_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_blocks_hero_slides_locales_locale_parent_id_unique" ON "pages_blocks_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_page_hero_locales_locale_parent_id_unique" ON "pages_blocks_page_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_rich_text_locales_locale_parent_id_unique" ON "pages_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_feature_cards_cards_locales_locale_parent_id_un" ON "pages_blocks_feature_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_feature_cards_locales_locale_parent_id_unique" ON "pages_blocks_feature_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_value_cards_cards_locales_locale_parent_id_uniq" ON "pages_blocks_value_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_callout_locales_locale_parent_id_unique" ON "pages_blocks_callout_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_banner_locales_locale_parent_id_unique" ON "pages_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_timeline_locales_locale_parent_id_unique" ON "pages_blocks_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stat_counter_locales_locale_parent_id_unique" ON "pages_blocks_stat_counter_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_latest_news_locales_locale_parent_id_unique" ON "pages_blocks_latest_news_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_team_grid_locales_locale_parent_id_unique" ON "pages_blocks_team_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_partner_logos_locales_locale_parent_id_unique" ON "pages_blocks_partner_logos_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_video_grid_locales_locale_parent_id_unique" ON "pages_blocks_video_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_training_modules_locales_locale_parent_id_uniqu" ON "pages_blocks_training_modules_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_gallery_locales_locale_parent_id_unique" ON "pages_blocks_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_testimonials_locales_locale_parent_id_unique" ON "pages_blocks_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_indonesia_map_locales_locale_parent_id_unique" ON "pages_blocks_indonesia_map_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_idea_cards_locales_locale_parent_id_unique" ON "pages_blocks_idea_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_contact_form_locales_locale_parent_id_unique" ON "pages_blocks_contact_form_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_donation_tiers_locales_locale_parent_id_unique" ON "pages_blocks_donation_tiers_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_donation_campaigns_locales_locale_parent_id_uni" ON "pages_blocks_donation_campaigns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_slides_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_hero_locales_locale_parent_id_unique" ON "_pages_v_blocks_page_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_rich_text_locales_locale_parent_id_unique" ON "_pages_v_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_cards_cards_locales_locale_parent_id" ON "_pages_v_blocks_feature_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_cards_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_feature_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_value_cards_cards_locales_locale_parent_id_u" ON "_pages_v_blocks_value_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_callout_locales_locale_parent_id_unique" ON "_pages_v_blocks_callout_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_banner_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_timeline_locales_locale_parent_id_unique" ON "_pages_v_blocks_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stat_counter_locales_locale_parent_id_unique" ON "_pages_v_blocks_stat_counter_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_latest_news_locales_locale_parent_id_unique" ON "_pages_v_blocks_latest_news_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_team_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_team_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_partner_logos_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_partner_logos_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_video_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_video_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_training_modules_locales_locale_parent_id_un" ON "_pages_v_blocks_training_modules_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_gallery_locales_locale_parent_id_unique" ON "_pages_v_blocks_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_testimonials_locales_locale_parent_id_unique" ON "_pages_v_blocks_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_indonesia_map_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_indonesia_map_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_idea_cards_locales_locale_parent_id_unique" ON "_pages_v_blocks_idea_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_contact_form_locales_locale_parent_id_unique" ON "_pages_v_blocks_contact_form_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_donation_tiers_locales_locale_parent_id_uniq" ON "_pages_v_blocks_donation_tiers_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_donation_campaigns_locales_locale_parent_id_" ON "_pages_v_blocks_donation_campaigns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");`)

  /**
   * Pindahkan isi kolom lama ke tabel *_locales sebagai versi Indonesia.
   * Tanpa langkah ini, DROP COLUMN di bawah akan menghapus seluruh judul &
   * judul bagian yang sudah diisi staf. Payload menjalankan migrasi dalam
   * satu transaksi, jadi kegagalan di sini membatalkan semuanya.
   */
  await db.execute(sql`
  INSERT INTO "pages_blocks_hero_slides_locales" ("_locale", "_parent_id", "title", "highlight", "description")
    SELECT 'id', "id", "title", "highlight", "description" FROM "pages_blocks_hero_slides";
  INSERT INTO "pages_blocks_page_hero_locales" ("_locale", "_parent_id", "title", "description")
    SELECT 'id', "id", "title", "description" FROM "pages_blocks_page_hero";
  INSERT INTO "pages_blocks_rich_text_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_rich_text";
  INSERT INTO "pages_blocks_feature_cards_cards_locales" ("_locale", "_parent_id", "judul", "subjudul")
    SELECT 'id', "id", "judul", "subjudul" FROM "pages_blocks_feature_cards_cards";
  INSERT INTO "pages_blocks_feature_cards_locales" ("_locale", "_parent_id", "heading", "gambar_samping_judul", "gambar_samping_judul_sorot")
    SELECT 'id', "id", "heading", "gambar_samping_judul", "gambar_samping_judul_sorot" FROM "pages_blocks_feature_cards";
  INSERT INTO "pages_blocks_value_cards_cards_locales" ("_locale", "_parent_id", "title", "body")
    SELECT 'id', "id", "title", "body" FROM "pages_blocks_value_cards_cards";
  INSERT INTO "pages_blocks_callout_locales" ("_locale", "_parent_id", "judul", "isi")
    SELECT 'id', "id", "judul", "isi" FROM "pages_blocks_callout";
  INSERT INTO "pages_blocks_cta_banner_locales" ("_locale", "_parent_id", "title", "body")
    SELECT 'id', "id", "title", "body" FROM "pages_blocks_cta_banner";
  INSERT INTO "pages_blocks_timeline_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_timeline";
  INSERT INTO "pages_blocks_stat_counter_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_stat_counter";
  INSERT INTO "pages_blocks_latest_news_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_latest_news";
  INSERT INTO "pages_blocks_team_grid_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_team_grid";
  INSERT INTO "pages_blocks_partner_logos_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_partner_logos";
  INSERT INTO "pages_blocks_video_grid_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_video_grid";
  INSERT INTO "pages_blocks_training_modules_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_training_modules";
  INSERT INTO "pages_blocks_gallery_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_gallery";
  INSERT INTO "pages_blocks_testimonials_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_testimonials";
  INSERT INTO "pages_blocks_indonesia_map_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_indonesia_map";
  INSERT INTO "pages_blocks_idea_cards_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_idea_cards";
  INSERT INTO "pages_blocks_contact_form_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_contact_form";
  INSERT INTO "pages_blocks_donation_tiers_locales" ("_locale", "_parent_id", "judul", "judul_sorot", "isi")
    SELECT 'id', "id", "judul", "judul_sorot", "isi" FROM "pages_blocks_donation_tiers";
  INSERT INTO "pages_blocks_donation_campaigns_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "pages_blocks_donation_campaigns";
  INSERT INTO "pages_locales" ("_locale", "_parent_id", "title", "meta_title", "meta_description", "meta_image_id")
    SELECT 'id', "id", "title", "meta_title", "meta_description", "meta_image_id" FROM "pages";
  INSERT INTO "_pages_v_blocks_hero_slides_locales" ("_locale", "_parent_id", "title", "highlight", "description")
    SELECT 'id', "id", "title", "highlight", "description" FROM "_pages_v_blocks_hero_slides";
  INSERT INTO "_pages_v_blocks_page_hero_locales" ("_locale", "_parent_id", "title", "description")
    SELECT 'id', "id", "title", "description" FROM "_pages_v_blocks_page_hero";
  INSERT INTO "_pages_v_blocks_rich_text_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_rich_text";
  INSERT INTO "_pages_v_blocks_feature_cards_cards_locales" ("_locale", "_parent_id", "judul", "subjudul")
    SELECT 'id', "id", "judul", "subjudul" FROM "_pages_v_blocks_feature_cards_cards";
  INSERT INTO "_pages_v_blocks_feature_cards_locales" ("_locale", "_parent_id", "heading", "gambar_samping_judul", "gambar_samping_judul_sorot")
    SELECT 'id', "id", "heading", "gambar_samping_judul", "gambar_samping_judul_sorot" FROM "_pages_v_blocks_feature_cards";
  INSERT INTO "_pages_v_blocks_value_cards_cards_locales" ("_locale", "_parent_id", "title", "body")
    SELECT 'id', "id", "title", "body" FROM "_pages_v_blocks_value_cards_cards";
  INSERT INTO "_pages_v_blocks_callout_locales" ("_locale", "_parent_id", "judul", "isi")
    SELECT 'id', "id", "judul", "isi" FROM "_pages_v_blocks_callout";
  INSERT INTO "_pages_v_blocks_cta_banner_locales" ("_locale", "_parent_id", "title", "body")
    SELECT 'id', "id", "title", "body" FROM "_pages_v_blocks_cta_banner";
  INSERT INTO "_pages_v_blocks_timeline_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_timeline";
  INSERT INTO "_pages_v_blocks_stat_counter_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_stat_counter";
  INSERT INTO "_pages_v_blocks_latest_news_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_latest_news";
  INSERT INTO "_pages_v_blocks_team_grid_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_team_grid";
  INSERT INTO "_pages_v_blocks_partner_logos_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_partner_logos";
  INSERT INTO "_pages_v_blocks_video_grid_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_video_grid";
  INSERT INTO "_pages_v_blocks_training_modules_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_training_modules";
  INSERT INTO "_pages_v_blocks_gallery_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_gallery";
  INSERT INTO "_pages_v_blocks_testimonials_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_testimonials";
  INSERT INTO "_pages_v_blocks_indonesia_map_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_indonesia_map";
  INSERT INTO "_pages_v_blocks_idea_cards_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_idea_cards";
  INSERT INTO "_pages_v_blocks_contact_form_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_contact_form";
  INSERT INTO "_pages_v_blocks_donation_tiers_locales" ("_locale", "_parent_id", "judul", "judul_sorot", "isi")
    SELECT 'id', "id", "judul", "judul_sorot", "isi" FROM "_pages_v_blocks_donation_tiers";
  INSERT INTO "_pages_v_blocks_donation_campaigns_locales" ("_locale", "_parent_id", "heading")
    SELECT 'id', "id", "heading" FROM "_pages_v_blocks_donation_campaigns";
  INSERT INTO "_pages_v_locales" ("_locale", "_parent_id", "version_title", "version_meta_title", "version_meta_description", "version_meta_image_id")
    SELECT 'id', "id", "version_title", "version_meta_title", "version_meta_description", "version_meta_image_id" FROM "_pages_v";
  INSERT INTO "articles_locales" ("_locale", "_parent_id", "title", "meta_title", "meta_description", "meta_image_id")
    SELECT 'id', "id", "title", "meta_title", "meta_description", "meta_image_id" FROM "articles";
  INSERT INTO "_articles_v_locales" ("_locale", "_parent_id", "version_title", "version_meta_title", "version_meta_description", "version_meta_image_id")
    SELECT 'id', "id", "version_title", "version_meta_title", "version_meta_description", "version_meta_image_id" FROM "_articles_v";`)

  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_slides" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_hero_slides" DROP COLUMN "highlight";
  ALTER TABLE "pages_blocks_hero_slides" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_page_hero" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_page_hero" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_feature_cards_cards" DROP COLUMN "judul";
  ALTER TABLE "pages_blocks_feature_cards_cards" DROP COLUMN "subjudul";
  ALTER TABLE "pages_blocks_feature_cards" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_feature_cards" DROP COLUMN "gambar_samping_judul";
  ALTER TABLE "pages_blocks_feature_cards" DROP COLUMN "gambar_samping_judul_sorot";
  ALTER TABLE "pages_blocks_value_cards_cards" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_value_cards_cards" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_callout" DROP COLUMN "judul";
  ALTER TABLE "pages_blocks_callout" DROP COLUMN "isi";
  ALTER TABLE "pages_blocks_cta_banner" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_cta_banner" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_timeline" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_stat_counter" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_latest_news" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_team_grid" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_partner_logos" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_video_grid" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_training_modules" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_indonesia_map" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_idea_cards" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_contact_form" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_donation_tiers" DROP COLUMN "judul";
  ALTER TABLE "pages_blocks_donation_tiers" DROP COLUMN "judul_sorot";
  ALTER TABLE "pages_blocks_donation_tiers" DROP COLUMN "isi";
  ALTER TABLE "pages_blocks_donation_campaigns" DROP COLUMN "heading";
  ALTER TABLE "pages" DROP COLUMN "title";
  ALTER TABLE "pages" DROP COLUMN "meta_title";
  ALTER TABLE "pages" DROP COLUMN "meta_description";
  ALTER TABLE "pages" DROP COLUMN "meta_image_id";
  ALTER TABLE "_pages_v_blocks_hero_slides" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_hero_slides" DROP COLUMN "highlight";
  ALTER TABLE "_pages_v_blocks_hero_slides" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_page_hero" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_page_hero" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" DROP COLUMN "judul";
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" DROP COLUMN "subjudul";
  ALTER TABLE "_pages_v_blocks_feature_cards" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_feature_cards" DROP COLUMN "gambar_samping_judul";
  ALTER TABLE "_pages_v_blocks_feature_cards" DROP COLUMN "gambar_samping_judul_sorot";
  ALTER TABLE "_pages_v_blocks_value_cards_cards" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_value_cards_cards" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_callout" DROP COLUMN "judul";
  ALTER TABLE "_pages_v_blocks_callout" DROP COLUMN "isi";
  ALTER TABLE "_pages_v_blocks_cta_banner" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_cta_banner" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_timeline" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_stat_counter" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_latest_news" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_team_grid" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_partner_logos" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_video_grid" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_training_modules" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_indonesia_map" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_idea_cards" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_contact_form" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_donation_tiers" DROP COLUMN "judul";
  ALTER TABLE "_pages_v_blocks_donation_tiers" DROP COLUMN "judul_sorot";
  ALTER TABLE "_pages_v_blocks_donation_tiers" DROP COLUMN "isi";
  ALTER TABLE "_pages_v_blocks_donation_campaigns" DROP COLUMN "heading";
  ALTER TABLE "_pages_v" DROP COLUMN "version_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "articles" DROP COLUMN "title";
  ALTER TABLE "articles" DROP COLUMN "meta_title";
  ALTER TABLE "articles" DROP COLUMN "meta_description";
  ALTER TABLE "articles" DROP COLUMN "meta_image_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_title";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_articles_v" DROP COLUMN "version_meta_image_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // 1. Kembalikan kolom lama lebih dulu supaya ada tempat menaruh datanya.
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_slides" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_hero_slides" ADD COLUMN "highlight" varchar;
  ALTER TABLE "pages_blocks_hero_slides" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_feature_cards_cards" ADD COLUMN "judul" varchar;
  ALTER TABLE "pages_blocks_feature_cards_cards" ADD COLUMN "subjudul" varchar;
  ALTER TABLE "pages_blocks_feature_cards" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_feature_cards" ADD COLUMN "gambar_samping_judul" varchar;
  ALTER TABLE "pages_blocks_feature_cards" ADD COLUMN "gambar_samping_judul_sorot" varchar;
  ALTER TABLE "pages_blocks_value_cards_cards" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_value_cards_cards" ADD COLUMN "body" varchar;
  ALTER TABLE "pages_blocks_callout" ADD COLUMN "judul" varchar;
  ALTER TABLE "pages_blocks_callout" ADD COLUMN "isi" varchar;
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN "body" varchar;
  ALTER TABLE "pages_blocks_timeline" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_stat_counter" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_latest_news" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_team_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_partner_logos" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_video_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_training_modules" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_indonesia_map" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_idea_cards" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_contact_form" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_donation_tiers" ADD COLUMN "judul" varchar;
  ALTER TABLE "pages_blocks_donation_tiers" ADD COLUMN "judul_sorot" varchar;
  ALTER TABLE "pages_blocks_donation_tiers" ADD COLUMN "isi" varchar;
  ALTER TABLE "pages_blocks_donation_campaigns" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages" ADD COLUMN "title" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD COLUMN "highlight" varchar;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" ADD COLUMN "judul" varchar;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" ADD COLUMN "subjudul" varchar;
  ALTER TABLE "_pages_v_blocks_feature_cards" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_feature_cards" ADD COLUMN "gambar_samping_judul" varchar;
  ALTER TABLE "_pages_v_blocks_feature_cards" ADD COLUMN "gambar_samping_judul_sorot" varchar;
  ALTER TABLE "_pages_v_blocks_value_cards_cards" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_value_cards_cards" ADD COLUMN "body" varchar;
  ALTER TABLE "_pages_v_blocks_callout" ADD COLUMN "judul" varchar;
  ALTER TABLE "_pages_v_blocks_callout" ADD COLUMN "isi" varchar;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN "body" varchar;
  ALTER TABLE "_pages_v_blocks_timeline" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_stat_counter" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_latest_news" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_team_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_partner_logos" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_video_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_training_modules" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_indonesia_map" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_idea_cards" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_donation_tiers" ADD COLUMN "judul" varchar;
  ALTER TABLE "_pages_v_blocks_donation_tiers" ADD COLUMN "judul_sorot" varchar;
  ALTER TABLE "_pages_v_blocks_donation_tiers" ADD COLUMN "isi" varchar;
  ALTER TABLE "_pages_v_blocks_donation_campaigns" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "articles" ADD COLUMN "title" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_meta_image_id" integer;`)

  // 2. Salin kembali versi Indonesia dari tabel *_locales.
  await db.execute(sql`
  UPDATE "pages_blocks_hero_slides" SET "title" = l."title", "highlight" = l."highlight", "description" = l."description"
    FROM "pages_blocks_hero_slides_locales" l
    WHERE l."_parent_id" = "pages_blocks_hero_slides"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_page_hero" SET "title" = l."title", "description" = l."description"
    FROM "pages_blocks_page_hero_locales" l
    WHERE l."_parent_id" = "pages_blocks_page_hero"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_rich_text" SET "heading" = l."heading"
    FROM "pages_blocks_rich_text_locales" l
    WHERE l."_parent_id" = "pages_blocks_rich_text"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_feature_cards_cards" SET "judul" = l."judul", "subjudul" = l."subjudul"
    FROM "pages_blocks_feature_cards_cards_locales" l
    WHERE l."_parent_id" = "pages_blocks_feature_cards_cards"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_feature_cards" SET "heading" = l."heading", "gambar_samping_judul" = l."gambar_samping_judul", "gambar_samping_judul_sorot" = l."gambar_samping_judul_sorot"
    FROM "pages_blocks_feature_cards_locales" l
    WHERE l."_parent_id" = "pages_blocks_feature_cards"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_value_cards_cards" SET "title" = l."title", "body" = l."body"
    FROM "pages_blocks_value_cards_cards_locales" l
    WHERE l."_parent_id" = "pages_blocks_value_cards_cards"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_callout" SET "judul" = l."judul", "isi" = l."isi"
    FROM "pages_blocks_callout_locales" l
    WHERE l."_parent_id" = "pages_blocks_callout"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_cta_banner" SET "title" = l."title", "body" = l."body"
    FROM "pages_blocks_cta_banner_locales" l
    WHERE l."_parent_id" = "pages_blocks_cta_banner"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_timeline" SET "heading" = l."heading"
    FROM "pages_blocks_timeline_locales" l
    WHERE l."_parent_id" = "pages_blocks_timeline"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_stat_counter" SET "heading" = l."heading"
    FROM "pages_blocks_stat_counter_locales" l
    WHERE l."_parent_id" = "pages_blocks_stat_counter"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_latest_news" SET "heading" = l."heading"
    FROM "pages_blocks_latest_news_locales" l
    WHERE l."_parent_id" = "pages_blocks_latest_news"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_team_grid" SET "heading" = l."heading"
    FROM "pages_blocks_team_grid_locales" l
    WHERE l."_parent_id" = "pages_blocks_team_grid"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_partner_logos" SET "heading" = l."heading"
    FROM "pages_blocks_partner_logos_locales" l
    WHERE l."_parent_id" = "pages_blocks_partner_logos"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_video_grid" SET "heading" = l."heading"
    FROM "pages_blocks_video_grid_locales" l
    WHERE l."_parent_id" = "pages_blocks_video_grid"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_training_modules" SET "heading" = l."heading"
    FROM "pages_blocks_training_modules_locales" l
    WHERE l."_parent_id" = "pages_blocks_training_modules"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_gallery" SET "heading" = l."heading"
    FROM "pages_blocks_gallery_locales" l
    WHERE l."_parent_id" = "pages_blocks_gallery"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_testimonials" SET "heading" = l."heading"
    FROM "pages_blocks_testimonials_locales" l
    WHERE l."_parent_id" = "pages_blocks_testimonials"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_indonesia_map" SET "heading" = l."heading"
    FROM "pages_blocks_indonesia_map_locales" l
    WHERE l."_parent_id" = "pages_blocks_indonesia_map"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_idea_cards" SET "heading" = l."heading"
    FROM "pages_blocks_idea_cards_locales" l
    WHERE l."_parent_id" = "pages_blocks_idea_cards"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_contact_form" SET "heading" = l."heading"
    FROM "pages_blocks_contact_form_locales" l
    WHERE l."_parent_id" = "pages_blocks_contact_form"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_donation_tiers" SET "judul" = l."judul", "judul_sorot" = l."judul_sorot", "isi" = l."isi"
    FROM "pages_blocks_donation_tiers_locales" l
    WHERE l."_parent_id" = "pages_blocks_donation_tiers"."id" AND l."_locale" = 'id';
  UPDATE "pages_blocks_donation_campaigns" SET "heading" = l."heading"
    FROM "pages_blocks_donation_campaigns_locales" l
    WHERE l."_parent_id" = "pages_blocks_donation_campaigns"."id" AND l."_locale" = 'id';
  UPDATE "pages" SET "title" = l."title", "meta_title" = l."meta_title", "meta_description" = l."meta_description", "meta_image_id" = l."meta_image_id"
    FROM "pages_locales" l
    WHERE l."_parent_id" = "pages"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_hero_slides" SET "title" = l."title", "highlight" = l."highlight", "description" = l."description"
    FROM "_pages_v_blocks_hero_slides_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_hero_slides"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_page_hero" SET "title" = l."title", "description" = l."description"
    FROM "_pages_v_blocks_page_hero_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_page_hero"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_rich_text" SET "heading" = l."heading"
    FROM "_pages_v_blocks_rich_text_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_rich_text"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_feature_cards_cards" SET "judul" = l."judul", "subjudul" = l."subjudul"
    FROM "_pages_v_blocks_feature_cards_cards_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_feature_cards_cards"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_feature_cards" SET "heading" = l."heading", "gambar_samping_judul" = l."gambar_samping_judul", "gambar_samping_judul_sorot" = l."gambar_samping_judul_sorot"
    FROM "_pages_v_blocks_feature_cards_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_feature_cards"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_value_cards_cards" SET "title" = l."title", "body" = l."body"
    FROM "_pages_v_blocks_value_cards_cards_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_value_cards_cards"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_callout" SET "judul" = l."judul", "isi" = l."isi"
    FROM "_pages_v_blocks_callout_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_callout"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_cta_banner" SET "title" = l."title", "body" = l."body"
    FROM "_pages_v_blocks_cta_banner_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_cta_banner"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_timeline" SET "heading" = l."heading"
    FROM "_pages_v_blocks_timeline_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_timeline"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_stat_counter" SET "heading" = l."heading"
    FROM "_pages_v_blocks_stat_counter_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_stat_counter"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_latest_news" SET "heading" = l."heading"
    FROM "_pages_v_blocks_latest_news_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_latest_news"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_team_grid" SET "heading" = l."heading"
    FROM "_pages_v_blocks_team_grid_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_team_grid"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_partner_logos" SET "heading" = l."heading"
    FROM "_pages_v_blocks_partner_logos_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_partner_logos"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_video_grid" SET "heading" = l."heading"
    FROM "_pages_v_blocks_video_grid_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_video_grid"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_training_modules" SET "heading" = l."heading"
    FROM "_pages_v_blocks_training_modules_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_training_modules"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_gallery" SET "heading" = l."heading"
    FROM "_pages_v_blocks_gallery_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_gallery"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_testimonials" SET "heading" = l."heading"
    FROM "_pages_v_blocks_testimonials_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_testimonials"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_indonesia_map" SET "heading" = l."heading"
    FROM "_pages_v_blocks_indonesia_map_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_indonesia_map"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_idea_cards" SET "heading" = l."heading"
    FROM "_pages_v_blocks_idea_cards_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_idea_cards"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_contact_form" SET "heading" = l."heading"
    FROM "_pages_v_blocks_contact_form_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_contact_form"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_donation_tiers" SET "judul" = l."judul", "judul_sorot" = l."judul_sorot", "isi" = l."isi"
    FROM "_pages_v_blocks_donation_tiers_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_donation_tiers"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v_blocks_donation_campaigns" SET "heading" = l."heading"
    FROM "_pages_v_blocks_donation_campaigns_locales" l
    WHERE l."_parent_id" = "_pages_v_blocks_donation_campaigns"."id" AND l."_locale" = 'id';
  UPDATE "_pages_v" SET "version_title" = l."version_title", "version_meta_title" = l."version_meta_title", "version_meta_description" = l."version_meta_description", "version_meta_image_id" = l."version_meta_image_id"
    FROM "_pages_v_locales" l
    WHERE l."_parent_id" = "_pages_v"."id" AND l."_locale" = 'id';
  UPDATE "articles" SET "title" = l."title", "meta_title" = l."meta_title", "meta_description" = l."meta_description", "meta_image_id" = l."meta_image_id"
    FROM "articles_locales" l
    WHERE l."_parent_id" = "articles"."id" AND l."_locale" = 'id';
  UPDATE "_articles_v" SET "version_title" = l."version_title", "version_meta_title" = l."version_meta_title", "version_meta_description" = l."version_meta_description", "version_meta_image_id" = l."version_meta_image_id"
    FROM "_articles_v_locales" l
    WHERE l."_parent_id" = "_articles_v"."id" AND l."_locale" = 'id';`)

  // 3. Baru buang tabel *_locales beserta sisa perubahan skema.
  //    CATATAN: terjemahan Inggris memang hilang di sini — itu konsekuensi
  //    rollback, bukan kecelakaan.
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_slides_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_page_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_cards_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_value_cards_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_callout_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stat_counter_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_latest_news_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_partner_logos_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_training_modules_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_indonesia_map_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_idea_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_form_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_donation_tiers_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_donation_campaigns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_slides_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_value_cards_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_callout_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stat_counter_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_latest_news_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_team_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_partner_logos_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_video_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_training_modules_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gallery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_indonesia_map_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_idea_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contact_form_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_donation_tiers_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_donation_campaigns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_slides_locales" CASCADE;
  DROP TABLE "pages_blocks_page_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_rich_text_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_cards_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_value_cards_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_callout_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "pages_blocks_timeline_locales" CASCADE;
  DROP TABLE "pages_blocks_stat_counter_locales" CASCADE;
  DROP TABLE "pages_blocks_latest_news_locales" CASCADE;
  DROP TABLE "pages_blocks_team_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_partner_logos_locales" CASCADE;
  DROP TABLE "pages_blocks_video_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_training_modules_locales" CASCADE;
  DROP TABLE "pages_blocks_gallery_locales" CASCADE;
  DROP TABLE "pages_blocks_testimonials_locales" CASCADE;
  DROP TABLE "pages_blocks_indonesia_map_locales" CASCADE;
  DROP TABLE "pages_blocks_idea_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_contact_form_locales" CASCADE;
  DROP TABLE "pages_blocks_donation_tiers_locales" CASCADE;
  DROP TABLE "pages_blocks_donation_campaigns_locales" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slides_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_cards_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_value_cards_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_callout_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stat_counter_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_latest_news_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_team_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_logos_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_video_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_training_modules_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_indonesia_map_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_idea_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_donation_tiers_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_donation_campaigns_locales" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP INDEX "_pages_v_snapshot_idx";
  DROP INDEX "_pages_v_published_locale_idx";
  DROP INDEX "_articles_v_snapshot_idx";
  DROP INDEX "_articles_v_published_locale_idx";
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles" USING btree ("meta_image_id");
  CREATE INDEX "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v" USING btree ("version_meta_image_id");
  ALTER TABLE "_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_pages_v" DROP COLUMN "published_locale";
  ALTER TABLE "_articles_v" DROP COLUMN "snapshot";
  ALTER TABLE "_articles_v" DROP COLUMN "published_locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum__articles_v_published_locale";`)
}
