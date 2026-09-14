import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_acara_kategori" ADD VALUE 'klubBuku';
  ALTER TYPE "public"."enum_acara_kategori" ADD VALUE 'seminar';
  ALTER TABLE "acara" ADD COLUMN "lokasi" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "acara" ALTER COLUMN "kategori" SET DATA TYPE text;
  ALTER TABLE "acara" ALTER COLUMN "kategori" SET DEFAULT 'webinar'::text;
  DROP TYPE "public"."enum_acara_kategori";
  CREATE TYPE "public"."enum_acara_kategori" AS ENUM('webinar', 'pelatihan', 'workshop');
  ALTER TABLE "acara" ALTER COLUMN "kategori" SET DEFAULT 'webinar'::"public"."enum_acara_kategori";
  ALTER TABLE "acara" ALTER COLUMN "kategori" SET DATA TYPE "public"."enum_acara_kategori" USING "kategori"::"public"."enum_acara_kategori";
  ALTER TABLE "acara" DROP COLUMN "lokasi";`)
}
