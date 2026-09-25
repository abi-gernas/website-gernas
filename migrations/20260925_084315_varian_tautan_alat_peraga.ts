import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_produk_tautan_marketplace_platform" AS ENUM('shopee', 'tokopedia');
  CREATE TABLE "produk_varian" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nama" varchar,
  	"harga" numeric
  );
  
  CREATE TABLE "produk_tautan_marketplace" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_produk_tautan_marketplace_platform",
  	"url" varchar
  );
  
  ALTER TABLE "produk_varian" ADD CONSTRAINT "produk_varian_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produk_tautan_marketplace" ADD CONSTRAINT "produk_tautan_marketplace_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "produk_varian_order_idx" ON "produk_varian" USING btree ("_order");
  CREATE INDEX "produk_varian_parent_id_idx" ON "produk_varian" USING btree ("_parent_id");
  CREATE INDEX "produk_tautan_marketplace_order_idx" ON "produk_tautan_marketplace" USING btree ("_order");
  CREATE INDEX "produk_tautan_marketplace_parent_id_idx" ON "produk_tautan_marketplace" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "produk_varian" CASCADE;
  DROP TABLE "produk_tautan_marketplace" CASCADE;
  DROP TYPE "public"."enum_produk_tautan_marketplace_platform";`)
}
