import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_program_intensif_programs_warna" AS ENUM('putih', 'abu', 'navy', 'merah', 'kuning');
  CREATE TYPE "public"."enum__pages_v_blocks_program_intensif_programs_warna" AS ENUM('putih', 'abu', 'navy', 'merah', 'kuning');
  CREATE TABLE "pages_blocks_program_intensif_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gambar_id" integer,
  	"warna" "enum_pages_blocks_program_intensif_programs_warna" DEFAULT 'navy'
  );
  
  CREATE TABLE "pages_blocks_program_intensif_programs_locales" (
  	"judul" varchar,
  	"deskripsi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_program_intensif" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_program_intensif_locales" (
  	"heading" varchar DEFAULT 'Program Intensif',
  	"isi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_program_intensif_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gambar_id" integer,
  	"warna" "enum__pages_v_blocks_program_intensif_programs_warna" DEFAULT 'navy',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_program_intensif_programs_locales" (
  	"judul" varchar,
  	"deskripsi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_program_intensif" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_program_intensif_locales" (
  	"heading" varchar DEFAULT 'Program Intensif',
  	"isi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_program_intensif_programs" ADD CONSTRAINT "pages_blocks_program_intensif_programs_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_program_intensif_programs" ADD CONSTRAINT "pages_blocks_program_intensif_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_program_intensif"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_program_intensif_programs_locales" ADD CONSTRAINT "pages_blocks_program_intensif_programs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_program_intensif_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_program_intensif" ADD CONSTRAINT "pages_blocks_program_intensif_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_program_intensif_locales" ADD CONSTRAINT "pages_blocks_program_intensif_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_program_intensif"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_program_intensif_programs" ADD CONSTRAINT "_pages_v_blocks_program_intensif_programs_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_program_intensif_programs" ADD CONSTRAINT "_pages_v_blocks_program_intensif_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_program_intensif"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_program_intensif_programs_locales" ADD CONSTRAINT "_pages_v_blocks_program_intensif_programs_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_program_intensif_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_program_intensif" ADD CONSTRAINT "_pages_v_blocks_program_intensif_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_program_intensif_locales" ADD CONSTRAINT "_pages_v_blocks_program_intensif_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_program_intensif"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_program_intensif_programs_order_idx" ON "pages_blocks_program_intensif_programs" USING btree ("_order");
  CREATE INDEX "pages_blocks_program_intensif_programs_parent_id_idx" ON "pages_blocks_program_intensif_programs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_program_intensif_programs_gambar_idx" ON "pages_blocks_program_intensif_programs" USING btree ("gambar_id");
  CREATE UNIQUE INDEX "pages_blocks_program_intensif_programs_locales_locale_parent" ON "pages_blocks_program_intensif_programs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_program_intensif_order_idx" ON "pages_blocks_program_intensif" USING btree ("_order");
  CREATE INDEX "pages_blocks_program_intensif_parent_id_idx" ON "pages_blocks_program_intensif" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_program_intensif_path_idx" ON "pages_blocks_program_intensif" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_program_intensif_locales_locale_parent_id_uniqu" ON "pages_blocks_program_intensif_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_program_intensif_programs_order_idx" ON "_pages_v_blocks_program_intensif_programs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_program_intensif_programs_parent_id_idx" ON "_pages_v_blocks_program_intensif_programs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_program_intensif_programs_gambar_idx" ON "_pages_v_blocks_program_intensif_programs" USING btree ("gambar_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_program_intensif_programs_locales_locale_par" ON "_pages_v_blocks_program_intensif_programs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_program_intensif_order_idx" ON "_pages_v_blocks_program_intensif" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_program_intensif_parent_id_idx" ON "_pages_v_blocks_program_intensif" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_program_intensif_path_idx" ON "_pages_v_blocks_program_intensif" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_program_intensif_locales_locale_parent_id_un" ON "_pages_v_blocks_program_intensif_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_program_intensif_programs" CASCADE;
  DROP TABLE "pages_blocks_program_intensif_programs_locales" CASCADE;
  DROP TABLE "pages_blocks_program_intensif" CASCADE;
  DROP TABLE "pages_blocks_program_intensif_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_program_intensif_programs" CASCADE;
  DROP TABLE "_pages_v_blocks_program_intensif_programs_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_program_intensif" CASCADE;
  DROP TABLE "_pages_v_blocks_program_intensif_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_program_intensif_programs_warna";
  DROP TYPE "public"."enum__pages_v_blocks_program_intensif_programs_warna";`)
}
