import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // `slug` ditambah nullable dulu lalu di-backfill dari `judul` (locale "id")
  // sebelum di-NOT NULL-kan — tabel ini sudah berisi dokumen (Repositori Mesin
  // Virtual Numerasi), jadi ALTER ... NOT NULL langsung tanpa backfill gagal.
  await db.execute(sql`
   ALTER TABLE "media_interaktif" ADD COLUMN "slug" varchar;
  ALTER TABLE "media_interaktif" ADD COLUMN "konten_html" varchar;
  UPDATE "media_interaktif" m
  SET "slug" = lower(regexp_replace(regexp_replace(trim(l.judul), '[^a-zA-Z0-9\\s-]', '', 'g'), '\\s+', '-', 'g'))
  FROM "media_interaktif_locales" l
  WHERE l."_parent_id" = m."id" AND l."_locale" = 'id' AND m."slug" IS NULL;
  ALTER TABLE "media_interaktif" ALTER COLUMN "slug" SET NOT NULL;
  CREATE UNIQUE INDEX "media_interaktif_slug_idx" ON "media_interaktif" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_interaktif_slug_idx";
  ALTER TABLE "media_interaktif" DROP COLUMN "slug";
  ALTER TABLE "media_interaktif" DROP COLUMN "konten_html";`)
}
