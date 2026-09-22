import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_katalog" ADD VALUE 'alatPeraga' BEFORE 'videoPembelajaran';
  ALTER TYPE "public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber" ADD VALUE 'alatPeraga' BEFORE 'videoPembelajaran';
  ALTER TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog" ADD VALUE 'alatPeraga' BEFORE 'videoPembelajaran';
  ALTER TYPE "public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber" ADD VALUE 'alatPeraga' BEFORE 'videoPembelajaran';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DEFAULT 'produk'::text;
  DROP TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_katalog";
  CREATE TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_katalog" AS ENUM('produk', 'videoPembelajaran', 'mediaInteraktif');
  ALTER TABLE "pages_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DEFAULT 'produk'::"public"."enum_pages_blocks_perangkat_guru_kartu_katalog";
  ALTER TABLE "pages_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DATA TYPE "public"."enum_pages_blocks_perangkat_guru_kartu_katalog" USING "katalog"::"public"."enum_pages_blocks_perangkat_guru_kartu_katalog";
  ALTER TABLE "pages_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DEFAULT 'produk'::text;
  DROP TYPE "public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber";
  CREATE TYPE "public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber" AS ENUM('produk', 'videoPembelajaran', 'mediaInteraktif', 'semua', 'manual');
  ALTER TABLE "pages_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DEFAULT 'produk'::"public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber";
  ALTER TABLE "pages_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DATA TYPE "public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber" USING "sumber"::"public"."enum_pages_blocks_perangkat_guru_panel_statistik_sumber";
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DEFAULT 'produk'::text;
  DROP TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog";
  CREATE TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog" AS ENUM('produk', 'videoPembelajaran', 'mediaInteraktif');
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DEFAULT 'produk'::"public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog";
  ALTER TABLE "_pages_v_blocks_perangkat_guru_kartu" ALTER COLUMN "katalog" SET DATA TYPE "public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog" USING "katalog"::"public"."enum__pages_v_blocks_perangkat_guru_kartu_katalog";
  ALTER TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DEFAULT 'produk'::text;
  DROP TYPE "public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber";
  CREATE TYPE "public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber" AS ENUM('produk', 'videoPembelajaran', 'mediaInteraktif', 'semua', 'manual');
  ALTER TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DEFAULT 'produk'::"public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber";
  ALTER TABLE "_pages_v_blocks_perangkat_guru_panel_statistik" ALTER COLUMN "sumber" SET DATA TYPE "public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber" USING "sumber"::"public"."enum__pages_v_blocks_perangkat_guru_panel_statistik_sumber";`)
}
