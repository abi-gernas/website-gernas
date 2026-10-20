import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Detail acara: kolom `slug` (alamat `/acara/[slug]`) dan `deskripsi` (localized).
 *
 * Keluaran mentah drizzle menambah `slug` sebagai `NOT NULL` langsung, yang gagal
 * di tabel berisi acara lama. Di sini kolomnya dibuat nullable, diisi dari judul
 * Indonesia (aturan sama dengan `slugify` di `src/payload/fields/slug.ts`; bentrok
 * diberi akhiran -2, -3, …), baru dikunci NOT NULL + unik.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "acara" ADD COLUMN "slug" varchar;
  ALTER TABLE "acara_locales" ADD COLUMN "deskripsi" varchar;

  WITH dasar AS (
    SELECT
      a."id",
      COALESCE(
        NULLIF(
          trim(both '-' from regexp_replace(
            regexp_replace(
              regexp_replace(lower(trim(COALESCE(l."judul", ''))), '[^a-z0-9_\\s-]', '', 'g'),
              '[\\s_]+', '-', 'g'),
            '-+', '-', 'g')),
          ''),
        'acara-' || a."id"
      ) AS "dasar"
    FROM "acara" a
    LEFT JOIN "acara_locales" l ON l."_parent_id" = a."id" AND l."_locale" = 'id'
  ),
  urut AS (
    SELECT "id", "dasar", row_number() OVER (PARTITION BY "dasar" ORDER BY "id") AS "no" FROM dasar
  )
  UPDATE "acara" a
  SET "slug" = u."dasar" || CASE WHEN u."no" > 1 THEN '-' || u."no" ELSE '' END
  FROM urut u
  WHERE u."id" = a."id";

  ALTER TABLE "acara" ALTER COLUMN "slug" SET NOT NULL;
  CREATE UNIQUE INDEX "acara_slug_idx" ON "acara" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "acara_slug_idx";
  ALTER TABLE "acara" DROP COLUMN "slug";
  ALTER TABLE "acara_locales" DROP COLUMN "deskripsi";`)
}
