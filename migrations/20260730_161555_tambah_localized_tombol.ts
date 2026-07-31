import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_value_cards_cards_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "pages_blocks_callout_tautan_tambahan_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "pages_blocks_donation_campaigns_items_locales" (
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "_pages_v_blocks_value_cards_cards_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  CREATE TABLE "_pages_v_blocks_callout_tautan_tambahan_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  CREATE TABLE "_pages_v_blocks_donation_campaigns_items_locales" (
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "pages_blocks_hero_slides_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_feature_cards_cards_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_value_cards_cards_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_callout_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_cta_banner_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_latest_news_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_partner_logos_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_training_modules_locales" ADD COLUMN "sidebar_cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero_slides_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_value_cards_cards_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_callout_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_latest_news_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_partner_logos_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_training_modules_locales" ADD COLUMN "sidebar_cta_label" varchar;
  ALTER TABLE "pages_blocks_value_cards_cards_links_locales" ADD CONSTRAINT "pages_blocks_value_cards_cards_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_cards_cards_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_callout_tautan_tambahan_locales" ADD CONSTRAINT "pages_blocks_callout_tautan_tambahan_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_callout_tautan_tambahan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donation_campaigns_items_locales" ADD CONSTRAINT "pages_blocks_donation_campaigns_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_donation_campaigns_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_cards_cards_links_locales" ADD CONSTRAINT "_pages_v_blocks_value_cards_cards_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_cards_cards_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_callout_tautan_tambahan_locales" ADD CONSTRAINT "_pages_v_blocks_callout_tautan_tambahan_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_callout_tautan_tambahan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donation_campaigns_items_locales" ADD CONSTRAINT "_pages_v_blocks_donation_campaigns_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_donation_campaigns_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_blocks_value_cards_cards_links_locales_locale_parent_i" ON "pages_blocks_value_cards_cards_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_callout_tautan_tambahan_locales_locale_parent_i" ON "pages_blocks_callout_tautan_tambahan_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_donation_campaigns_items_locales_locale_parent_" ON "pages_blocks_donation_campaigns_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_value_cards_cards_links_locales_locale_paren" ON "_pages_v_blocks_value_cards_cards_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_callout_tautan_tambahan_locales_locale_paren" ON "_pages_v_blocks_callout_tautan_tambahan_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_donation_campaigns_items_locales_locale_pare" ON "_pages_v_blocks_donation_campaigns_items_locales" USING btree ("_locale","_parent_id");`)

  /**
   * Pindahkan isi kolom lama ke tabel *_locales sebagai versi Indonesia
   * SEBELUM di-drop dari tabel utama. Sama seperti migrasi localization
   * sebelumnya: tabel *_locales grup (hero_slides, feature_cards_cards, dst)
   * sudah punya baris locale 'id' dari migrasi itu, jadi di sini pakai UPDATE.
   * Tabel array yang baru pertama kali dapat kolom localized (links,
   * tautan_tambahan, donation_campaigns_items) belum punya baris sama sekali,
   * jadi di situ pakai INSERT.
   */
  await db.execute(sql`
  INSERT INTO "pages_blocks_value_cards_cards_links_locales" ("_locale", "_parent_id", "label")
    SELECT 'id', "id", "label" FROM "pages_blocks_value_cards_cards_links";
  INSERT INTO "pages_blocks_callout_tautan_tambahan_locales" ("_locale", "_parent_id", "label")
    SELECT 'id', "id", "label" FROM "pages_blocks_callout_tautan_tambahan";
  INSERT INTO "pages_blocks_donation_campaigns_items_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "pages_blocks_donation_campaigns_items";
  INSERT INTO "_pages_v_blocks_value_cards_cards_links_locales" ("_locale", "_parent_id", "label")
    SELECT 'id', "id", "label" FROM "_pages_v_blocks_value_cards_cards_links";
  INSERT INTO "_pages_v_blocks_callout_tautan_tambahan_locales" ("_locale", "_parent_id", "label")
    SELECT 'id', "id", "label" FROM "_pages_v_blocks_callout_tautan_tambahan";
  INSERT INTO "_pages_v_blocks_donation_campaigns_items_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "_pages_v_blocks_donation_campaigns_items";

  INSERT INTO "pages_blocks_hero_slides_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "pages_blocks_hero_slides"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "pages_blocks_feature_cards_cards_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "pages_blocks_feature_cards_cards"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "pages_blocks_value_cards_cards_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "pages_blocks_value_cards_cards"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "pages_blocks_callout_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "pages_blocks_callout"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "pages_blocks_cta_banner_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "pages_blocks_cta_banner"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "pages_blocks_latest_news_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "pages_blocks_latest_news"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "pages_blocks_partner_logos_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "pages_blocks_partner_logos"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "pages_blocks_training_modules_locales" ("_locale", "_parent_id", "sidebar_cta_label")
    SELECT 'id', "id", "sidebar_cta_label" FROM "pages_blocks_training_modules"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "sidebar_cta_label" = excluded."sidebar_cta_label";
  INSERT INTO "_pages_v_blocks_hero_slides_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "_pages_v_blocks_hero_slides"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "_pages_v_blocks_feature_cards_cards_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "_pages_v_blocks_feature_cards_cards"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "_pages_v_blocks_value_cards_cards_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "_pages_v_blocks_value_cards_cards"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "_pages_v_blocks_callout_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "_pages_v_blocks_callout"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "_pages_v_blocks_cta_banner_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "_pages_v_blocks_cta_banner"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "_pages_v_blocks_latest_news_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "_pages_v_blocks_latest_news"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "_pages_v_blocks_partner_logos_locales" ("_locale", "_parent_id", "cta_label")
    SELECT 'id', "id", "cta_label" FROM "_pages_v_blocks_partner_logos"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "cta_label" = excluded."cta_label";
  INSERT INTO "_pages_v_blocks_training_modules_locales" ("_locale", "_parent_id", "sidebar_cta_label")
    SELECT 'id', "id", "sidebar_cta_label" FROM "_pages_v_blocks_training_modules"
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "sidebar_cta_label" = excluded."sidebar_cta_label";`)

  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_slides" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_feature_cards_cards" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_value_cards_cards_links" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_value_cards_cards" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_callout_tautan_tambahan" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_callout" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_cta_banner" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_latest_news" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_partner_logos" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_training_modules" DROP COLUMN "sidebar_cta_label";
  ALTER TABLE "pages_blocks_donation_campaigns_items" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_hero_slides" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_value_cards_cards_links" DROP COLUMN "label";
  ALTER TABLE "_pages_v_blocks_value_cards_cards" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_callout_tautan_tambahan" DROP COLUMN "label";
  ALTER TABLE "_pages_v_blocks_callout" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_cta_banner" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_latest_news" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_partner_logos" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_training_modules" DROP COLUMN "sidebar_cta_label";
  ALTER TABLE "_pages_v_blocks_donation_campaigns_items" DROP COLUMN "cta_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_slides" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_feature_cards_cards" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_value_cards_cards_links" ADD COLUMN "label" varchar;
  ALTER TABLE "pages_blocks_value_cards_cards" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_callout_tautan_tambahan" ADD COLUMN "label" varchar;
  ALTER TABLE "pages_blocks_callout" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_latest_news" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_partner_logos" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_training_modules" ADD COLUMN "sidebar_cta_label" varchar;
  ALTER TABLE "pages_blocks_donation_campaigns_items" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_value_cards_cards_links" ADD COLUMN "label" varchar;
  ALTER TABLE "_pages_v_blocks_value_cards_cards" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_callout_tautan_tambahan" ADD COLUMN "label" varchar;
  ALTER TABLE "_pages_v_blocks_callout" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_latest_news" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_partner_logos" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_training_modules" ADD COLUMN "sidebar_cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_donation_campaigns_items" ADD COLUMN "cta_label" varchar;`)

  /**
   * Kembalikan isi dari *_locales (versi 'id') ke kolom utama SEBELUM tabel
   * *_locales dan kolomnya di-drop, supaya rollback tidak menghapus teks.
   */
  await db.execute(sql`
  UPDATE "pages_blocks_hero_slides" AS main SET "cta_label" = loc."cta_label"
    FROM "pages_blocks_hero_slides_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "pages_blocks_feature_cards_cards" AS main SET "cta_label" = loc."cta_label"
    FROM "pages_blocks_feature_cards_cards_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "pages_blocks_value_cards_cards" AS main SET "cta_label" = loc."cta_label"
    FROM "pages_blocks_value_cards_cards_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "pages_blocks_callout" AS main SET "cta_label" = loc."cta_label"
    FROM "pages_blocks_callout_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "pages_blocks_cta_banner" AS main SET "cta_label" = loc."cta_label"
    FROM "pages_blocks_cta_banner_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "pages_blocks_latest_news" AS main SET "cta_label" = loc."cta_label"
    FROM "pages_blocks_latest_news_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "pages_blocks_partner_logos" AS main SET "cta_label" = loc."cta_label"
    FROM "pages_blocks_partner_logos_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "pages_blocks_training_modules" AS main SET "sidebar_cta_label" = loc."sidebar_cta_label"
    FROM "pages_blocks_training_modules_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_hero_slides" AS main SET "cta_label" = loc."cta_label"
    FROM "_pages_v_blocks_hero_slides_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_feature_cards_cards" AS main SET "cta_label" = loc."cta_label"
    FROM "_pages_v_blocks_feature_cards_cards_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_value_cards_cards" AS main SET "cta_label" = loc."cta_label"
    FROM "_pages_v_blocks_value_cards_cards_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_callout" AS main SET "cta_label" = loc."cta_label"
    FROM "_pages_v_blocks_callout_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_cta_banner" AS main SET "cta_label" = loc."cta_label"
    FROM "_pages_v_blocks_cta_banner_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_latest_news" AS main SET "cta_label" = loc."cta_label"
    FROM "_pages_v_blocks_latest_news_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_partner_logos" AS main SET "cta_label" = loc."cta_label"
    FROM "_pages_v_blocks_partner_logos_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_training_modules" AS main SET "sidebar_cta_label" = loc."sidebar_cta_label"
    FROM "_pages_v_blocks_training_modules_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';

  UPDATE "pages_blocks_value_cards_cards_links" AS main SET "label" = loc."label"
    FROM "pages_blocks_value_cards_cards_links_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "pages_blocks_callout_tautan_tambahan" AS main SET "label" = loc."label"
    FROM "pages_blocks_callout_tautan_tambahan_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "pages_blocks_donation_campaigns_items" AS main SET "cta_label" = loc."cta_label"
    FROM "pages_blocks_donation_campaigns_items_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_value_cards_cards_links" AS main SET "label" = loc."label"
    FROM "_pages_v_blocks_value_cards_cards_links_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_callout_tautan_tambahan" AS main SET "label" = loc."label"
    FROM "_pages_v_blocks_callout_tautan_tambahan_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';
  UPDATE "_pages_v_blocks_donation_campaigns_items" AS main SET "cta_label" = loc."cta_label"
    FROM "_pages_v_blocks_donation_campaigns_items_locales" AS loc WHERE loc."_parent_id" = main."id" AND loc."_locale" = 'id';`)

  await db.execute(sql`
  DROP TABLE "pages_blocks_value_cards_cards_links_locales" CASCADE;
  DROP TABLE "pages_blocks_callout_tautan_tambahan_locales" CASCADE;
  DROP TABLE "pages_blocks_donation_campaigns_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_value_cards_cards_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_callout_tautan_tambahan_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_donation_campaigns_items_locales" CASCADE;
  ALTER TABLE "pages_blocks_hero_slides_locales" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_feature_cards_cards_locales" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_value_cards_cards_locales" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_callout_locales" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_cta_banner_locales" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_latest_news_locales" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_partner_logos_locales" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_training_modules_locales" DROP COLUMN "sidebar_cta_label";
  ALTER TABLE "_pages_v_blocks_hero_slides_locales" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_feature_cards_cards_locales" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_value_cards_cards_locales" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_callout_locales" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_latest_news_locales" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_partner_logos_locales" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_training_modules_locales" DROP COLUMN "sidebar_cta_label";`)
}
