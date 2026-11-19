import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fase 2 dari `20261119_030902_pisah_unduhan_materi`: dijalankan sesudah kode
 * b92d2c8 aktif di produksi, jadi tidak ada lagi yang menulis ke kolom lama.
 *
 * Ditulis tangan (tanpa snapshot .json): snapshot fase 1 sudah menggambarkan
 * `leads` tanpa kolom-kolom ini, jadi `migrate:create` tidak akan
 * menghasilkannya.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Baris unduhan yang sempat masuk lewat kode lama di sela migrasi fase 1
  // dan deploy: pindahkan dulu, sama persis dengan fase 1.
  await db.execute(sql`
  INSERT INTO "unduhan_materi" ("nama", "asal_instansi", "produk_ref_id", "kontak", "locale", "created_at", "updated_at")
  SELECT "name", COALESCE("asal_instansi", ''), "produk_ref_id", COALESCE("email", "phone"),
         "locale"::text::"enum_unduhan_materi_locale", "created_at", "updated_at"
  FROM "leads" WHERE "jenis" = 'unduhan-materi'
  ORDER BY "id";
  DELETE FROM "leads" WHERE "jenis" = 'unduhan-materi';`)

  await db.execute(sql`
  ALTER TABLE "leads" DROP CONSTRAINT "leads_produk_ref_id_produk_id_fk";
  DROP INDEX "leads_produk_ref_idx";
  ALTER TABLE "leads" DROP COLUMN "jenis";
  ALTER TABLE "leads" DROP COLUMN "asal_instansi";
  ALTER TABLE "leads" DROP COLUMN "produk_ref_id";
  DROP TYPE "public"."enum_leads_jenis";
  ALTER TABLE "leads" ALTER COLUMN "email" SET NOT NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Cukup kembalikan kolomnya; data unduhan dikembalikan ke `leads` oleh
  // `down()` fase 1.
  await db.execute(sql`
  CREATE TYPE "public"."enum_leads_jenis" AS ENUM('kontak', 'unduhan-materi');
  ALTER TABLE "leads" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "leads" ADD COLUMN "jenis" "enum_leads_jenis" DEFAULT 'kontak' NOT NULL;
  ALTER TABLE "leads" ADD COLUMN "asal_instansi" varchar;
  ALTER TABLE "leads" ADD COLUMN "produk_ref_id" integer;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_produk_ref_id_produk_id_fk" FOREIGN KEY ("produk_ref_id") REFERENCES "public"."produk"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "leads_produk_ref_idx" ON "leads" USING btree ("produk_ref_id");`)
}
