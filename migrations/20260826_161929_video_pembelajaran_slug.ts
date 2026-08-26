import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Tambah `slug` (untuk route detail `/video-pembelajaran/[slug]`) & `deskripsi`
 * ke koleksi Video Pembelajaran.
 *
 * Kolom `slug` di skema Payload `required: true, unique: true`, tapi tabelnya
 * sudah berisi data, jadi tidak bisa langsung `ADD COLUMN ... NOT NULL` seperti
 * hasil `migrate:create` mentahnya. Urutannya dipecah: tambah kolom nullable →
 * isi dari `judul` locale `id` (aturan slugify sama dengan
 * `src/payload/fields/slug.ts`) → tambal yang kosong/kembar dengan id → baru
 * pasang NOT NULL + indeks unik.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "video_pembelajaran" ADD COLUMN "slug" varchar;
  ALTER TABLE "video_pembelajaran_locales" ADD COLUMN "deskripsi" varchar;`)

  // Isi dari judul bahasa Indonesia (locale utama).
  await db.execute(sql`
   UPDATE "video_pembelajaran" AS v
  SET "slug" = trim(both '-' from regexp_replace(
    regexp_replace(
      regexp_replace(lower(trim(l."judul")), '[^a-z0-9_\\s-]', '', 'g'),
      '[\\s_]+', '-', 'g'),
    '-+', '-', 'g'))
  FROM "video_pembelajaran_locales" AS l
  WHERE l."_parent_id" = v."id" AND l."_locale" = 'id';`)

  // Baris tanpa judul id, atau yang slug-nya bentrok: bedakan dengan id-nya.
  await db.execute(sql`
   UPDATE "video_pembelajaran"
  SET "slug" = 'video-' || "id"
  WHERE "slug" IS NULL OR "slug" = '';

  UPDATE "video_pembelajaran" AS v
  SET "slug" = v."slug" || '-' || v."id"
  WHERE EXISTS (
    SELECT 1 FROM "video_pembelajaran" AS lain
    WHERE lain."slug" = v."slug" AND lain."id" < v."id"
  );`)

  await db.execute(sql`
   ALTER TABLE "video_pembelajaran" ALTER COLUMN "slug" SET NOT NULL;
  CREATE UNIQUE INDEX "video_pembelajaran_slug_idx" ON "video_pembelajaran" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "video_pembelajaran_slug_idx";
  ALTER TABLE "video_pembelajaran" DROP COLUMN "slug";
  ALTER TABLE "video_pembelajaran_locales" DROP COLUMN "deskripsi";`)
}
