import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_topik_produk_ikon" AS ENUM('geometri', 'bilangan-cacah', 'pecahan', 'bilangan-bulat', 'statistika', 'pengukuran', 'buku', 'huruf', 'lampu', 'bintang');
  CREATE TYPE "public"."enum_topik_produk_warna" AS ENUM('biru', 'merah', 'kuning', 'langit');
  CREATE TABLE "kategori_produk" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"urutan" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "kategori_produk_locales" (
  	"nama" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "topik_produk" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"kategori_id" integer NOT NULL,
  	"ikon" "enum_topik_produk_ikon" DEFAULT 'bintang' NOT NULL,
  	"warna" "enum_topik_produk_warna" DEFAULT 'biru' NOT NULL,
  	"urutan" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "topik_produk_locales" (
  	"nama" varchar NOT NULL,
  	"deskripsi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "produk" ADD COLUMN "kategori_id" integer;
  ALTER TABLE "produk" ADD COLUMN "topik_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "kategori_produk_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "topik_produk_id" integer;
  ALTER TABLE "kategori_produk_locales" ADD CONSTRAINT "kategori_produk_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kategori_produk"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "topik_produk" ADD CONSTRAINT "topik_produk_kategori_id_kategori_produk_id_fk" FOREIGN KEY ("kategori_id") REFERENCES "public"."kategori_produk"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "topik_produk_locales" ADD CONSTRAINT "topik_produk_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."topik_produk"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "kategori_produk_slug_idx" ON "kategori_produk" USING btree ("slug");
  CREATE INDEX "kategori_produk_updated_at_idx" ON "kategori_produk" USING btree ("updated_at");
  CREATE INDEX "kategori_produk_created_at_idx" ON "kategori_produk" USING btree ("created_at");
  CREATE UNIQUE INDEX "kategori_produk_locales_locale_parent_id_unique" ON "kategori_produk_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "topik_produk_slug_idx" ON "topik_produk" USING btree ("slug");
  CREATE INDEX "topik_produk_kategori_idx" ON "topik_produk" USING btree ("kategori_id");
  CREATE INDEX "topik_produk_updated_at_idx" ON "topik_produk" USING btree ("updated_at");
  CREATE INDEX "topik_produk_created_at_idx" ON "topik_produk" USING btree ("created_at");
  CREATE UNIQUE INDEX "topik_produk_locales_locale_parent_id_unique" ON "topik_produk_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "produk" ADD CONSTRAINT "produk_kategori_id_kategori_produk_id_fk" FOREIGN KEY ("kategori_id") REFERENCES "public"."kategori_produk"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produk" ADD CONSTRAINT "produk_topik_id_topik_produk_id_fk" FOREIGN KEY ("topik_id") REFERENCES "public"."topik_produk"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kategori_produk_fk" FOREIGN KEY ("kategori_produk_id") REFERENCES "public"."kategori_produk"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_topik_produk_fk" FOREIGN KEY ("topik_produk_id") REFERENCES "public"."topik_produk"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "produk_kategori_idx" ON "produk" USING btree ("kategori_id");
  CREATE INDEX "produk_topik_idx" ON "produk" USING btree ("topik_id");
  CREATE INDEX "payload_locked_documents_rels_kategori_produk_id_idx" ON "payload_locked_documents_rels" USING btree ("kategori_produk_id");
  CREATE INDEX "payload_locked_documents_rels_topik_produk_id_idx" ON "payload_locked_documents_rels" USING btree ("topik_produk_id");
  -- Isi awal taksonomi: persis dua mapel dan enam topik yang sebelumnya tertulis di kode.
  INSERT INTO "kategori_produk" ("slug", "urutan") VALUES ('matematika', 10), ('membaca', 20);
  INSERT INTO "kategori_produk_locales" ("nama", "_locale", "_parent_id")
    SELECT v.nama, v.loc::"_locales", k.id
    FROM (VALUES
      ('matematika', 'id', 'Matematika'), ('matematika', 'en', 'Mathematics'),
      ('membaca', 'id', 'Membaca'), ('membaca', 'en', 'Reading')
    ) AS v(slug, loc, nama)
    JOIN "kategori_produk" k ON k.slug = v.slug;

  INSERT INTO "topik_produk" ("slug", "kategori_id", "ikon", "warna", "urutan")
    SELECT v.slug, k.id, v.ikon::"enum_topik_produk_ikon", v.warna::"enum_topik_produk_warna", v.urutan
    FROM (VALUES
      ('geometri', 'geometri', 'biru', 10),
      ('bilangan-cacah', 'bilangan-cacah', 'merah', 20),
      ('pecahan', 'pecahan', 'kuning', 30),
      ('bilangan-bulat', 'bilangan-bulat', 'langit', 40),
      ('statistika', 'statistika', 'biru', 50),
      ('pengukuran', 'pengukuran', 'merah', 60)
    ) AS v(slug, ikon, warna, urutan)
    JOIN "kategori_produk" k ON k.slug = 'matematika';
  INSERT INTO "topik_produk_locales" ("nama", "deskripsi", "_locale", "_parent_id")
    SELECT v.nama, v.deskripsi, v.loc::"_locales", t.id
    FROM (VALUES
      ('geometri', 'id', 'Geometri', 'Bangun datar, bangun ruang, dan sudut'),
      ('geometri', 'en', 'Geometry', 'Shapes, solids, and angles'),
      ('bilangan-cacah', 'id', 'Bilangan Cacah', 'Nilai tempat sampai perkalian & pembagian'),
      ('bilangan-cacah', 'en', 'Whole Numbers', 'Place value to multiplication & division'),
      ('pecahan', 'id', 'Pecahan', 'Pecahan senilai, desimal, dan persen'),
      ('pecahan', 'en', 'Fractions', 'Equivalent fractions, decimals, and percent'),
      ('bilangan-bulat', 'id', 'Bilangan Bulat', 'Bilangan negatif dan operasinya'),
      ('bilangan-bulat', 'en', 'Integers', 'Negative numbers and their operations'),
      ('statistika', 'id', 'Statistika', 'Penyajian data, mean, median, modus'),
      ('statistika', 'en', 'Statistics', 'Data displays, mean, median, mode'),
      ('pengukuran', 'id', 'Pengukuran', 'Keliling, luas, volume, dan waktu'),
      ('pengukuran', 'en', 'Measurement', 'Perimeter, area, volume, and time')
    ) AS v(slug, loc, nama, deskripsi)
    JOIN "topik_produk" t ON t.slug = v.slug;

  -- Pindahkan nilai lama ke relasi. Produk tanpa mapel dianggap Matematika (bawaan lama).
  UPDATE "produk" p SET "topik_id" = t.id FROM "topik_produk" t WHERE t.slug = p."topik"::text;
  UPDATE "produk" p SET "kategori_id" = (
    SELECT k.id FROM "kategori_produk" k
    WHERE k.slug = COALESCE(
      (SELECT m."value"::text FROM "produk_mapel" m WHERE m."parent_id" = p.id ORDER BY m."order" LIMIT 1),
      'matematika'
    )
  );
  ALTER TABLE "produk" ALTER COLUMN "kategori_id" SET NOT NULL;
  ALTER TABLE "produk" ALTER COLUMN "topik_id" SET NOT NULL;
  ALTER TABLE "produk_mapel" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "produk_mapel" CASCADE;
  ALTER TABLE "produk" DROP COLUMN "topik";
  DROP TYPE "public"."enum_produk_mapel";
  DROP TYPE "public"."enum_produk_topik";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_produk_mapel" AS ENUM('matematika', 'membaca');
  CREATE TYPE "public"."enum_produk_topik" AS ENUM('geometri', 'bilangan-cacah', 'pecahan', 'bilangan-bulat', 'statistika', 'pengukuran');
  CREATE TABLE "produk_mapel" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_produk_mapel",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "produk" ADD COLUMN "topik" "enum_produk_topik" DEFAULT 'geometri' NOT NULL;
  ALTER TABLE "produk_mapel" ADD CONSTRAINT "produk_mapel_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "produk_mapel_order_idx" ON "produk_mapel" USING btree ("order");
  CREATE INDEX "produk_mapel_parent_idx" ON "produk_mapel" USING btree ("parent_id");
  -- Kembalikan nilai lama dari relasi sebelum tabel taksonomi dibuang.
  UPDATE "produk" p SET "topik" = t.slug::"enum_produk_topik"
    FROM "topik_produk" t
    WHERE t.id = p."topik_id"
      AND t.slug IN ('geometri', 'bilangan-cacah', 'pecahan', 'bilangan-bulat', 'statistika', 'pengukuran');
  INSERT INTO "produk_mapel" ("order", "parent_id", "value")
    SELECT 1, p.id, k.slug::"enum_produk_mapel"
    FROM "produk" p JOIN "kategori_produk" k ON k.id = p."kategori_id"
    WHERE k.slug IN ('matematika', 'membaca');
  ALTER TABLE "kategori_produk" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kategori_produk_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "topik_produk" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "topik_produk_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "kategori_produk" CASCADE;
  DROP TABLE "kategori_produk_locales" CASCADE;
  DROP TABLE "topik_produk" CASCADE;
  DROP TABLE "topik_produk_locales" CASCADE;
  ALTER TABLE "produk" DROP CONSTRAINT IF EXISTS "produk_kategori_id_kategori_produk_id_fk";
  
  ALTER TABLE "produk" DROP CONSTRAINT IF EXISTS "produk_topik_id_topik_produk_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_kategori_produk_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_topik_produk_fk";
  
  DROP INDEX IF EXISTS "produk_kategori_idx";
  DROP INDEX IF EXISTS "produk_topik_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_kategori_produk_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_topik_produk_id_idx";
  ALTER TABLE "produk" DROP COLUMN "kategori_id";
  ALTER TABLE "produk" DROP COLUMN "topik_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "kategori_produk_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "topik_produk_id";
  DROP TYPE "public"."enum_topik_produk_ikon";
  DROP TYPE "public"."enum_topik_produk_warna";`)
}
