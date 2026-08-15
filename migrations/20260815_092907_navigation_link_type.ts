import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_navigation_items_children_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_navigation_items_children_preset" AS ENUM('/', '/tentang-gernas-tastaka', '/galeri', '/mitra', '/donatur', '/tumbuh-bersama', '/belajar-bersama', '/publikasi', '__custom__');
  CREATE TYPE "public"."enum_navigation_items_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_navigation_items_preset" AS ENUM('/', '/tentang-gernas-tastaka', '/galeri', '/mitra', '/donatur', '/tumbuh-bersama', '/belajar-bersama', '/publikasi', '__custom__');
  ALTER TABLE "navigation_items_children" ALTER COLUMN "href" DROP NOT NULL;
  ALTER TABLE "navigation_items_children" ADD COLUMN "link_type" "enum_navigation_items_children_link_type" DEFAULT 'custom';
  ALTER TABLE "navigation_items_children" ADD COLUMN "page_id" integer;
  ALTER TABLE "navigation_items_children" ADD COLUMN "preset" "enum_navigation_items_children_preset" DEFAULT '__custom__';
  ALTER TABLE "navigation_items_children" ADD COLUMN "custom" varchar;
  ALTER TABLE "navigation_items" ADD COLUMN "link_type" "enum_navigation_items_link_type" DEFAULT 'custom';
  ALTER TABLE "navigation_items" ADD COLUMN "page_id" integer;
  ALTER TABLE "navigation_items" ADD COLUMN "preset" "enum_navigation_items_preset" DEFAULT '__custom__';
  ALTER TABLE "navigation_items" ADD COLUMN "custom" varchar;
  ALTER TABLE "navigation_items_children" ADD CONSTRAINT "navigation_items_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "navigation_items_children_page_idx" ON "navigation_items_children" USING btree ("page_id");
  CREATE INDEX "navigation_items_page_idx" ON "navigation_items" USING btree ("page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation_items_children" DROP CONSTRAINT "navigation_items_children_page_id_pages_id_fk";
  
  ALTER TABLE "navigation_items" DROP CONSTRAINT "navigation_items_page_id_pages_id_fk";
  
  DROP INDEX "navigation_items_children_page_idx";
  DROP INDEX "navigation_items_page_idx";
  ALTER TABLE "navigation_items_children" ALTER COLUMN "href" SET NOT NULL;
  ALTER TABLE "navigation_items_children" DROP COLUMN "link_type";
  ALTER TABLE "navigation_items_children" DROP COLUMN "page_id";
  ALTER TABLE "navigation_items_children" DROP COLUMN "preset";
  ALTER TABLE "navigation_items_children" DROP COLUMN "custom";
  ALTER TABLE "navigation_items" DROP COLUMN "link_type";
  ALTER TABLE "navigation_items" DROP COLUMN "page_id";
  ALTER TABLE "navigation_items" DROP COLUMN "preset";
  ALTER TABLE "navigation_items" DROP COLUMN "custom";
  DROP TYPE "public"."enum_navigation_items_children_link_type";
  DROP TYPE "public"."enum_navigation_items_children_preset";
  DROP TYPE "public"."enum_navigation_items_link_type";
  DROP TYPE "public"."enum_navigation_items_preset";`)
}
