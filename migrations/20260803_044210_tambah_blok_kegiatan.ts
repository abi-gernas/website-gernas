import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_activity_cards_kartu_ikon" AS ENUM('diskusi', 'komunitas', 'rumah', 'riset', 'ide', 'buku', 'penghargaan', 'daun');
  CREATE TYPE "public"."enum_pages_blocks_activity_cards_kolom" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_activity_cards_kartu_ikon" AS ENUM('diskusi', 'komunitas', 'rumah', 'riset', 'ide', 'buku', 'penghargaan', 'daun');
  CREATE TYPE "public"."enum__pages_v_blocks_activity_cards_kolom" AS ENUM('2', '3', '4');
  CREATE TABLE "pages_blocks_activity_cards_kartu" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ikon" "enum_pages_blocks_activity_cards_kartu_ikon" DEFAULT 'diskusi'
  );
  
  CREATE TABLE "pages_blocks_activity_cards_kartu_locales" (
  	"judul" varchar,
  	"deskripsi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_activity_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kolom" "enum_pages_blocks_activity_cards_kolom" DEFAULT '4',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_activity_cards_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_activity_cards_kartu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ikon" "enum__pages_v_blocks_activity_cards_kartu_ikon" DEFAULT 'diskusi',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_activity_cards_kartu_locales" (
  	"judul" varchar,
  	"deskripsi" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_activity_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kolom" "enum__pages_v_blocks_activity_cards_kolom" DEFAULT '4',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_activity_cards_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_activity_cards_kartu" ADD CONSTRAINT "pages_blocks_activity_cards_kartu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_activity_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_activity_cards_kartu_locales" ADD CONSTRAINT "pages_blocks_activity_cards_kartu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_activity_cards_kartu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_activity_cards" ADD CONSTRAINT "pages_blocks_activity_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_activity_cards_locales" ADD CONSTRAINT "pages_blocks_activity_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_activity_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_activity_cards_kartu" ADD CONSTRAINT "_pages_v_blocks_activity_cards_kartu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_activity_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_activity_cards_kartu_locales" ADD CONSTRAINT "_pages_v_blocks_activity_cards_kartu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_activity_cards_kartu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_activity_cards" ADD CONSTRAINT "_pages_v_blocks_activity_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_activity_cards_locales" ADD CONSTRAINT "_pages_v_blocks_activity_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_activity_cards"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_activity_cards_kartu_order_idx" ON "pages_blocks_activity_cards_kartu" USING btree ("_order");
  CREATE INDEX "pages_blocks_activity_cards_kartu_parent_id_idx" ON "pages_blocks_activity_cards_kartu" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_activity_cards_kartu_locales_locale_parent_id_u" ON "pages_blocks_activity_cards_kartu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_activity_cards_order_idx" ON "pages_blocks_activity_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_activity_cards_parent_id_idx" ON "pages_blocks_activity_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_activity_cards_path_idx" ON "pages_blocks_activity_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_activity_cards_locales_locale_parent_id_unique" ON "pages_blocks_activity_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_activity_cards_kartu_order_idx" ON "_pages_v_blocks_activity_cards_kartu" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_activity_cards_kartu_parent_id_idx" ON "_pages_v_blocks_activity_cards_kartu" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_activity_cards_kartu_locales_locale_parent_i" ON "_pages_v_blocks_activity_cards_kartu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_activity_cards_order_idx" ON "_pages_v_blocks_activity_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_activity_cards_parent_id_idx" ON "_pages_v_blocks_activity_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_activity_cards_path_idx" ON "_pages_v_blocks_activity_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_activity_cards_locales_locale_parent_id_uniq" ON "_pages_v_blocks_activity_cards_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_activity_cards_kartu" CASCADE;
  DROP TABLE "pages_blocks_activity_cards_kartu_locales" CASCADE;
  DROP TABLE "pages_blocks_activity_cards" CASCADE;
  DROP TABLE "pages_blocks_activity_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_activity_cards_kartu" CASCADE;
  DROP TABLE "_pages_v_blocks_activity_cards_kartu_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_activity_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_activity_cards_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_activity_cards_kartu_ikon";
  DROP TYPE "public"."enum_pages_blocks_activity_cards_kolom";
  DROP TYPE "public"."enum__pages_v_blocks_activity_cards_kartu_ikon";
  DROP TYPE "public"."enum__pages_v_blocks_activity_cards_kolom";`)
}
