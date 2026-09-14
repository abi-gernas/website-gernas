import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_acara_kategori" AS ENUM('webinar', 'pelatihan', 'workshop');
  CREATE TYPE "public"."enum_acara_format" AS ENUM('online', 'offline', 'hybrid');
  CREATE TABLE "pages_blocks_jadwal_acara" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"batas_awal" numeric DEFAULT 6,
  	"sembunyikan_selesai" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_jadwal_acara_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_jadwal_acara" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"batas_awal" numeric DEFAULT 6,
  	"sembunyikan_selesai" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_jadwal_acara_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "acara" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kategori" "enum_acara_kategori" DEFAULT 'webinar' NOT NULL,
  	"poster_id" integer,
  	"tanggal" timestamp(3) with time zone NOT NULL,
  	"waktu" varchar,
  	"format" "enum_acara_format" DEFAULT 'online' NOT NULL,
  	"tautan_daftar" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "acara_locales" (
  	"judul" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "acara_id" integer;
  ALTER TABLE "pages_blocks_jadwal_acara" ADD CONSTRAINT "pages_blocks_jadwal_acara_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_jadwal_acara_locales" ADD CONSTRAINT "pages_blocks_jadwal_acara_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_jadwal_acara"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_jadwal_acara" ADD CONSTRAINT "_pages_v_blocks_jadwal_acara_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_jadwal_acara_locales" ADD CONSTRAINT "_pages_v_blocks_jadwal_acara_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_jadwal_acara"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acara" ADD CONSTRAINT "acara_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "acara_locales" ADD CONSTRAINT "acara_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."acara"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_jadwal_acara_order_idx" ON "pages_blocks_jadwal_acara" USING btree ("_order");
  CREATE INDEX "pages_blocks_jadwal_acara_parent_id_idx" ON "pages_blocks_jadwal_acara" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_jadwal_acara_path_idx" ON "pages_blocks_jadwal_acara" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_jadwal_acara_locales_locale_parent_id_unique" ON "pages_blocks_jadwal_acara_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_jadwal_acara_order_idx" ON "_pages_v_blocks_jadwal_acara" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_jadwal_acara_parent_id_idx" ON "_pages_v_blocks_jadwal_acara" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_jadwal_acara_path_idx" ON "_pages_v_blocks_jadwal_acara" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_jadwal_acara_locales_locale_parent_id_unique" ON "_pages_v_blocks_jadwal_acara_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "acara_poster_idx" ON "acara" USING btree ("poster_id");
  CREATE INDEX "acara_updated_at_idx" ON "acara" USING btree ("updated_at");
  CREATE INDEX "acara_created_at_idx" ON "acara" USING btree ("created_at");
  CREATE UNIQUE INDEX "acara_locales_locale_parent_id_unique" ON "acara_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_acara_fk" FOREIGN KEY ("acara_id") REFERENCES "public"."acara"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_acara_id_idx" ON "payload_locked_documents_rels" USING btree ("acara_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_jadwal_acara" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_jadwal_acara_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_jadwal_acara" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_jadwal_acara_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "acara" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "acara_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_jadwal_acara" CASCADE;
  DROP TABLE "pages_blocks_jadwal_acara_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_jadwal_acara" CASCADE;
  DROP TABLE "_pages_v_blocks_jadwal_acara_locales" CASCADE;
  DROP TABLE "acara" CASCADE;
  DROP TABLE "acara_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_acara_fk";
  
  DROP INDEX "payload_locked_documents_rels_acara_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "acara_id";
  DROP TYPE "public"."enum_acara_kategori";
  DROP TYPE "public"."enum_acara_format";`)
}
