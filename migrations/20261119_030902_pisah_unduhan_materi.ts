import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Data gated-download Library pindah dari `leads` ke koleksi baru
 * `unduhan_materi`.
 *
 * Sengaja TIDAK membuang kolom `leads.jenis/asal_instansi/produk_ref_id` dan
 * tidak memasang `email NOT NULL` (keluaran mentah drizzle melakukan keduanya):
 * produksi masih menjalankan kode lama sampai deploy berikutnya, dan kode lama
 * menulis ke kolom-kolom itu, termasuk baris unduhan tanpa email. Pembersihan
 * kolom lama (plus memindahkan baris unduhan yang sempat masuk lewat kode lama
 * di sela migrasi & deploy) dikerjakan migrasi terpisah sesudah deploy.
 * Kolom yang tertinggal tidak mengganggu Payload karena `push: false`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_unduhan_materi_locale" AS ENUM('id', 'en');
  CREATE TABLE "unduhan_materi" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"asal_instansi" varchar NOT NULL,
  	"produk_ref_id" integer,
  	"kontak" varchar,
  	"locale" "enum_unduhan_materi_locale",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "unduhan_materi_id" integer;
  ALTER TABLE "unduhan_materi" ADD CONSTRAINT "unduhan_materi_produk_ref_id_produk_id_fk" FOREIGN KEY ("produk_ref_id") REFERENCES "public"."produk"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "unduhan_materi_produk_ref_idx" ON "unduhan_materi" USING btree ("produk_ref_id");
  CREATE INDEX "unduhan_materi_updated_at_idx" ON "unduhan_materi" USING btree ("updated_at");
  CREATE INDEX "unduhan_materi_created_at_idx" ON "unduhan_materi" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_unduhan_materi_fk" FOREIGN KEY ("unduhan_materi_id") REFERENCES "public"."unduhan_materi"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_unduhan_materi_id_idx" ON "payload_locked_documents_rels" USING btree ("unduhan_materi_id");`)

  // Pindahkan data: email ATAU telepon jadi satu kolom `kontak` (kode lama
  // menebak dari satu isian yang sama, jadi tidak pernah dua-duanya terisi).
  await db.execute(sql`
  INSERT INTO "unduhan_materi" ("nama", "asal_instansi", "produk_ref_id", "kontak", "locale", "created_at", "updated_at")
  SELECT "name", COALESCE("asal_instansi", ''), "produk_ref_id", COALESCE("email", "phone"),
         "locale"::text::"enum_unduhan_materi_locale", "created_at", "updated_at"
  FROM "leads" WHERE "jenis" = 'unduhan-materi'
  ORDER BY "id";
  DELETE FROM "leads" WHERE "jenis" = 'unduhan-materi';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Kembalikan dulu datanya ke `leads`, baru tabel barunya dibuang.
  await db.execute(sql`
  INSERT INTO "leads" ("jenis", "name", "email", "phone", "asal_instansi", "produk_ref_id", "locale", "subject", "created_at", "updated_at")
  SELECT 'unduhan-materi', u."nama",
         CASE WHEN u."kontak" LIKE '%@%' THEN u."kontak" END,
         CASE WHEN u."kontak" NOT LIKE '%@%' THEN u."kontak" END,
         u."asal_instansi", u."produk_ref_id", u."locale"::text::"enum_leads_locale",
         'Unduhan materi: ' || COALESCE(pl."judul", ''), u."created_at", u."updated_at"
  FROM "unduhan_materi" u
  LEFT JOIN "produk_locales" pl ON pl."_parent_id" = u."produk_ref_id" AND pl."_locale" = 'id'
  ORDER BY u."id";`)

  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_unduhan_materi_fk";
  DROP INDEX "payload_locked_documents_rels_unduhan_materi_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "unduhan_materi_id";
  DROP TABLE "unduhan_materi" CASCADE;
  DROP TYPE "public"."enum_unduhan_materi_locale";`)
}
