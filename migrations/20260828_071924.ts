import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_navigation_cta_button_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_navigation_cta_button_preset" AS ENUM('/', '/tentang-gernas-tastaka', '/galeri', '/mitra', '/donatur', '/tumbuh-bersama', '/belajar-bersama', '/publikasi', '__custom__');
  CREATE TABLE "navigation_locales" (
  	"cta_button_label" varchar DEFAULT 'Donasi',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "navigation" ADD COLUMN "cta_button_enabled" boolean DEFAULT true;
  ALTER TABLE "navigation" ADD COLUMN "cta_button_link_type" "enum_navigation_cta_button_link_type" DEFAULT 'custom';
  ALTER TABLE "navigation" ADD COLUMN "cta_button_page_id" integer;
  ALTER TABLE "navigation" ADD COLUMN "cta_button_preset" "enum_navigation_cta_button_preset" DEFAULT '/donatur';
  ALTER TABLE "navigation" ADD COLUMN "cta_button_custom" varchar;
  ALTER TABLE "navigation_locales" ADD CONSTRAINT "navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "navigation_locales_locale_parent_id_unique" ON "navigation_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "navigation" ADD CONSTRAINT "navigation_cta_button_page_id_pages_id_fk" FOREIGN KEY ("cta_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "navigation_cta_button_cta_button_page_idx" ON "navigation" USING btree ("cta_button_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "navigation_locales" CASCADE;
  ALTER TABLE "navigation" DROP CONSTRAINT "navigation_cta_button_page_id_pages_id_fk";
  
  DROP INDEX "navigation_cta_button_cta_button_page_idx";
  ALTER TABLE "navigation" DROP COLUMN "cta_button_enabled";
  ALTER TABLE "navigation" DROP COLUMN "cta_button_link_type";
  ALTER TABLE "navigation" DROP COLUMN "cta_button_page_id";
  ALTER TABLE "navigation" DROP COLUMN "cta_button_preset";
  ALTER TABLE "navigation" DROP COLUMN "cta_button_custom";
  DROP TYPE "public"."enum_navigation_cta_button_link_type";
  DROP TYPE "public"."enum_navigation_cta_button_preset";`)
}
