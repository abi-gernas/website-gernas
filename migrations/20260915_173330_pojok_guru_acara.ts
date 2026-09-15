import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_jadwal_acara_tampilan" AS ENUM('grid', 'geser');
  CREATE TYPE "public"."enum__pages_v_blocks_jadwal_acara_tampilan" AS ENUM('grid', 'geser');
  ALTER TABLE "pages_blocks_jadwal_acara" ADD COLUMN "tampilan" "enum_pages_blocks_jadwal_acara_tampilan" DEFAULT 'grid';
  ALTER TABLE "pages_blocks_jadwal_acara" ADD COLUMN "tautan_lihat_semua_href" varchar;
  ALTER TABLE "pages_blocks_jadwal_acara_locales" ADD COLUMN "deskripsi" varchar;
  ALTER TABLE "pages_blocks_jadwal_acara_locales" ADD COLUMN "tautan_lihat_semua_label" varchar;
  ALTER TABLE "_pages_v_blocks_jadwal_acara" ADD COLUMN "tampilan" "enum__pages_v_blocks_jadwal_acara_tampilan" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_jadwal_acara" ADD COLUMN "tautan_lihat_semua_href" varchar;
  ALTER TABLE "_pages_v_blocks_jadwal_acara_locales" ADD COLUMN "deskripsi" varchar;
  ALTER TABLE "_pages_v_blocks_jadwal_acara_locales" ADD COLUMN "tautan_lihat_semua_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_jadwal_acara" DROP COLUMN "tampilan";
  ALTER TABLE "pages_blocks_jadwal_acara" DROP COLUMN "tautan_lihat_semua_href";
  ALTER TABLE "pages_blocks_jadwal_acara_locales" DROP COLUMN "deskripsi";
  ALTER TABLE "pages_blocks_jadwal_acara_locales" DROP COLUMN "tautan_lihat_semua_label";
  ALTER TABLE "_pages_v_blocks_jadwal_acara" DROP COLUMN "tampilan";
  ALTER TABLE "_pages_v_blocks_jadwal_acara" DROP COLUMN "tautan_lihat_semua_href";
  ALTER TABLE "_pages_v_blocks_jadwal_acara_locales" DROP COLUMN "deskripsi";
  ALTER TABLE "_pages_v_blocks_jadwal_acara_locales" DROP COLUMN "tautan_lihat_semua_label";
  DROP TYPE "public"."enum_pages_blocks_jadwal_acara_tampilan";
  DROP TYPE "public"."enum__pages_v_blocks_jadwal_acara_tampilan";`)
}
