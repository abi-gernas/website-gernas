import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_mitra_kelompok" AS ENUM('pemerintah', 'korporasi', 'pendidikan');
  CREATE TYPE "public"."enum_modul_pelatihan_program" AS ENUM('matematika', 'membaca');
  CREATE TABLE "penggerak_peran" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL
  );
  
  CREATE TABLE "penggerak" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"foto_id" integer,
  	"urutan" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mitra" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"kelompok" "enum_mitra_kelompok" DEFAULT 'pemerintah' NOT NULL,
  	"tampil_di_beranda" boolean DEFAULT false,
  	"urutan" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "video" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"judul" varchar NOT NULL,
  	"thumbnail_id" integer NOT NULL,
  	"tautan" varchar,
  	"urutan" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "modul_pelatihan_tujuan" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"teks" varchar NOT NULL
  );
  
  CREATE TABLE "modul_pelatihan" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"judul" varchar NOT NULL,
  	"program" "enum_modul_pelatihan_program" DEFAULT 'matematika' NOT NULL,
  	"nomor" numeric DEFAULT 1 NOT NULL,
  	"urutan" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "penggerak_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "mitra_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "video_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "modul_pelatihan_id" integer;
  ALTER TABLE "penggerak_peran" ADD CONSTRAINT "penggerak_peran_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."penggerak"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "penggerak" ADD CONSTRAINT "penggerak_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mitra" ADD CONSTRAINT "mitra_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "video" ADD CONSTRAINT "video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "modul_pelatihan_tujuan" ADD CONSTRAINT "modul_pelatihan_tujuan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."modul_pelatihan"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "penggerak_peran_order_idx" ON "penggerak_peran" USING btree ("_order");
  CREATE INDEX "penggerak_peran_parent_id_idx" ON "penggerak_peran" USING btree ("_parent_id");
  CREATE INDEX "penggerak_foto_idx" ON "penggerak" USING btree ("foto_id");
  CREATE INDEX "penggerak_updated_at_idx" ON "penggerak" USING btree ("updated_at");
  CREATE INDEX "penggerak_created_at_idx" ON "penggerak" USING btree ("created_at");
  CREATE INDEX "mitra_logo_idx" ON "mitra" USING btree ("logo_id");
  CREATE INDEX "mitra_updated_at_idx" ON "mitra" USING btree ("updated_at");
  CREATE INDEX "mitra_created_at_idx" ON "mitra" USING btree ("created_at");
  CREATE INDEX "video_thumbnail_idx" ON "video" USING btree ("thumbnail_id");
  CREATE INDEX "video_updated_at_idx" ON "video" USING btree ("updated_at");
  CREATE INDEX "video_created_at_idx" ON "video" USING btree ("created_at");
  CREATE INDEX "modul_pelatihan_tujuan_order_idx" ON "modul_pelatihan_tujuan" USING btree ("_order");
  CREATE INDEX "modul_pelatihan_tujuan_parent_id_idx" ON "modul_pelatihan_tujuan" USING btree ("_parent_id");
  CREATE INDEX "modul_pelatihan_updated_at_idx" ON "modul_pelatihan" USING btree ("updated_at");
  CREATE INDEX "modul_pelatihan_created_at_idx" ON "modul_pelatihan" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_penggerak_fk" FOREIGN KEY ("penggerak_id") REFERENCES "public"."penggerak"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mitra_fk" FOREIGN KEY ("mitra_id") REFERENCES "public"."mitra"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_video_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_modul_pelatihan_fk" FOREIGN KEY ("modul_pelatihan_id") REFERENCES "public"."modul_pelatihan"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_penggerak_id_idx" ON "payload_locked_documents_rels" USING btree ("penggerak_id");
  CREATE INDEX "payload_locked_documents_rels_mitra_id_idx" ON "payload_locked_documents_rels" USING btree ("mitra_id");
  CREATE INDEX "payload_locked_documents_rels_video_id_idx" ON "payload_locked_documents_rels" USING btree ("video_id");
  CREATE INDEX "payload_locked_documents_rels_modul_pelatihan_id_idx" ON "payload_locked_documents_rels" USING btree ("modul_pelatihan_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "penggerak_peran" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "penggerak" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mitra" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "modul_pelatihan_tujuan" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "modul_pelatihan" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "penggerak_peran" CASCADE;
  DROP TABLE "penggerak" CASCADE;
  DROP TABLE "mitra" CASCADE;
  DROP TABLE "video" CASCADE;
  DROP TABLE "modul_pelatihan_tujuan" CASCADE;
  DROP TABLE "modul_pelatihan" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_penggerak_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_mitra_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_video_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_modul_pelatihan_fk";
  
  DROP INDEX "payload_locked_documents_rels_penggerak_id_idx";
  DROP INDEX "payload_locked_documents_rels_mitra_id_idx";
  DROP INDEX "payload_locked_documents_rels_video_id_idx";
  DROP INDEX "payload_locked_documents_rels_modul_pelatihan_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "penggerak_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "mitra_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "video_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "modul_pelatihan_id";
  DROP TYPE "public"."enum_mitra_kelompok";
  DROP TYPE "public"."enum_modul_pelatihan_program";`)
}
