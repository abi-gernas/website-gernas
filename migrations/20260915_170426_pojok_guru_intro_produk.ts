import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_intro_dua_kolom" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_intro_dua_kolom_locales" (
  	"judul" varchar,
  	"ringkas" varchar,
  	"isi" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_produk_sorotan_alasan_poin" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_produk_sorotan_alasan_poin_locales" (
  	"teks" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_produk_sorotan" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"produk_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_produk_sorotan_locales" (
  	"heading" varchar,
  	"subjudul" varchar,
  	"alasan_judul" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_intro_dua_kolom" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_intro_dua_kolom_locales" (
  	"judul" varchar,
  	"ringkas" varchar,
  	"isi" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_produk_sorotan_alasan_poin" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_produk_sorotan_alasan_poin_locales" (
  	"teks" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_produk_sorotan" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"produk_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_produk_sorotan_locales" (
  	"heading" varchar,
  	"subjudul" varchar,
  	"alasan_judul" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_intro_dua_kolom" ADD CONSTRAINT "pages_blocks_intro_dua_kolom_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_intro_dua_kolom_locales" ADD CONSTRAINT "pages_blocks_intro_dua_kolom_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_intro_dua_kolom"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_produk_sorotan_alasan_poin" ADD CONSTRAINT "pages_blocks_produk_sorotan_alasan_poin_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_produk_sorotan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_produk_sorotan_alasan_poin_locales" ADD CONSTRAINT "pages_blocks_produk_sorotan_alasan_poin_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_produk_sorotan_alasan_poin"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_produk_sorotan" ADD CONSTRAINT "pages_blocks_produk_sorotan_produk_id_produk_id_fk" FOREIGN KEY ("produk_id") REFERENCES "public"."produk"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_produk_sorotan" ADD CONSTRAINT "pages_blocks_produk_sorotan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_produk_sorotan_locales" ADD CONSTRAINT "pages_blocks_produk_sorotan_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_produk_sorotan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_intro_dua_kolom" ADD CONSTRAINT "_pages_v_blocks_intro_dua_kolom_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_intro_dua_kolom_locales" ADD CONSTRAINT "_pages_v_blocks_intro_dua_kolom_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_intro_dua_kolom"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_produk_sorotan_alasan_poin" ADD CONSTRAINT "_pages_v_blocks_produk_sorotan_alasan_poin_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_produk_sorotan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_produk_sorotan_alasan_poin_locales" ADD CONSTRAINT "_pages_v_blocks_produk_sorotan_alasan_poin_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_produk_sorotan_alasan_poin"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_produk_sorotan" ADD CONSTRAINT "_pages_v_blocks_produk_sorotan_produk_id_produk_id_fk" FOREIGN KEY ("produk_id") REFERENCES "public"."produk"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_produk_sorotan" ADD CONSTRAINT "_pages_v_blocks_produk_sorotan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_produk_sorotan_locales" ADD CONSTRAINT "_pages_v_blocks_produk_sorotan_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_produk_sorotan"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_intro_dua_kolom_order_idx" ON "pages_blocks_intro_dua_kolom" USING btree ("_order");
  CREATE INDEX "pages_blocks_intro_dua_kolom_parent_id_idx" ON "pages_blocks_intro_dua_kolom" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_intro_dua_kolom_path_idx" ON "pages_blocks_intro_dua_kolom" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_intro_dua_kolom_locales_locale_parent_id_unique" ON "pages_blocks_intro_dua_kolom_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_produk_sorotan_alasan_poin_order_idx" ON "pages_blocks_produk_sorotan_alasan_poin" USING btree ("_order");
  CREATE INDEX "pages_blocks_produk_sorotan_alasan_poin_parent_id_idx" ON "pages_blocks_produk_sorotan_alasan_poin" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_produk_sorotan_alasan_poin_locales_locale_paren" ON "pages_blocks_produk_sorotan_alasan_poin_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_produk_sorotan_order_idx" ON "pages_blocks_produk_sorotan" USING btree ("_order");
  CREATE INDEX "pages_blocks_produk_sorotan_parent_id_idx" ON "pages_blocks_produk_sorotan" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_produk_sorotan_path_idx" ON "pages_blocks_produk_sorotan" USING btree ("_path");
  CREATE INDEX "pages_blocks_produk_sorotan_produk_idx" ON "pages_blocks_produk_sorotan" USING btree ("produk_id");
  CREATE UNIQUE INDEX "pages_blocks_produk_sorotan_locales_locale_parent_id_unique" ON "pages_blocks_produk_sorotan_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_intro_dua_kolom_order_idx" ON "_pages_v_blocks_intro_dua_kolom" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_intro_dua_kolom_parent_id_idx" ON "_pages_v_blocks_intro_dua_kolom" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_intro_dua_kolom_path_idx" ON "_pages_v_blocks_intro_dua_kolom" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_intro_dua_kolom_locales_locale_parent_id_uni" ON "_pages_v_blocks_intro_dua_kolom_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_produk_sorotan_alasan_poin_order_idx" ON "_pages_v_blocks_produk_sorotan_alasan_poin" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_produk_sorotan_alasan_poin_parent_id_idx" ON "_pages_v_blocks_produk_sorotan_alasan_poin" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_produk_sorotan_alasan_poin_locales_locale_pa" ON "_pages_v_blocks_produk_sorotan_alasan_poin_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_produk_sorotan_order_idx" ON "_pages_v_blocks_produk_sorotan" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_produk_sorotan_parent_id_idx" ON "_pages_v_blocks_produk_sorotan" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_produk_sorotan_path_idx" ON "_pages_v_blocks_produk_sorotan" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_produk_sorotan_produk_idx" ON "_pages_v_blocks_produk_sorotan" USING btree ("produk_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_produk_sorotan_locales_locale_parent_id_uniq" ON "_pages_v_blocks_produk_sorotan_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_intro_dua_kolom" CASCADE;
  DROP TABLE "pages_blocks_intro_dua_kolom_locales" CASCADE;
  DROP TABLE "pages_blocks_produk_sorotan_alasan_poin" CASCADE;
  DROP TABLE "pages_blocks_produk_sorotan_alasan_poin_locales" CASCADE;
  DROP TABLE "pages_blocks_produk_sorotan" CASCADE;
  DROP TABLE "pages_blocks_produk_sorotan_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_intro_dua_kolom" CASCADE;
  DROP TABLE "_pages_v_blocks_intro_dua_kolom_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_produk_sorotan_alasan_poin" CASCADE;
  DROP TABLE "_pages_v_blocks_produk_sorotan_alasan_poin_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_produk_sorotan" CASCADE;
  DROP TABLE "_pages_v_blocks_produk_sorotan_locales" CASCADE;`)
}
