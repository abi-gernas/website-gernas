import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_pencarian_cepat_tag_populer" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pencarian_cepat_tag_populer_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pencarian_cepat" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gambar_latar_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pencarian_cepat_locales" (
  	"judul" varchar,
  	"subjudul" varchar,
  	"placeholder" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_pencarian_cepat_tag_populer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pencarian_cepat_tag_populer_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_pencarian_cepat" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gambar_latar_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pencarian_cepat_locales" (
  	"judul" varchar,
  	"subjudul" varchar,
  	"placeholder" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_pencarian_cepat_tag_populer" ADD CONSTRAINT "pages_blocks_pencarian_cepat_tag_populer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pencarian_cepat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pencarian_cepat_tag_populer_locales" ADD CONSTRAINT "pages_blocks_pencarian_cepat_tag_populer_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pencarian_cepat_tag_populer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pencarian_cepat" ADD CONSTRAINT "pages_blocks_pencarian_cepat_gambar_latar_id_media_id_fk" FOREIGN KEY ("gambar_latar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_pencarian_cepat" ADD CONSTRAINT "pages_blocks_pencarian_cepat_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pencarian_cepat_locales" ADD CONSTRAINT "pages_blocks_pencarian_cepat_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pencarian_cepat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pencarian_cepat_tag_populer" ADD CONSTRAINT "_pages_v_blocks_pencarian_cepat_tag_populer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pencarian_cepat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pencarian_cepat_tag_populer_locales" ADD CONSTRAINT "_pages_v_blocks_pencarian_cepat_tag_populer_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pencarian_cepat_tag_populer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pencarian_cepat" ADD CONSTRAINT "_pages_v_blocks_pencarian_cepat_gambar_latar_id_media_id_fk" FOREIGN KEY ("gambar_latar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pencarian_cepat" ADD CONSTRAINT "_pages_v_blocks_pencarian_cepat_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pencarian_cepat_locales" ADD CONSTRAINT "_pages_v_blocks_pencarian_cepat_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pencarian_cepat"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_pencarian_cepat_tag_populer_order_idx" ON "pages_blocks_pencarian_cepat_tag_populer" USING btree ("_order");
  CREATE INDEX "pages_blocks_pencarian_cepat_tag_populer_parent_id_idx" ON "pages_blocks_pencarian_cepat_tag_populer" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_pencarian_cepat_tag_populer_locales_locale_pare" ON "pages_blocks_pencarian_cepat_tag_populer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_pencarian_cepat_order_idx" ON "pages_blocks_pencarian_cepat" USING btree ("_order");
  CREATE INDEX "pages_blocks_pencarian_cepat_parent_id_idx" ON "pages_blocks_pencarian_cepat" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pencarian_cepat_path_idx" ON "pages_blocks_pencarian_cepat" USING btree ("_path");
  CREATE INDEX "pages_blocks_pencarian_cepat_gambar_latar_idx" ON "pages_blocks_pencarian_cepat" USING btree ("gambar_latar_id");
  CREATE UNIQUE INDEX "pages_blocks_pencarian_cepat_locales_locale_parent_id_unique" ON "pages_blocks_pencarian_cepat_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_pencarian_cepat_tag_populer_order_idx" ON "_pages_v_blocks_pencarian_cepat_tag_populer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pencarian_cepat_tag_populer_parent_id_idx" ON "_pages_v_blocks_pencarian_cepat_tag_populer" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_pencarian_cepat_tag_populer_locales_locale_p" ON "_pages_v_blocks_pencarian_cepat_tag_populer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_pencarian_cepat_order_idx" ON "_pages_v_blocks_pencarian_cepat" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pencarian_cepat_parent_id_idx" ON "_pages_v_blocks_pencarian_cepat" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pencarian_cepat_path_idx" ON "_pages_v_blocks_pencarian_cepat" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pencarian_cepat_gambar_latar_idx" ON "_pages_v_blocks_pencarian_cepat" USING btree ("gambar_latar_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_pencarian_cepat_locales_locale_parent_id_uni" ON "_pages_v_blocks_pencarian_cepat_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_pencarian_cepat_tag_populer" CASCADE;
  DROP TABLE "pages_blocks_pencarian_cepat_tag_populer_locales" CASCADE;
  DROP TABLE "pages_blocks_pencarian_cepat" CASCADE;
  DROP TABLE "pages_blocks_pencarian_cepat_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_pencarian_cepat_tag_populer" CASCADE;
  DROP TABLE "_pages_v_blocks_pencarian_cepat_tag_populer_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_pencarian_cepat" CASCADE;
  DROP TABLE "_pages_v_blocks_pencarian_cepat_locales" CASCADE;`)
}
