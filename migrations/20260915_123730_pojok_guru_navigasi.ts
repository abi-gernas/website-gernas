import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_navigation_items_children_preset" ADD VALUE '/pojok-guru' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_children_preset" ADD VALUE '/buku-bahan-ajar-modul' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_children_preset" ADD VALUE '/alat-peraga' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_children_preset" ADD VALUE '/video-pembelajaran' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_children_preset" ADD VALUE '/media-interaktif' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_children_preset" ADD VALUE '/belajar-bersama#jadwal-acara' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_preset" ADD VALUE '/pojok-guru' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_preset" ADD VALUE '/buku-bahan-ajar-modul' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_preset" ADD VALUE '/alat-peraga' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_preset" ADD VALUE '/video-pembelajaran' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_preset" ADD VALUE '/media-interaktif' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_items_preset" ADD VALUE '/belajar-bersama#jadwal-acara' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_cta_button_preset" ADD VALUE '/pojok-guru' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_cta_button_preset" ADD VALUE '/buku-bahan-ajar-modul' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_cta_button_preset" ADD VALUE '/alat-peraga' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_cta_button_preset" ADD VALUE '/video-pembelajaran' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_cta_button_preset" ADD VALUE '/media-interaktif' BEFORE '__custom__';
  ALTER TYPE "public"."enum_navigation_cta_button_preset" ADD VALUE '/belajar-bersama#jadwal-acara' BEFORE '__custom__';
  ALTER TABLE "pages_blocks_jadwal_acara" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_jadwal_acara" ADD COLUMN "anchor" varchar;
  ALTER TABLE "navigation_items" ADD COLUMN "sorot" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation_items_children" ALTER COLUMN "preset" SET DATA TYPE text;
  ALTER TABLE "navigation_items_children" ALTER COLUMN "preset" SET DEFAULT '__custom__'::text;
  DROP TYPE "public"."enum_navigation_items_children_preset";
  CREATE TYPE "public"."enum_navigation_items_children_preset" AS ENUM('/', '/tentang-gernas-tastaka', '/galeri', '/mitra', '/donatur', '/tumbuh-bersama', '/belajar-bersama', '/publikasi', '__custom__');
  ALTER TABLE "navigation_items_children" ALTER COLUMN "preset" SET DEFAULT '__custom__'::"public"."enum_navigation_items_children_preset";
  ALTER TABLE "navigation_items_children" ALTER COLUMN "preset" SET DATA TYPE "public"."enum_navigation_items_children_preset" USING "preset"::"public"."enum_navigation_items_children_preset";
  ALTER TABLE "navigation_items" ALTER COLUMN "preset" SET DATA TYPE text;
  ALTER TABLE "navigation_items" ALTER COLUMN "preset" SET DEFAULT '__custom__'::text;
  DROP TYPE "public"."enum_navigation_items_preset";
  CREATE TYPE "public"."enum_navigation_items_preset" AS ENUM('/', '/tentang-gernas-tastaka', '/galeri', '/mitra', '/donatur', '/tumbuh-bersama', '/belajar-bersama', '/publikasi', '__custom__');
  ALTER TABLE "navigation_items" ALTER COLUMN "preset" SET DEFAULT '__custom__'::"public"."enum_navigation_items_preset";
  ALTER TABLE "navigation_items" ALTER COLUMN "preset" SET DATA TYPE "public"."enum_navigation_items_preset" USING "preset"::"public"."enum_navigation_items_preset";
  ALTER TABLE "navigation" ALTER COLUMN "cta_button_preset" SET DATA TYPE text;
  ALTER TABLE "navigation" ALTER COLUMN "cta_button_preset" SET DEFAULT '/donatur'::text;
  DROP TYPE "public"."enum_navigation_cta_button_preset";
  CREATE TYPE "public"."enum_navigation_cta_button_preset" AS ENUM('/', '/tentang-gernas-tastaka', '/galeri', '/mitra', '/donatur', '/tumbuh-bersama', '/belajar-bersama', '/publikasi', '__custom__');
  ALTER TABLE "navigation" ALTER COLUMN "cta_button_preset" SET DEFAULT '/donatur'::"public"."enum_navigation_cta_button_preset";
  ALTER TABLE "navigation" ALTER COLUMN "cta_button_preset" SET DATA TYPE "public"."enum_navigation_cta_button_preset" USING "cta_button_preset"::"public"."enum_navigation_cta_button_preset";
  ALTER TABLE "pages_blocks_jadwal_acara" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_jadwal_acara" DROP COLUMN "anchor";
  ALTER TABLE "navigation_items" DROP COLUMN "sorot";`)
}
